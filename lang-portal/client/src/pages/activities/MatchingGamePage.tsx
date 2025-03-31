import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "@/lib/api";
import type { Word } from "@shared/schema";

interface MatchingCard {
  id: number;
  originalId: number;
  content: string;
  type: "dari" | "english";
  isFlipped: boolean;
  isMatched: boolean;
}

export function MatchingGamePage() {
  const [, params] = useRoute("/study/matching/:groupId");
  const groupId = params?.groupId;
  
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  console.log("Matching Game for group:", groupId);

  const { data: words = [], isLoading } = useQuery({
    queryKey: ["/api/words", groupId],
    queryFn: () => fetchJson<Word[]>(groupId ? `/groups/${groupId}/words` : "/words"),
    refetchOnMount: true,
    staleTime: 0
  });

  useEffect(() => {
    console.log("Words loaded for matching game:", words);
    if (words.length > 0) {
      // Get max of 8 pairs (16 cards)
      const gameWords = words.slice(0, 8);
      
      // Create pairs (Dari + English)
      const gameCards: MatchingCard[] = [];
      
      gameWords.forEach((word) => {
        // Dari card
        gameCards.push({
          id: word.id * 2,
          originalId: word.id,
          content: word.dariWord,
          type: "dari",
          isFlipped: false,
          isMatched: false
        });
        
        // English card
        gameCards.push({
          id: word.id * 2 + 1,
          originalId: word.id,
          content: word.englishTranslation,
          type: "english",
          isFlipped: false,
          isMatched: false
        });
      });
      
      // Shuffle cards
      const shuffledCards = [...gameCards].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
    }
  }, [words]);

  const handleCardClick = (cardId: number) => {
    // Ignore clicks if already matched or we already have 2 cards flipped
    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isMatched || flippedCards.length >= 2) return;
    
    // Flip the card
    const newCards = cards.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Check for matches if we have two cards flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const firstCardId = newFlippedCards[0];
      const secondCardId = newFlippedCards[1];
      
      const firstCard = cards.find(c => c.id === firstCardId)!;
      const secondCard = cards.find(c => c.id === secondCardId)!;
      
      // Check if cards match (different types but same originalId)
      if (firstCard.originalId === secondCard.originalId && firstCard.type !== secondCard.type) {
        // Match found
        const matchedCards = newCards.map(card => 
          card.id === firstCardId || card.id === secondCardId
            ? { ...card, isMatched: true }
            : card
        );
        setCards(matchedCards);
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        
        // Check if game is complete
        if (matches + 1 === words.slice(0, 8).length) {
          setIsComplete(true);
        }
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const shuffledCards = cards.map(card => ({ 
      ...card, 
      isFlipped: false, 
      isMatched: false 
    })).sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Matching Game</h1>
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
        <h1 className="text-3xl font-bold">Matching Game</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">
              Matches: {matches} / {Math.min(words.length, 8)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">
              Moves: {moves}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || flippedCards.length >= 2}
            className={`
              aspect-square rounded-lg p-4 flex items-center justify-center
              transition-all duration-300 text-center
              ${card.isFlipped || card.isMatched 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted hover:bg-muted/80'}
              ${card.isMatched ? 'opacity-80' : 'opacity-100'}
            `}
          >
            {(card.isFlipped || card.isMatched) ? (
              <span className={card.type === "dari" ? "text-xl font-bold" : "text-lg"} dir={card.type === "dari" ? "rtl" : "ltr"}>
                {card.content}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Game Complete!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-xl">
                Congratulations! You completed the matching game in {moves} moves.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={resetGame}>
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 