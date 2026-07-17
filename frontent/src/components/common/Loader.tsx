import React from 'react';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export interface LoaderProps {
  type?: 'spinner' | 'skeleton' | 'full';
  count?: number;
}

export function Loader({ type = 'spinner', count = 3 }: LoaderProps) {
  if (type === 'full') {
    return (
      <div className="fixed inset-0 z-50 bg-bg-dark flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-3 bg-gradient-to-r from-primary to-primary-hover rounded-full shadow-lg shadow-primary/30 text-white"
        >
          <Bot className="h-8 w-8" />
        </motion.div>
        <span className="text-sm font-medium text-zinc-400 font-display tracking-wider animate-pulse">
          LOADING MY QWEN...
        </span>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="flex flex-col gap-4 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 w-full animate-pulse">
            <div className="h-9 w-9 rounded-full bg-zinc-800" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-zinc-800 rounded w-1/4" />
              <div className="h-3 bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full"
      />
    </div>
  );
}
export default Loader;
