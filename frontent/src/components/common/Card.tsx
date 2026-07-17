import React, { HTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className,
  hoverEffect = false,
  glow = false,
  ...props
}: CardProps) {
  const Component = hoverEffect ? motion.div : 'div';
  
  const hoverAnimations = hoverEffect
    ? {
        whileHover: { y: -4, scale: 1.01, transition: { duration: 0.2, ease: 'easeOut' } },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <Component
      className={clsx(
        'rounded-xl border border-zinc-800/60 bg-zinc-950/60 backdrop-blur-md overflow-hidden transition-colors duration-200',
        glow && 'glow-border',
        className
      )}
      {...hoverAnimations}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
export default Card;
