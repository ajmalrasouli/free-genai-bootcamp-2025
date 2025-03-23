import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import type { StudySession, Word, WordReviewItem } from "@shared/schema";
import { Flashcards } from "@/components/activities/Flashcards";

interface WordWithReview extends Word {
  review: WordReviewItem | null;
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
    try {
      const response = await fetch('/api/study-sessions/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: Number(id),
          wordId,
          correct: Boolean(correct),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record review');
      }

      console.log('Review recorded:', { wordId, correct });
    } catch (error) {
      console.error('Error recording review:', error);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) return <div>Session not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Study Session {session.id}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="text-lg">
              {new Date(session.createdAt!).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Group ID</div>
            <div className="text-lg">{session.groupId}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Word Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Dari Word</TableHead>
                <TableHead>English Translation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingWords ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ) : (
                wordsWithReviews?.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="text-right font-medium">
                      {word.dariWord}
                    </TableCell>
                    <TableCell>{word.englishTranslation}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {word.review ? (
                        <span
                          className={
                            word.review.correct ? "text-green-600" : "text-red-600"
                          }
                        >
                          {word.review.correct ? "Correct" : "Incorrect"}
                        </span>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-green-600"
                            onClick={() =>
                              reviewMutation.mutate({ wordId: word.id, correct: true })
                            }
                            disabled={reviewMutation.isPending}
                          >
                            Correct
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600"
                            onClick={() =>
                              reviewMutation.mutate({ wordId: word.id, correct: false })
                            }
                            disabled={reviewMutation.isPending}
                          >
                            Incorrect
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flashcards</CardTitle>
        </CardHeader>
        <CardContent>
          <Flashcards
            words={wordsWithReviews || []}
            onCardReview={handleCardReview}
          />
        </CardContent>
      </Card>
    </div>
  );
}