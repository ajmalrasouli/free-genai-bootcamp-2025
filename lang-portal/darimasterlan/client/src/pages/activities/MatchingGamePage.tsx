import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MatchingGame } from "@/components/activities/MatchingGame";
import type { Word } from "@shared/schema";

export function MatchingGamePage() {
  const [, params] = useRoute("/activities/matching/:groupId");
  const groupId = params?.groupId ? parseInt(params.groupId) : undefined;
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const { data: words = [] } = useQuery<Word[]>({
    queryKey: ["group-words", groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/words`);
      return response.json();
    }
  });

  // Create study session when game starts
  useEffect(() => {
    if (groupId) {
      fetch('/api/study_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId })
      })
      .then(res => res.json())
      .then(data => setSessionId(data.id))
      .catch(error => console.error('Error creating study session:', error));
    }
  }, [groupId]);

  const recordMatchResult = async (wordId: number, correct: boolean) => {
    if (sessionId) {
      try {
        await fetch('/api/word_reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word_id: wordId,
            study_session_id: sessionId,
            correct
          })
        });
      } catch (error) {
        console.error('Error recording match result:', error);
      }
    }
  };

  const handleGameComplete = async (gameScore: number) => {
    setScore(gameScore);
    setGameComplete(true);
  };

  const handleCardMatch = async (wordId: number, matched: boolean) => {
    await recordMatchResult(wordId, matched);
  };

  if (gameComplete) {
    return (
      <div className="container mx-auto py-6 text-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <p className="text-lg mb-4">Your score: {score}%</p>
            <Button onClick={() => window.location.reload()}>
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Matching Game</h1>
      <MatchingGame 
        words={words} 
        onGameComplete={handleGameComplete}
        onCardMatch={handleCardMatch}
      />
    </div>
  );
} 