import { GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold">Ocorrências Escolar</h1>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
