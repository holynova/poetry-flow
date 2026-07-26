import React from 'react';
import { Heart, X, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShare: () => void;
  disabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  onShare,
  disabled,
}) => {
  return (
    <div className="shrink-0 mb-8 px-6 flex items-center justify-center gap-5 z-20 relative">
      {/* Dislike button */}
      <button
        onClick={onSwipeLeft}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-surface shadow-card flex items-center justify-center text-text-secondary border border-card-border hover:text-danger hover:border-danger/30 transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      {/* Share button */}
      <button
        onClick={onShare}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-surface shadow-card flex items-center justify-center text-text-secondary border border-card-border hover:text-primary hover:border-primary/30 transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none"
        title="分享这首诗"
      >
        <Share2 size={23} />
      </button>

      {/* Like button */}
      <button
        onClick={onSwipeRight}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-surface text-primary shadow-card flex items-center justify-center border border-card-border transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none"
        style={{ boxShadow: 'var(--shadow)' }}
      >
        <Heart size={24} fill="currentColor" strokeWidth={1} />
      </button>
    </div>
  );
};
