import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, useAnimation, type PanInfo } from 'framer-motion';
import type { Poem } from '../types';
import { getPoemTypography, getTopicLabel } from '../utils/poemTypography';

interface SwipeCardProps {
  poem: Poem;
  onSwipe: (direction: 'left' | 'right') => void;
  onTap: () => void;
  isFront: boolean;
  isActionTrayOpen: boolean;
  swipeResult?: 'left' | 'right' | null;
}

const SWIPE_HINT_STORAGE_KEY = 'poetry-flow-swipe-hint-count';

export const SwipeCard: React.FC<SwipeCardProps> = ({ poem, onSwipe, onTap, isFront, isActionTrayOpen, swipeResult }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  // Rotation based on horizontal swipe distance
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  
  // Clean color overlay showing like (primary color) or nope (danger color) on swipe
  const cardOverlayBg = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(239, 68, 68, 0.08)', 'rgba(0, 0, 0, 0)', 'var(--primary-light)']
  );

  // Opacity indicators for overlays
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const { bodyGapClass, contentGapClass, readingStyle, titleSize } = getPoemTypography(poem);
  const topic = getTopicLabel(poem);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 400) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe('right');
    } else if (info.offset.x < -100 || velocity < -400) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, transition: { duration: 0.18, ease: 'easeOut' } });
    }
  };

  useEffect(() => {
    if (!isFront) {
      controls.set({ x: 0, opacity: 1, y: 12 });
    } else if (swipeResult) {
      const targetX = swipeResult === 'left' ? -500 : 500;
      controls.start({ 
        x: targetX, 
        opacity: 0, 
        transition: { duration: 0.2 } 
      });
    } else {
      controls.start({ y: 0, opacity: 1, x: 0 });
    }
  }, [isFront, swipeResult, controls]);

  useEffect(() => {
    if (!isFront) {
      setShowSwipeHint(false);
      return;
    }

    const seenCount = Number(localStorage.getItem(SWIPE_HINT_STORAGE_KEY) ?? 0);
    if (seenCount >= 3) return;

    setShowSwipeHint(true);
    localStorage.setItem(SWIPE_HINT_STORAGE_KEY, String(seenCount + 1));
    const timer = window.setTimeout(() => setShowSwipeHint(false), 3600);
    return () => window.clearTimeout(timer);
  }, [isFront, poem.id]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 10 : 5,
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: isFront ? 'grab' : 'default',
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onTap={onTap}
      onKeyDown={(event) => {
        if (!isFront || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        onTap();
      }}
      animate={controls}
      initial={isFront ? { opacity: 1 } : { opacity: 1, y: 12 }}
      whileTap={isFront ? { cursor: 'grabbing' } : {}}
      tabIndex={isFront ? 0 : -1}
      role={isFront ? 'button' : undefined}
      aria-label={isFront ? '展开或收起阅读工具' : undefined}
      aria-expanded={isFront ? isActionTrayOpen : undefined}
      className="absolute inset-0 flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div 
        className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-card-border bg-surface shadow-card flex flex-col transition-all duration-300"
      >
        {/* Swipe Feedback Overlay */}
        <motion.div 
          style={{ backgroundColor: cardOverlayBg }} 
          className="absolute inset-0 z-10 pointer-events-none transition-colors duration-150" 
        />

        {/* Swipe Badge Overlays */}
        {isFront && (
          <>
            <motion.div 
              style={{ opacity: likeOpacity }}
              className="hidden sm:block absolute top-8 right-8 z-30 transform rotate-12 border border-primary text-primary bg-surface/90 rounded-lg px-3.5 py-1.5 font-sans font-bold text-sm tracking-widest"
            >
              喜欢
            </motion.div>
            <motion.div 
              style={{ opacity: nopeOpacity }}
              className="hidden sm:block absolute top-8 left-8 z-30 transform -rotate-12 border border-danger text-danger bg-surface/90 rounded-lg px-3.5 py-1.5 font-sans font-bold text-sm tracking-widest"
            >
              跳过
            </motion.div>
          </>
        )}

        {/* Card Content Wrapper */}
        <div className="relative z-20 flex min-h-0 flex-1 flex-col px-2 py-4 text-left sm:p-10">
          <div className="w-full shrink-0 space-y-2 pt-0.5 text-[11px] font-sans tracking-[0.1em] text-text-secondary sm:mt-1 sm:tracking-[0.14em]">
            <div className="flex items-center justify-between gap-3 opacity-75">
              <span className="font-semibold">POETRY FLOW</span>
              {topic && <span className="max-w-[58%] shrink-0 whitespace-nowrap text-right">{topic}</span>}
            </div>
            <div aria-hidden="true" className="flex items-center gap-2 opacity-55">
              <span className="h-px w-8 bg-primary/50 sm:w-12" />
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="h-px flex-1 bg-card-border" />
            </div>
          </div>

          {/* Poem Text Panel */}
          <div className={`flex min-h-0 flex-1 flex-col justify-start items-start ${contentGapClass} pt-8 sm:pt-7 w-full`}>
            <div className="shrink-0 space-y-1.5">
              <h2 style={{ fontSize: titleSize }} className="leading-tight font-serif font-bold text-primary tracking-[0.08em]">
                {poem.title}
              </h2>
            </div>

            <div aria-hidden="true" className="h-px w-12 rounded-full bg-primary/30 sm:w-16" />

            <div
              style={readingStyle}
              className={`shrink-0 max-w-full ${bodyGapClass} font-serif font-medium text-text-primary tracking-[0.025em] sm:tracking-[0.045em] select-text`}
            >
              {poem.lines.map((line, idx) => (
                <p key={idx} className="whitespace-nowrap transition-colors duration-200 hover:text-primary">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isFront && showSwipeHint && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.52, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                className="absolute bottom-20 left-0 right-0 z-30 text-center text-[10px] font-sans tracking-[0.08em] text-text-secondary sm:bottom-6"
              >
                向右喜欢，向左跳过 · 轻触页边展开工具
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
