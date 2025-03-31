import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import type { StudySession, Word, WordReview } from "@shared/schema";
import { Flashcards } from "@/components/activities/Flashcards";

interface WordWithReview extends Word {
  review: WordReview | null;
}

export default function StudySessionShow() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: session, isLoading: isLoadingSession } = useQuery<StudySession>({
    queryKey: [`/api/study_sessions/${id}`],
  });

  const { data: wordsWithReviews, isLoading: isLoadingWords } = useQuery<WordWithReview[]>({
    queryKey: [`/api/study_sessions/${id}/words`],
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ wordId, correct }: { wordId: number; correct: boolean }) => {
      const response = await apiRequest("POST", `/api/study_sessions/${id}/words/${wordId}/review`, { correct });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/study_sessions/${id}/words`] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save review",
        variant: "destructive",
      });
    },
  });

  const handleCardReview = async (wordId: number, correct: boolean) => {
    reviewMutation.mutate({ wordId, correct });
  };

  if (isLoadingSession || isLoadingWords) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !wordsWithReviews) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Session not found</h1>
            <p>This study session could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Started at: {new Date(session.startTime).toLocaleString()}
            </p>
            {session.endTime && (
              <p className="text-sm text-muted-foreground">
                Completed at: {new Date(session.endTime).toLocaleString()}
              </p>
            )}
            {session.score !== undefined && (
              <p className="text-sm text-muted-foreground">
                Score: {session.score}%
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Words</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dari Word</TableHead>
                    <TableHead>Pronunciation</TableHead>
                    <TableHead>English Translation</TableHead>
                    <TableHead>Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wordsWithReviews.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-bold text-lg">{word.dariWord}</TableCell>
                      <TableCell>{word.pronunciation}</TableCell>
                      <TableCell>{word.englishTranslation}</TableCell>
                      <TableCell>
                        {word.review ? (
                          <span className={word.review.correct ? "text-green-600" : "text-red-600"}>
                            {word.review.correct ? "Correct" : "Incorrect"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Not reviewed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {!session.endTime && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Practice</h2>
                <Flashcards
                  words={wordsWithReviews.filter(w => !w.review)}
                  onCardReview={handleCardReview}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}