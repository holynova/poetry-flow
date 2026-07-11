import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, type PanInfo } from 'framer-motion';
import type { Poem } from '../types';

interface SwipeCardProps {
  poem: Poem;
  onSwipe: (direction: 'left' | 'right') => void;
  isFront: boolean;
  swipeResult?: 'left' | 'right' | null;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ poem, onSwipe, isFront, swipeResult }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

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
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  useEffect(() => {
    if (!isFront) {
      controls.set({ x: 0, opacity: 1, scale: 0.95, y: 12 });
    } else if (swipeResult) {
      const targetX = swipeResult === 'left' ? -500 : 500;
      controls.start({ 
        x: targetX, 
        opacity: 0, 
        transition: { duration: 0.2 } 
      });
    } else {
      controls.start({ scale: 1, y: 0, opacity: 1, x: 0 });
    }
  }, [isFront, swipeResult, controls]);

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
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={isFront ? { scale: 1 } : { scale: 0.95, y: 12 }}
      whileTap={isFront ? { cursor: 'grabbing', scale: 1.01 } : {}}
      className="absolute inset-0 flex items-center justify-center select-none"
    >
      <div 
        className="relative w-full h-full rounded-[32px] overflow-hidden border border-card-border bg-surface shadow-card flex flex-col transition-all duration-300"
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
              className="absolute top-8 right-8 z-30 transform rotate-12 border border-primary text-primary bg-surface/90 rounded-lg px-3.5 py-1.5 font-sans font-bold text-sm tracking-widest"
            >
              喜欢
            </motion.div>
            <motion.div 
              style={{ opacity: nopeOpacity }}
              className="absolute top-8 left-8 z-30 transform -rotate-12 border border-danger text-danger bg-surface/90 rounded-lg px-3.5 py-1.5 font-sans font-bold text-sm tracking-widest"
            >
              跳过
            </motion.div>
          </>
        )}

        {/* Card Content Wrapper */}
        <div className="relative z-20 flex-1 flex flex-col p-8 sm:p-10 justify-between items-center text-center">
          {/* Header metadata */}
          <div className="w-full flex justify-between items-center opacity-60 text-[10px] tracking-widest font-sans text-text-secondary mt-1">
            <span>POETRY FLOW</span>
            <div className="flex gap-1.5">
              {poem.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-bold text-[9px]">{t}</span>
              ))}
            </div>
          </div>

          {/* Poem Text Panel */}
          <div className="flex-1 flex flex-col justify-center items-center gap-6 my-4 w-full">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary tracking-wider">
                《{poem.title}》
              </h2>
              <p className="text-text-secondary text-[11px] font-sans tracking-widest uppercase opacity-70">
                {poem.author}
              </p>
            </div>

            {/* Custom Zen styled divider */}
            <div className="w-10 h-[1.5px] bg-primary/20 rounded-full"></div>

            {/* Main Poem lines */}
            <div className="space-y-2.5 sm:space-y-3.5 font-serif font-medium text-text-primary text-base sm:text-[17px] leading-relaxed tracking-widest select-text">
              {poem.lines.map((line, idx) => (
                <p key={idx} className="transition-all duration-200 hover:text-primary">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Footer instruction hint */}
          <div className="w-full opacity-40 text-[9px] tracking-widest font-sans text-text-secondary">
            向右滑动喜欢 · 向左滑动跳过
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
