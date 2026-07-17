import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className
}: TooltipProps) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className={clsx('relative group inline-block', className)}>
      {children}
      <div
        className={clsx(
          'absolute z-30 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 ease-out',
          'px-2 py-1 text-[10px] font-medium text-zinc-200 bg-zinc-950 border border-zinc-800 rounded shadow-lg whitespace-nowrap',
          positions[position]
        )}
      >
        {content}
      </div>
    </div>
  );
}
export default Tooltip;
