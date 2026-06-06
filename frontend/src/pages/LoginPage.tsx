import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/ranking');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.Message || 
        err.response?.data?.message || 
        'Ocorreu um erro. Verifique os dados e tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/5 blur-[120px]"></div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl border border-emerald-500/20 emerald-glow">
            ⚽
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Bolão Copa do Mundo 2026
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin ? 'Entre na sua conta para fazer seus palpites' : 'Cadastre-se e participe do bolão'}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-slate-800 bg-slate-900/60 shadow-xl">
          {error && (
            <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Endereço de Email
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Senha
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-3 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full justify-center rounded-xl bg-emerald-600 py-3 px-4 text-sm font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : isLogin ? (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Entrar
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" /> Criar Conta
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-all"
            >
              {isLogin ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
