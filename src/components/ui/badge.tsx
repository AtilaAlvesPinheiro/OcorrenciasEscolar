import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const variantClass = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-black',
    destructive: 'bg-destructive text-destructive-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        variantClass,
        className
      )}
      {...props}
    />
  );
}
