import React from 'react';
import { Bot, User } from 'lucide-react';
import { clsx } from 'clsx';

export interface AvatarProps {
  role: 'user' | 'assistant' | 'system';
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ role, size = 'md' }: AvatarProps) {
  const isAssistant = role === 'assistant' || role === 'system';

  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center select-none overflow-hidden border shrink-0',
        isAssistant
          ? 'bg-gradient-to-br from-primary to-primary-dark border-primary/20 text-white shadow-md shadow-primary/10'
          : 'bg-zinc-800 border-zinc-700 text-zinc-300',
        sizes[size]
      )}
    >
      {isAssistant ? (
        <Bot className={clsx(size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')} />
      ) : (
        <User className={clsx(size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')} />
      )}
    </div>
  );
}
export default Avatar;
