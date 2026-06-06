import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trophy, Medal, Star } from 'lucide-react';

interface RankingEntry {
  position: number;
  email: string;
  pontuacaoTotal: number;
}

export const RankingPage: React.FC = () => {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRanking = async () => {
    try {
      const response = await api.get('/api/ranking');
      setRanking(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Não foi possível carregar a classificação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 gold-glow">
            <Trophy className="h-4 w-4" />
          </div>
        );
      case 2:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/10 text-slate-355 border border-slate-400/30">
            <Medal className="h-4 w-4" />
          </div>
        );
      case 3:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/10 text-amber-600 border border-amber-700/30">
            <Medal className="h-4 w-4" />
          </div>
        );
      default:
        return <span className="text-slate-400 font-semibold">{position}</span>;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center justify-center sm:justify-start gap-3 text-3xl font-extrabold text-white">
            <Trophy className="h-8 w-8 text-amber-400" />
            Classificação Geral
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Acompanhe a pontuação e suba na tabela fazendo seus palpites certeiros!
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchRanking();
          }}
          className="self-center sm:self-auto rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
        >
          Atualizar Tabela
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-center text-rose-400">
          {error}
        </div>
      ) : ranking.length === 0 ? (
        <div className="rounded-xl glass-panel p-8 text-center text-slate-400">
          Nenhum jogador cadastrado ainda.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-850 glass-panel shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-20 text-center">
                    Posição
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Jogador
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-right w-36">
                    Pontuação Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {ranking.map((row) => (
                  <tr
                    key={row.email}
                    className={`transition duration-150 hover:bg-slate-900/40 ${
                      row.position <= 3 ? 'bg-slate-900/20' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-center flex items-center justify-center">
                      {getRankBadge(row.position)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-100 text-sm">{row.email}</span>
                        {row.position === 1 && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-base text-emerald-400 w-36">
                      {row.pontuacaoTotal} <span className="text-xs font-normal text-slate-500">pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingPage;
