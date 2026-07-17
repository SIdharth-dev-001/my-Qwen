import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/20 hover:brightness-110 active:brightness-95',
    secondary: 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:text-white',
    glass: 'bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 active:bg-white/15',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-900',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  return (
    <motion.button
      type={type}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      {...(props as any)}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </motion.button>
  );
}
export default Button;
