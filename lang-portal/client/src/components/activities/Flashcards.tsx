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
            <h3 className="text-2xl font-bold mb-2">{currentWord.dariWord}</h3>
            <p className="text-muted-foreground">{currentWord.pronunciation}</p>
          </div>

          {/* Show English translation when answer is revealed */}
          {showAnswer && (
            <div className="text-center">
              <p className="text-xl mb-4">{currentWord.englishTranslation}</p>
              {currentWord.exampleSentence && (
                <p className="text-muted-foreground italic">
                  "{currentWord.exampleSentence}"
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            {!showAnswer ? (
              <Button onClick={handleShowAnswer}>Show Answer</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAnswer(false)}
                >
                  Incorrect
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
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