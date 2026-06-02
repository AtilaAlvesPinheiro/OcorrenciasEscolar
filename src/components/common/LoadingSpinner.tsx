import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: Props) {
  return (
    <Loader2
      size={size}
      className={cn('animate-spin text-primary', className)}
      aria-label="Carregando"
    />
  );
}
