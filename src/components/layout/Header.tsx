import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/hooks/useTheme';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

export function Header() {
  const { profile, session } = useAuth();
  const { setSidebarOpen } = useUIStore();

  const displayName =
    profile?.full_name ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.email ||
    'Usuário';
  const initials = getInitials(displayName);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </Button>

      <div className="hidden md:block">
        <h1 className="text-lg font-semibold">
          Olá, {displayName.split(' ')[0]} 👋
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell size={18} />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={displayName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-sm md:block">
            <p className="font-medium leading-tight">{displayName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile?.role ?? 'teacher'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
