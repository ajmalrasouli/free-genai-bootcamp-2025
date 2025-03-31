import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson, postJson } from "@/lib/api";
// import { toast } from "sonner";
import type { Word } from "@shared/schema";

export function FlashcardsPage() {
  const [, params] = useRoute("/study/flashcards/:groupId");
  const groupId = params?.groupId;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: words = [], isLoading } = useQuery({
    queryKey: ["/api/words", groupId],
    queryFn: () => fetchJson<Word[]>(groupId ? `/groups/${groupId}/words` : "/words"),
    refetchOnMount: true,
    staleTime: 0
  });

  const word = words[currentIndex];

  const reviewWord = async (mastered: boolean) => {
    try {
      if (!word) return;
      
      await postJson(`/words/${word.id}/review`, { mastered });
      
      setReviewMessage(mastered ? "Word marked as mastered! 🎉" : "You'll see this word again");
      
      setIsReviewed(true);
    } catch (error) {
      console.error("Error reviewing word:", error);
      setReviewMessage("Failed to record review. Please try again.");
    }
  };

  const goToNextCard = () => {
    if (cardRef.current) {
      cardRef.current.classList.add("animate-flip-out");
      setTimeout(() => {
        setShowBack(false);
        setIsReviewed(false);
        setReviewMessage("");
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // Reset to first card if at the end
          setCurrentIndex(0);
        }
        
        if (cardRef.current) {
          cardRef.current.classList.remove("animate-flip-out");
        }
      }, 150);
    }
  };

  const handleCardClick = () => {
    if (cardRef.current) {
      if (!showBack) {
        cardRef.current.classList.add("animate-flip");
        setTimeout(() => {
          setShowBack(true);
          cardRef.current?.classList.remove("animate-flip");
        }, 150);
      } else {
        cardRef.current.classList.add("animate-flip-back");
        setTimeout(() => {
          setShowBack(false);
          cardRef.current?.classList.remove("animate-flip-back");
        }, 150);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex justify-center">
          <Skeleton className="aspect-[4/3] w-full max-w-md h-64" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No words available for this group. Please select a different group.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <div className="text-muted-foreground">
          Card {currentIndex + 1} of {words.length}
        </div>
      </div>

      <div className="flex justify-center">
        <div 
          ref={cardRef}
          onClick={handleCardClick} 
          className="w-full max-w-md cursor-pointer perspective-1000 transition-transform"
        >
          <Card className="aspect-[4/3] hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-muted-foreground text-sm">
                {showBack ? "English" : "Dari"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-48 p-6">
              {word && (
                <>
                  {!showBack ? (
                    <div className="text-center">
                      <p className="text-3xl font-bold mb-2" dir="rtl">
                        {word.dariWord}
                      </p>
                      <p className="text-muted-foreground">{word.pronunciation}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-3xl font-bold mb-2">
                        {word.englishTranslation}
                      </p>
                      <p className="text-muted-foreground italic">
                        {word.exampleSentence}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {reviewMessage && (
        <div className="text-center text-sm">
          {reviewMessage}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {showBack && !isReviewed && (
          <>
            <Button 
              variant="outline" 
              onClick={() => reviewWord(false)}
              className="w-32"
            >
              Still Learning
            </Button>
            <Button 
              onClick={() => reviewWord(true)}
              className="w-32"
            >
              Mastered
            </Button>
          </>
        )}

        {(isReviewed || !showBack) && (
          <Button onClick={goToNextCard} className="w-32">
            Next Card
          </Button>
        )}
      </div>
    </div>
  );
} 