import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FloatingHeartProps {
  id: number;
  onComplete: (id: number) => void;
}

export const FloatingHeart: React.FC<FloatingHeartProps> = ({ id, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -120, scale: 1.6, rotate: Math.random() * 30 - 15 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute pointer-events-none text-primary z-50"
      style={{ bottom: '80px', right: '40px' }}
    >
      <Heart size={36} fill="currentColor" />
    </motion.div>
  );
};
