import { useState, useEffect } from 'react';
import type { Poem } from '../types';
import { poems } from '../data';

const STORAGE_KEY_DECK = 'poetry-flow-deck-ids';

export const useDeck = () => {
  const [cards, setCards] = useState<Poem[]>([]);

  useEffect(() => {
    if (cards.length > 0) return;

    const savedDeckIds = localStorage.getItem(STORAGE_KEY_DECK);
    
    if (savedDeckIds) {
      try {
        const ids = JSON.parse(savedDeckIds) as number[];
        if (ids.length > 0) {
          const restoredDeck = ids
            .map(id => poems.find(p => p.id === id))
            .filter((p): p is Poem => !!p);
          
          if (restoredDeck.length > 0) {
            setCards(restoredDeck);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved deck', e);
      }
    }

    // Fallback: Shuffle and load
    const shuffled = shuffleArray([...poems]);
    setCards(shuffled);
    localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(shuffled.map(c => c.id)));
  }, [cards.length]);

  const recycleCard = (id: number) => {
    setCards((prev) => {
      const cardToMove = prev.find((card) => card.id === id);
      if (!cardToMove) return prev;
      
      const newCards = [...prev.filter((card) => card.id !== id), cardToMove];
      localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(newCards.map(c => c.id)));
      return newCards;
    });
  };

  return { cards, recycleCard };
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
