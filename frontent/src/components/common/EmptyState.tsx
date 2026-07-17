import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="p-4 bg-zinc-900/60 rounded-full border border-zinc-800 text-zinc-500 mb-4"
      >
        <Icon className="h-8 w-8" />
      </motion.div>
      <h3 className="font-display font-medium text-white text-base mb-1.5 select-none">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed select-none">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
export default EmptyState;
