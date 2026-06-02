import React from 'react';
import { cn } from '@/lib/utils';

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export type SheetContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: 'left' | 'right';
};

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <div className={cn('fixed inset-0 z-40', open ? 'block' : 'hidden')}>
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function SheetContent({ side = 'right', className, children, ...props }: SheetContentProps) {
  return (
    <div
      className={cn(
        'h-full overflow-y-auto bg-background shadow-lg',
        side === 'left' ? 'mr-auto' : 'ml-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SheetTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>;
}
