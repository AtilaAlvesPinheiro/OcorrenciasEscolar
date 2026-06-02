import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';

export function SettingsPage() {
  const { user, profile, updatePassword } = useAuth();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!user) return;
  setSavingProfile(true);
  try {
    const { error: authError } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (authError) throw authError;
    
    // ✅ CORREÇÃO: Cast do from() para any
    const { error } = await (supabase.from('profiles') as any)
      .update({ full_name: fullName })
      .eq('id', user.id);
      
    if (error) throw error;
    toast.success('Dados atualizados com sucesso!');
  } catch (error: any) {
    toast.error(error?.message ?? 'Falha ao atualizar perfil');
  } finally {
    setSavingProfile(false);
  }
};

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword(password);
      setPassword('');
      setConfirmPassword('');
      toast.success('Senha alterada com sucesso!');
    } catch (error: any) {
      toast.error(error?.message ?? 'Falha ao alterar senha');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Configurações</p>
        <h1 className="text-3xl font-semibold">Perfil e segurança</h1>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Perfil</h2>
          <p className="mt-2 text-sm text-muted-foreground">Atualize seus dados de perfil.</p>
          <form className="mt-6 space-y-4" onSubmit={saveProfile}>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="fullName">
                Nome completo
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="email">
                Email
              </label>
              <Input id="email" value={user?.email ?? ''} disabled />
            </div>
            <Button type="submit" className="w-full" disabled={savingProfile}>
              {savingProfile ? 'Salvando...' : 'Salvar perfil'}
            </Button>
          </form>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Alterar senha</h2>
          <p className="mt-2 text-sm text-muted-foreground">Atualize sua senha de acesso.</p>
          <form className="mt-6 space-y-4" onSubmit={changePassword}>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="newPassword">
                Nova senha
              </label>
              <Input
                id="newPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="confirmNewPassword">
                Confirmar nova senha
              </label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={savingPassword}>
              {savingPassword ? 'Atualizando...' : 'Atualizar senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
