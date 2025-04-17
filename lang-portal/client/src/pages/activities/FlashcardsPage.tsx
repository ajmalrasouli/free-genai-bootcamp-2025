import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson, postJson, patchJson } from "@/lib/api";
import { toast } from "sonner";

// Define correct local Word interface
interface Word {
  id: number;
  dari: string;
  phonetic: string | null;
  english: string;
  notes: string | null;
}

export function FlashcardsPage() {
  const queryClient = useQueryClient();
  const [, params] = useRoute("/study/flashcards/:groupId");
  const [location] = useLocation();
  const groupId = params?.groupId;
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchString = String(location.search || '');
    const searchParams = new URLSearchParams(searchString);
    const id = searchParams.get("sessionId");
    if (id) {
      setSessionId(parseInt(id, 10));
      console.log("Flashcards session ID:", id);
    } else {
      console.error("Session ID missing from URL");
      toast.error("Could not start flashcard session: Session ID is missing.");
    }
  }, [location]);

  const { data: words = [], isLoading } = useQuery({
    queryKey: ["/api/words", groupId],
    queryFn: () => fetchJson<Word[]>(groupId ? `/groups/${groupId}/words` : "/words"),
    refetchOnMount: true,
    staleTime: 0
  });

  const word = words[currentIndex];

  const endSession = async () => {
    if (!sessionId) return;
    try {
      const score = words.length > 0 ? Math.round((correctCount / words.length) * 100) : 0;
      await patchJson(`/study_sessions/${sessionId}`, {
        score,
        correctCount,
        incorrectCount,
        endTime: new Date().toISOString(),
      });
      setSessionComplete(true);
      toast.success("Session complete! Progress saved.");
      await queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      console.log("Session ended and dashboard query invalidated");
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to save session progress.");
    }
  };

  const reviewWord = async (mastered: boolean) => {
    if (!word) return;
    
    // Record correct/incorrect for session stats
    if (mastered) {
      setCorrectCount(prev => prev + 1);
      setReviewMessage("Correct! 🎉");
    } else {
      setIncorrectCount(prev => prev + 1);
      setReviewMessage("Incorrect. Keep practicing!");
    }
    setIsReviewed(true);
    
    if (currentIndex === words.length - 1) {
      const finalCorrectCount = mastered ? correctCount + 1 : correctCount;
      const finalIncorrectCount = !mastered ? incorrectCount + 1 : incorrectCount;
      const finalScore = words.length > 0 ? Math.round((finalCorrectCount / words.length) * 100) : 0;
      
      if (sessionId) {
        try {
          await patchJson(`/study_sessions/${sessionId}`, {
            score: finalScore,
            correctCount: finalCorrectCount,
            incorrectCount: finalIncorrectCount,
            endTime: new Date().toISOString(),
          });
          setSessionComplete(true);
          toast.success("Session complete! Progress saved.");
          await queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
          console.log("Session ended from reviewWord and dashboard query invalidated");
        } catch (error) {
          console.error("Error ending session from reviewWord:", error);
          toast.error("Failed to save session progress.");
        }
      }
    }
  };

  const goToNextCard = () => {
    if (sessionComplete) {
      toast.info("Session finished. Click 'Next Card' again to restart or navigate away.");
      setCurrentIndex(0);
      setShowBack(false);
      setIsReviewed(false);
      setCorrectCount(0);
      setIncorrectCount(0);
      setSessionComplete(false);
      setReviewMessage("");
      return;
    }
    
    if (cardRef.current) {
      cardRef.current.classList.add("animate-flip-out");
      setTimeout(() => {
        setShowBack(false);
        setIsReviewed(false);
        setReviewMessage("");
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
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
                        {word.dari}
                      </p>
                      <p className="text-muted-foreground">{word.phonetic}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-3xl font-bold mb-2">
                        {word.english}
                      </p>
                      <p className="text-muted-foreground italic">
                        {word.notes}
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