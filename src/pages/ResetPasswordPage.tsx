import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function ResetPasswordPage() {
  const { session, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !session) {
      setMessage('Abra o link de recuperação enviado por email para alterar sua senha.');
    }
  }, [loading, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(password);
      toast.success('Senha atualizada com sucesso!');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error?.message ?? 'Falha ao atualizar senha');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Redefinir senha" subtitle="Use o link enviado para atualizar sua senha.">
      {session ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="password">
              Nova senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="confirmPassword">
              Confirmar nova senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Atualizando...' : 'Atualizar senha'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link className="text-primary hover:underline" to="/dashboard">
              Voltar ao painel
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{message || 'Validando sessão...'}</p>
          <Link className="text-primary hover:underline" to="/login">
            Voltar ao login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
