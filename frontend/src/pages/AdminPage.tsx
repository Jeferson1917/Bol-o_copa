import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { showWarning, showError } from '../services/notifications';

interface Match {
  id: number;
  timeA: string;
  timeB: string;
  golsTimeA: number | null;
  golsTimeB: number | null;
  rodada: number;
  status: number; // enum: Agendado = 0, Finalizado = 1
  kickOffTime: string;
}

export const AdminPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Track input state for each match
  const [scores, setScores] = useState<Record<number, { a: string; b: string }>>({});
  const [submittingMap, setSubmittingMap] = useState<Record<number, boolean>>({});

  // Estado para controlar o nosso Modal Customizado Bonitão
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; match: Match | null }>({
    isOpen: false,
    match: null,
  });

  const fetchMatches = async () => {
    try {
      const response = await api.get('/api/admin/matches');
      setMatches(response.data);
      
      // Initialize inputs for scheduled matches
      const initialScores: Record<number, { a: string; b: string }> = {};
      (response.data as Match[]).forEach((m) => {
        initialScores[m.id] = {
          a: m.golsTimeA !== null ? m.golsTimeA.toString() : '',
          b: m.golsTimeB !== null ? m.golsTimeB.toString() : '',
        };
      });
      setScores(initialScores);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar jogos da administração.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleInputChange = (matchId: number, team: 'a' | 'b', val: string) => {
    const sanitized = val.replace(/[^0-9]/g, '');
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: sanitized,
      },
    }));
  };

  // Botão da lista apenas abre o modal
  const handleFinalizeClick = (match: Match) => {
    const score = scores[match.id];
    if (!score || score.a === '' || score.b === '') {
      showWarning('Por favor, informe o placar final completo.');
      return;
    }
    // Abre o modal passando qual jogo será finalizado
    setConfirmModal({ isOpen: true, match });
  };

  // Ação real que acontece ao confirmar dentro do modal
  const executeFinalize = async () => {
    const match = confirmModal.match;
    if (!match) return;

    const score = scores[match.id];
    
    // Fecha o modal
    setConfirmModal({ isOpen: false, match: null });
    setSubmittingMap((prev) => ({ ...prev, [match.id]: true }));
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post(`/api/admin/finalize/${match.id}`, {
        golsTimeA: parseInt(score.a, 10),
        golsTimeB: parseInt(score.b, 10),
      });

      setSuccessMsg(response.data.Message || 'Jogo finalizado e pontos distribuídos!');
      setTimeout(() => setSuccessMsg(''), 5000);
      
      // Correção Ninja: Remove o jogo agendado da lista local sem dar reload na página inteira!
      setMatches((prevMatches) => {
        return prevMatches.map(m => {
          if (m.id === match.id) {
            return { ...m, status: 1, golsTimeA: parseInt(score.a, 10), golsTimeB: parseInt(score.b, 10) };
          }
          return m;
        });
      });

    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.Message || 'Erro ao finalizar a partida.';
      setError(message);
      showError(message);
    } finally {
      setSubmittingMap((prev) => ({ ...prev, [match.id]: false }));
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Group scheduled (Agendado=0) matches by round
  const agendadoMatches = matches.filter(m => m.status === 0);
  const finalizedMatches = matches.filter(m => m.status === 1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 relative">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="flex items-center justify-center sm:justify-start gap-3 text-3xl font-extrabold text-white">
          <Shield className="h-8 w-8 text-amber-500" />
          Painel do Administrador
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Encerre os jogos inserindo os placares oficiais reais. Os pontos serão calculados e distribuídos automaticamente em transação atômica.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-400 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section 1: Matches waiting for final score */}
          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>⚽</span> Partidas Pendentes ({agendadoMatches.length})
            </h2>

            {agendadoMatches.length === 0 ? (
              <div className="rounded-xl glass-panel p-8 text-center text-slate-500">
                Nenhuma partida pendente de finalização.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {agendadoMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 p-5 glass-panel transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                        <span className="bg-slate-950 px-2.5 py-1 rounded-full border border-slate-850 font-medium">
                          Rodada {match.rodada} — {formatDateTime(match.kickOffTime)} BRT
                        </span>
                        <span className="text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          Agendado
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        {/* Team A */}
                        <div className="flex-1 text-center font-bold text-slate-100 pr-2 truncate text-sm">
                          {match.timeA}
                        </div>

                        {/* Admin Inputs */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="-"
                            value={scores[match.id]?.a ?? ''}
                            onChange={(e) => handleInputChange(match.id, 'a', e.target.value)}
                            className="w-12 rounded-lg py-1.5 text-center font-bold text-base bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 focus:outline-none transition"
                          />
                          <span className="text-slate-500 font-bold">x</span>
                          <input
                            type="text"
                            placeholder="-"
                            value={scores[match.id]?.b ?? ''}
                            onChange={(e) => handleInputChange(match.id, 'b', e.target.value)}
                            className="w-12 rounded-lg py-1.5 text-center font-bold text-base bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 focus:outline-none transition"
                          />
                        </div>

                        {/* Team B */}
                        <div className="flex-1 text-center font-bold text-slate-100 pl-2 truncate text-sm">
                          {match.timeB}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-850 flex justify-end">
                      <button
                        onClick={() => handleFinalizeClick(match)}
                        disabled={submittingMap[match.id]}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
                      >
                        {submittingMap[match.id] ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent inline-block"></span>
                        ) : (
                          'Finalizar Partida'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Already Finalized matches (History) */}
          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>✔️</span> Partidas Finalizadas ({finalizedMatches.length})
            </h2>

            {finalizedMatches.length === 0 ? (
              <div className="rounded-xl glass-panel p-8 text-center text-slate-500">
                Nenhum jogo finalizado ainda.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {finalizedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-slate-850/60 bg-slate-950/40 p-4 text-xs flex flex-col justify-between"
                  >
                    <div className="flex justify-between text-slate-500 mb-2">
                      <span>R{match.rodada} — {formatDateTime(match.kickOffTime)} BRT</span>
                      <span className="text-emerald-500 font-semibold">Finalizado</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate pr-1 w-24 text-slate-350">{match.timeA}</span>
                      <span className="font-bold text-slate-100 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                        {match.golsTimeA} x {match.golsTimeB}
                      </span>
                      <span className="truncate pl-1 w-24 text-right text-slate-350">{match.timeB}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL CUSTOMIZADO (SUBSTITUTO DO WINDOW.CONFIRM) --- */}
      {confirmModal.isOpen && confirmModal.match && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 text-left align-middle shadow-2xl transition-all">
            
            {/* Header do Modal */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold leading-6 text-white">
                  Confirmar Encerramento
                </h3>
              </div>
              <button
                onClick={() => setConfirmModal({ isOpen: false, match: null })}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="mt-4">
              <p className="text-sm text-slate-400 mb-4">
                Você está prestes a finalizar permanentemente a partida:
              </p>
              
              <div className="flex items-center justify-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4">
                <span className="text-base font-bold text-white flex-1 text-right">{confirmModal.match.timeA}</span>
                <span className="text-xl font-black text-amber-500 px-3 py-1 bg-amber-500/10 rounded-lg">
                  {scores[confirmModal.match.id]?.a} <span className="text-slate-600 text-sm mx-1">x</span> {scores[confirmModal.match.id]?.b}
                </span>
                <span className="text-base font-bold text-white flex-1 text-left">{confirmModal.match?.timeB}</span>
              </div>

              <p className="text-sm text-amber-500/80 font-medium bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                Atenção: Esta ação calculará os pontos de todos os usuários imediatamente e não pode ser desfeita.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 focus:outline-none transition"
                onClick={() => setConfirmModal({ isOpen: false, match: null })}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus:outline-none transition cursor-pointer"
                onClick={executeFinalize}
              >
                Sim, Encerrar Jogo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;