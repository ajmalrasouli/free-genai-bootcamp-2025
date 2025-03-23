import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        content: word.dari_word,
        type: 'dari' as const,
        wordId: word.id,
        isFlipped: false,
        isMatched: false
      },
      {
        id: `english-${word.id}`,
        content: word.english_translation,
        type: 'english' as const,
        wordId: word.id,
        isFlipped: false,
        isMatched: false
      }
    ]);

    // Shuffle the cards
    setCards(cardPairs.sort(() => Math.random() - 0.5));
  }, [words]);

  const handleCardClick = (clickedCard: MatchingCard) => {
    if (flippedCards.length === 2 || clickedCard.isMatched || clickedCard.isFlipped) {
      return;
    }

    // Flip the card
    setCards(cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    ));

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      // Check for a match
      if (
        newFlippedCards[0].wordId === newFlippedCards[1].wordId &&
        newFlippedCards[0].type !== newFlippedCards[1].type
      ) {
        // Match found
        setMatches(matches + 1);
        setCards(cards.map(card => 
          card.wordId === newFlippedCards[0].wordId 
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);

        // Record the successful match
        onCardMatch(newFlippedCards[0].wordId, true);

        // Check if game is complete
        if (matches + 1 === words.length) {
          const score = Math.round((words.length / moves) * 100);
          onGameComplete(score);
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards(cards.map(card => 
            newFlippedCards.some(fc => fc.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);

          // Record the failed match for the first card's word
          onCardMatch(newFlippedCards[0].wordId, false);
        }, 1000);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-6">
        <p className="text-lg">
          Matches: {matches}/{words.length} | Moves: {moves}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <Card 
            key={card.id}
            className={cn(
              "cursor-pointer transition-all duration-300 transform",
              card.isFlipped || card.isMatched ? "bg-white" : "bg-gray-100",
              card.isMatched && "opacity-50"
            )}
            onClick={() => handleCardClick(card)}
          >
            <CardContent className="p-6 h-32 flex items-center justify-center text-center">
              {(card.isFlipped || card.isMatched) ? (
                <span className={cn(
                  "text-lg font-medium",
                  card.type === 'dari' && "text-xl"
                )}>
                  {card.content}
                </span>
              ) : (
                <span className="text-gray-400">Click to reveal</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 