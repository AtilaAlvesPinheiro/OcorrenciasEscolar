import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'ghost' | 'default';
  size?: 'icon' | 'default';
  className?: string;
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50',
        variant === 'ghost' && 'bg-transparent text-current hover:bg-accent hover:text-accent-foreground',
        size === 'icon' && 'h-10 w-10 p-0',
        className
      )}
      {...props}
    />
  );
}
