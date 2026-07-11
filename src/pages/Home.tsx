import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';
import { usePoemStats } from '../hooks/usePoemStats';
import { useDeck } from '../hooks/useDeck';
import { HomeHeader } from '../components/HomeHeader';
import { ActionButtons } from '../components/ActionButtons';
import { ShareModal } from '../components/ShareModal';
import type { ThemeId } from '../types';

interface HomeProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const Home: React.FC<HomeProps> = ({ currentTheme, onThemeChange }) => {
  const { cards, recycleCard } = useDeck();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { recordAction } = usePoemStats();
  const [hearts, setHearts] = useState<number[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Show stack effect by rendering top 2 cards
  const activeCards = cards.slice(0, 2);

  const addHeart = () => {
    setHearts((prev) => [...prev, Date.now()]);
  };

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h !== id));
  };

  const handleSwipe = (id: number, dir: 'left' | 'right') => {
    setSwipeDirection(dir);
    
    if (dir === 'right') {
      addHeart();
    }

    // Delay deck updates slightly to allow swipe translation animation to finish
    setTimeout(() => {
      const card = cards.find(c => c.id === id);
      if (card) {
        const action = dir === 'right' ? 'like' : 'dislike';
        recordAction(card.id, action);
        recycleCard(card.id);
      }
      setSwipeDirection(null);
    }, 220);
  };

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0) return;
    const topCard = cards[0];
    handleSwipe(topCard.id, direction);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full w-full bg-background text-text-primary overflow-hidden relative"
    >
      <HomeHeader currentTheme={currentTheme} onThemeChange={onThemeChange} />

      {/* Card Stack Workspace */}
      <div className="flex-1 relative flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 my-2 select-none">
        <div className="relative w-full aspect-[3/4.2] max-h-[580px] sm:max-h-[620px]">
          <AnimatePresence>
            {activeCards.map((poem, index) => {
              const isFront = index === 0;
              return (
                <SwipeCard 
                  key={poem.id} 
                  poem={poem} 
                  isFront={isFront}
                  swipeResult={isFront ? swipeDirection : null}
                  onSwipe={(dir) => handleSwipe(poem.id, dir)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <ActionButtons 
        onSwipeLeft={() => handleManualSwipe('left')}
        onSwipeRight={() => handleManualSwipe('right')}
        onShare={() => setIsShareOpen(true)}
        disabled={cards.length === 0}
        hearts={hearts}
        onHeartComplete={removeHeart}
      />

      {/* Share Modal */}
      {cards.length > 0 && (
        <ShareModal 
          poem={cards[0]} 
          isOpen={isShareOpen} 
          onClose={() => setIsShareOpen(false)} 
          theme={currentTheme}
        />
      )}
    </motion.div>
  );
};

export default Home;
