import React from 'react';
import { Heart, X, Share2 } from 'lucide-react';
import { FloatingHeart } from './FloatingHeart';

interface ActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShare: () => void;
  disabled: boolean;
  hearts: number[];
  onHeartComplete: (id: number) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  onShare,
  disabled, 
  hearts, 
  onHeartComplete 
}) => {
  return (
    <div className="shrink-0 mb-8 px-6 flex items-center justify-center gap-6 z-20 relative">
      {/* Dislike button */}
      <button 
        onClick={onSwipeLeft}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-surface shadow-card flex items-center justify-center text-text-secondary border border-card-border hover:text-danger hover:border-danger/30 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
      >
        <X size={28} strokeWidth={2.5} />
      </button>

      {/* Share button */}
      <button 
        onClick={onShare}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-surface shadow-card flex items-center justify-center text-text-secondary border border-card-border hover:text-primary hover:border-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
        title="分享这首诗"
      >
        <Share2 size={22} />
      </button>

      {/* Like button */}
      <div className="relative">
        <button 
          onClick={onSwipeRight}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-surface text-primary shadow-card flex items-center justify-center border border-card-border hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          style={{ boxShadow: 'var(--shadow)' }}
        >
          <Heart size={28} fill="currentColor" strokeWidth={1} />
        </button>
        
        {/* Floating Hearts Animation overlay */}
        <div className="absolute bottom-0 left-0 w-full h-0 flex justify-center overflow-visible pointer-events-none">
          {hearts.map((id) => (
            <FloatingHeart key={id} id={id} onComplete={onHeartComplete} />
          ))}
        </div>
      </div>
    </div>
  );
};
