import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import type { Word } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MatchingCard {
  id: string;
  content: string;
  type: 'dari' | 'english';
  wordId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MatchingGame({ 
  words, 
  onGameComplete,
  onCardMatch 
}: { 
  words: Word[], 
  onGameComplete: (score: number) => void,
  onCardMatch: (wordId: number, matched: boolean) => void
}) {
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MatchingCard[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Create pairs of cards (Dari and English)
    const cardPairs = words.flatMap(word => [
      {
        id: `dari-${word.id}`,
        content: word.dariWord,
        type: 'dari' as const,
        wordId: word.id,
        isFlipped: false,
        isMatched: false
      },
      {
        id: `english-${word.id}`,
        content: word.englishTranslation,
        type: 'english' as const,
        wordId: word.id,
        isFlipped: false,
        isMatched: false
      }
    ]);

    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
  }, [words]);

  const handleCardClick = (clickedCard: MatchingCard) => {
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      const isMatch = first.wordId === second.wordId;

      if (isMatch) {
        const updatedCards = newCards.map(card =>
          card.wordId === first.wordId ? { ...card, isMatched: true } : card
        );
        setCards(updatedCards);
        setMatches(matches + 1);
        onCardMatch(first.wordId, true);
      } else {
        onCardMatch(first.wordId, false);
        setTimeout(() => {
          const resetCards = newCards.map(card =>
            card.id === first.id || card.id === second.id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
        }, 1000);
      }

      setFlippedCards([]);
      setMoves(moves + 1);

      if (matches + (isMatch ? 1 : 0) === words.length) {
        onGameComplete(moves + 1);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "aspect-square cursor-pointer rounded-lg border p-4 flex items-center justify-center text-center transition-all",
                card.isFlipped ? "bg-primary text-primary-foreground" : "bg-muted",
                card.isMatched && "bg-green-500 text-white"
              )}
              onClick={() => handleCardClick(card)}
            >
              {card.isFlipped || card.isMatched ? card.content : "?"}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 