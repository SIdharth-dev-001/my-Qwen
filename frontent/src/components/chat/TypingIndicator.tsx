import React from 'react';
import { motion } from 'motion/react';

export function TypingIndicator() {
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -6, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        delay: i * 0.15,
        ease: 'easeInOut'
      } as any
    })
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800/50 rounded-2xl max-w-[80px] justify-center select-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          variants={dotVariants}
          animate="animate"
          custom={i}
        />
      ))}
    </div>
  );
}

export default TypingIndicator;
