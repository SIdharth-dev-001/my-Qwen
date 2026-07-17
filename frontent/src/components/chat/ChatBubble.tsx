import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { chatBubbleEntrance } from '../../utils/animations';

export interface ChatBubbleProps {
  role: 'user' | 'assistant' | 'system';
  children: ReactNode;
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      variants={chatBubbleEntrance}
      initial="initial"
      animate="animate"
      className={clsx(
        'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all duration-300 relative',
        isUser
          ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-none self-end'
          : 'bg-zinc-900 border border-zinc-800/80 text-zinc-100 rounded-bl-none self-start glow-border'
      )}
    >
      {children}
    </motion.div>
  );
}

export default ChatBubble;
