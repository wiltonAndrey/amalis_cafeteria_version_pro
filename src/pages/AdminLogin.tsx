import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated, login, error } = useAdminAuth(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError('Completa email y contraseña.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.ok) {
      navigate('/admin', { replace: true });
      return;
    }

    setFormError('Credenciales invalidas o sesion no disponible.');
  };

  return (
    <div className="min-h-screen bg-[var(--color-espresso)] text-[var(--color-cream)] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-serif font-bold mb-2">Panel de acceso</h1>
        <p className="text-sm text-cream/60 mb-6">Inicia sesion para editar la carta.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm space-y-2">
            <span className="text-cream/70">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream"
              placeholder="admin@amalis.com"
              autoComplete="username"
            />
          </label>

          <label className="block text-sm space-y-2">
            <span className="text-cream/70">Contraseña</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream"
              placeholder="********"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-caramel px-6 py-3 text-xs uppercase tracking-[0.3em] text-brownie disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {(formError || error) && (
          <p role="alert" className="mt-4 text-sm text-rose-200">
            {formError || error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;

