import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error(error?.message ?? 'Falha ao enviar email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Recuperar senha" subtitle="Informe seu email para receber o link de recuperação.">
      {submitted ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enviamos um email para <span className="font-medium text-foreground">{email}</span>. Siga as instruções para redefinir sua senha.
          </p>
          <Link className="text-primary hover:underline" to="/login">
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar link'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link className="text-primary hover:underline" to="/login">
              Voltar ao login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
