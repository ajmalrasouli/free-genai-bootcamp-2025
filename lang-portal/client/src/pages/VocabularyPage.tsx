import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "@/lib/api";

// Define the Word type locally
interface Word {
  id: number;
  dari: string;
  phonetic: string | null;
  english: string;
  notes: string | null;
}

export function VocabularyPage() {
  const { data: words = [], isLoading } = useQuery({
    queryKey: ["/api/words"],
    queryFn: () => fetchJson<Word[]>("/words"),
    refetchOnMount: true,
    staleTime: 0
  });

  console.log("Vocabulary words:", words);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">All Words</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vocabulary List</CardTitle>
        </CardHeader>
        <CardContent>
          {words.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No words available. Add words to your vocabulary to see them here.
            </div>
          ) : (
            <div className="space-y-4">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="text-xl font-medium" dir="rtl">
                      {word.dari}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {word.phonetic}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">{word.english}</p>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {word.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 