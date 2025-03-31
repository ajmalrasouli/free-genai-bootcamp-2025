import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchingGame } from "@/components/activities/MatchingGame";
import type { Word } from "@shared/schema";

export function MatchingGamePage() {
  const [, params] = useRoute("/activities/matching/:groupId");
  const groupId = params?.groupId ? parseInt(params.groupId) : undefined;
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  const { data: words = [], isLoading } = useQuery<Word[]>({
    queryKey: ["group-words", groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/words`);
      return response.json();
    }
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

  if (!words.length) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">No words to play</h1>
        <p>This group has no words yet.</p>
      </div>
    );
  }

  const handleGameComplete = (moves: number) => {
    setGameComplete(true);
    setScore(Math.round((words.length / moves) * 100));
  };

  const handleCardMatch = async (wordId: number, matched: boolean) => {
    try {
      await fetch('/api/word_reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word_id: wordId,
          correct: matched
        })
      });
    } catch (error) {
      console.error('Error recording review:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Matching Game</h1>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Match the Words</CardTitle>
          </CardHeader>
          <CardContent>
            {gameComplete ? (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Game Complete!</h2>
                <p className="text-xl">Your score: {score}%</p>
                <Button onClick={() => {
                  setGameComplete(false);
                  setScore(0);
                }}>
                  Play Again
                </Button>
              </div>
            ) : (
              <MatchingGame
                words={words}
                onGameComplete={handleGameComplete}
                onCardMatch={handleCardMatch}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 