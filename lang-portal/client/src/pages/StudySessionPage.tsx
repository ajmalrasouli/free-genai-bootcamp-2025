import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Word } from "@shared/schema";

export function StudySessionPage() {
  const [, params] = useRoute("/study/:groupId");
  const groupId = params?.groupId ? parseInt(params.groupId) : undefined;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const { data: words = [] } = useQuery<Word[]>({
    queryKey: ["group-words", groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/words`);
      return response.json();
    }
  });

  const currentWord = words[currentWordIndex];

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

  const handleAnswer = async (correct: boolean) => {
    if (sessionId && currentWord) {
      try {
        await fetch('/api/word_reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word_id: currentWord.id,
            study_session_id: sessionId,
            correct
          })
        });
        
        setShowAnswer(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } catch (error) {
        console.error('Error recording review:', error);
      }
    }
  };

  if (!currentWord) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">No words to study</h1>
        <p>This group has no words yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Study Session</h1>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{currentWord.dariWord}</h2>
              <p className="text-lg text-gray-600 mb-4">{currentWord.pronunciation}</p>
              
              {showAnswer ? (
                <>
                  <p className="text-xl mb-4">{currentWord.englishTranslation}</p>
                  {currentWord.exampleSentence && (
                    <p className="text-lg text-gray-600 mb-6" dir="rtl">
                      {currentWord.exampleSentence}
                    </p>
                  )}
                  <div className="space-x-4">
                    <Button 
                      onClick={() => handleAnswer(true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Correct
                    </Button>
                    <Button 
                      onClick={() => handleAnswer(false)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Incorrect
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
              )}
              
              <p className="text-sm text-gray-500 mt-6">
                Word {currentWordIndex + 1} of {words.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 