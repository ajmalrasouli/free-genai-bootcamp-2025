import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Word } from "@shared/schema";

interface FlashcardsProps {
  words: Word[];
  onCardReview: (wordId: number, correct: boolean) => void;
  onComplete?: (score: number) => void;
}

export function Flashcards({ words, onCardReview, onComplete }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const currentWord = words[currentIndex];
  const isLastCard = currentIndex === words.length - 1;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct: boolean) => {
    onCardReview(currentWord.id, correct);
    if (correct) {
      setScore(score + 1);
    }

    // Move to next card
    if (isLastCard) {
      onComplete?.(score);
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground text-center">
        Word {currentIndex + 1} of {words.length}
      </div>

      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 space-y-6">
          {/* Always show the Dari word */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 text-right">
              {currentWord.dariWord}
            </div>
          </div>

          {/* Only show these after clicking Show Answer */}
          {showAnswer && (
            <div className="space-y-4">
              <div className="text-center text-lg text-muted-foreground">
                {currentWord.pronunciation}
              </div>
              <div className="text-center text-xl">
                {currentWord.englishTranslation}
              </div>
              {currentWord.exampleSentence && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  {currentWord.exampleSentence}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            {!showAnswer ? (
              <Button onClick={handleShowAnswer} variant="secondary">
                Show Answer
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => handleAnswer(false)} 
                  variant="destructive"
                >
                  Incorrect
                </Button>
                <Button 
                  onClick={() => handleAnswer(true)}
                  variant="default"
                >
                  Correct
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Score: {score} / {currentIndex + 1}
      </div>
    </div>
  );
} 