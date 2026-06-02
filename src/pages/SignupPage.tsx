import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function SignupPage() {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setSubmitting(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Conta criada! Verifique seu email se necessário.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.message ?? 'Falha ao criar conta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Abra sua conta e comece a registrar ocorrências.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="fullName">
            Nome completo
          </label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="password">
            Senha
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
            Confirmar senha
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
          {submitting ? 'Registrando...' : 'Criar conta'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já possui conta?{' '}
          <Link className="text-primary hover:underline" to="/login">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
