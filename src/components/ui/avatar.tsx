import React from 'react';
import { cn } from '@/lib/utils';

export function Avatar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('inline-flex items-center justify-center overflow-hidden rounded-full bg-muted', className)}>
      {children}
    </div>
  );
}

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} className={cn('h-full w-full object-cover', props.className)} />;
}

export function AvatarFallback({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground', className)}>{children}</div>;
}
