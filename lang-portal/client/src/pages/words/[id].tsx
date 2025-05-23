import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            {word.exampleSentence && (
              <div>
                <div className="text-sm text-muted-foreground">Example Sentence</div>
                <div className="text-lg" dir="rtl">{word.exampleSentence}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Study Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
                <div className="text-lg text-green-600">{stats.correct}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Incorrect Answers</div>
                <div className="text-lg text-red-600">{stats.incorrect}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
                <div className="text-lg">
                  {Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
