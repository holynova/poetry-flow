import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';
import { usePoemStats } from '../hooks/usePoemStats';
import { useDeck } from '../hooks/useDeck';
import { HomeHeader } from '../components/HomeHeader';
import { ActionButtons } from '../components/ActionButtons';
import { ShareModal } from '../components/ShareModal';
import { Heart, Share2, X } from 'lucide-react';
import type { ThemeId } from '../types';

interface HomeProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const Home: React.FC<HomeProps> = ({ currentTheme, onThemeChange }) => {
  const { cards, recycleCard } = useDeck();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { recordAction } = usePoemStats();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isActionTrayOpen, setIsActionTrayOpen] = useState(false);

  // Show stack effect by rendering top 2 cards
  const activeCards = cards.slice(0, 2);

  const handleSwipe = (id: number, dir: 'left' | 'right') => {
    setSwipeDirection(dir);
    setIsActionTrayOpen(false);

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
      <div className="hidden sm:block">
        <HomeHeader currentTheme={currentTheme} onThemeChange={onThemeChange} />
      </div>

      <AnimatePresence>
        {isActionTrayOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="sm:hidden absolute inset-x-0 top-0 z-40"
          >
            <HomeHeader currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* On compact screens, reading takes the whole viewport. Swiping remains the primary control. */}
      <div
        className={`flex-1 relative flex min-h-0 w-full max-w-md mx-auto px-2 py-2 transition-[padding] duration-200 sm:items-center sm:justify-center sm:px-4 sm:py-0 sm:my-2 select-none ${
          isActionTrayOpen ? 'pt-[4.75rem]' : ''
        }`}
      >
        <div className="relative h-full w-full sm:aspect-[3/4.2] sm:max-h-[620px]">
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
                  onTap={() => isFront && setIsActionTrayOpen((isOpen) => !isOpen)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden sm:block">
        <ActionButtons
          onSwipeLeft={() => handleManualSwipe('left')}
          onSwipeRight={() => handleManualSwipe('right')}
          onShare={() => setIsShareOpen(true)}
          disabled={cards.length === 0}
        />
      </div>

      <div className="sm:hidden absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex justify-center pointer-events-none">
        <motion.div
          layout
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-card-border bg-surface/92 p-1.5 shadow-card"
        >
          <button
            onClick={() => handleManualSwipe('left')}
            disabled={cards.length === 0}
            aria-label="跳过这首诗"
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary disabled:opacity-30"
          >
            <X size={22} strokeWidth={2.2} />
          </button>

          <AnimatePresence initial={false}>
            {isActionTrayOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.75, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 44 }}
                exit={{ opacity: 0, scale: 0.75, width: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setIsShareOpen(true)}
                disabled={cards.length === 0}
                aria-label="分享这首诗"
                className="flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-card-border text-text-secondary disabled:opacity-30"
              >
                <Share2 size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => handleManualSwipe('right')}
            disabled={cards.length === 0}
            aria-label="喜欢这首诗"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-background disabled:opacity-30"
          >
            <Heart size={21} fill="currentColor" strokeWidth={1.2} />
          </button>
        </motion.div>
      </div>

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
