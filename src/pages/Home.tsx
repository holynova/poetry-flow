import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';
import { usePoemStats } from '../hooks/usePoemStats';
import { useDeck } from '../hooks/useDeck';
import { HomeHeader } from '../components/HomeHeader';
import { ActionButtons } from '../components/ActionButtons';
import { ShareModal } from '../components/ShareModal';
import { Heart, RotateCcw, Share2, X } from 'lucide-react';
import type { ThemeId, UserAction } from '../types';

interface HomeProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const Home: React.FC<HomeProps> = ({ currentTheme, onThemeChange }) => {
  const { cards, recycleCard, restoreCard } = useDeck();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { recordAction, undoAction } = usePoemStats();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isActionTrayOpen, setIsActionTrayOpen] = useState(false);
  const [recentAction, setRecentAction] = useState<UserAction | null>(null);
  const undoTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
  }, []);

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
        const recordedAction = recordAction(card.id, action);
        recycleCard(card.id);
        if (undoTimer.current) window.clearTimeout(undoTimer.current);
        setRecentAction(recordedAction);
        undoTimer.current = window.setTimeout(() => setRecentAction(null), 4200);
      }
      setSwipeDirection(null);
    }, 220);
  };

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0) return;
    const topCard = cards[0];
    handleSwipe(topCard.id, direction);
  };

  const handleUndo = () => {
    if (!recentAction) return;
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    undoAction(recentAction);
    restoreCard(recentAction.poemId);
    setRecentAction(null);
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
        className={`flex-1 relative flex min-h-0 w-full max-w-md mx-auto px-4 py-3 transition-[padding] duration-200 sm:items-center sm:justify-center sm:px-4 sm:py-0 sm:my-2 select-none ${
          isActionTrayOpen ? 'pt-[4.75rem] pb-[5.5rem] sm:pt-0 sm:pb-0' : 'pb-[5.5rem] sm:pb-0'
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
                  isActionTrayOpen={isActionTrayOpen}
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
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-card-border bg-surface/96 p-1.5 shadow-sm"
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
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 44 }}
                exit={{ opacity: 0, width: 0 }}
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

      <AnimatePresence>
        {recentAction && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="status"
            className="absolute inset-x-0 bottom-[5.25rem] z-30 flex justify-center px-4 pointer-events-none sm:bottom-24"
          >
            <div className="pointer-events-auto flex items-center gap-3 border border-card-border bg-surface/96 px-3 py-2 text-xs font-sans text-text-secondary shadow-sm">
              <span>{recentAction.action === 'like' ? '已喜欢' : '已跳过'}</span>
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-text-primary"
              >
                <RotateCcw size={14} />
                撤销
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
