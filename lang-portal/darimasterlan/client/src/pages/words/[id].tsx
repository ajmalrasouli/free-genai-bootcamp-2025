import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Word } from "@shared/schema";

export default function WordShow() {
  const { id } = useParams();

  const { data: word, isLoading } = useQuery<Word>({
    queryKey: [`/api/words/${id}`],
  });

  const { data: stats } = useQuery<{ correct: number; incorrect: number }>({
    queryKey: [`/api/words/${id}/stats`],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!word) return <div>Word not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{word.dariWord}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Word Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Pronunciation</div>
              <div className="text-lg">{word.pronunciation}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">English Translation</div>
              <div className="text-lg">{word.englishTranslation}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Example Sentence</div>
              <div className="text-lg text-right">{word.exampleSentence}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats?.correct || 0}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats?.incorrect || 0}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
