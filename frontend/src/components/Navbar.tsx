import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Target, Shield, LogOut, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <span className="text-xl">⚽</span>
              <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                Bolão Copa 2026
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/ranking" className={linkClass('/ranking')}>
                <Trophy className="h-4 w-4" />
                Classificação
              </Link>
              <Link to="/predictions" className={linkClass('/predictions')}>
                <Target className="h-4 w-4" />
                Meus Palpites
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className={linkClass('/admin')}>
                  <Shield className="h-4 w-4" />
                  Painel Admin
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-850 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/ranking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Trophy className="h-5 w-5 text-emerald-400" />
            Classificação
          </Link>
          <Link
            to="/predictions"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Target className="h-5 w-5 text-emerald-400" />
            Meus Palpites
          </Link>
          {user?.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Shield className="h-5 w-5 text-amber-400" />
              Painel Admin
            </Link>
          )}
          <div className="pt-4 pb-2 border-t border-slate-800 mt-2">
            <div className="flex items-center px-3 mb-2 text-xs text-slate-400">
              Conectado como: {user?.email}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-rose-950/20"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
