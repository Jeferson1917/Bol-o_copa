import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Target, Lock, Unlock, Check, AlertCircle, Eye } from 'lucide-react';
import { showWarning, showError, showSuccess } from '../services/notifications';

interface Prediction {
  id: number;
  matchId: number;
  timeA: string;
  timeB: string;
  golsTimeA: number | null;
  golsTimeB: number | null;
  palpiteGolsA: number;
  palpiteGolsB: number;
  pointsGained: number;
  status: string;
  kickOffTime: string;
  isLocked: boolean;
}

interface OtherUserPrediction {
  userName: string;
  palpiteGolsA: number | null;
  palpiteGolsB: number | null;
  pointsGained: number;
  isOwn: boolean;
}

export const PredictionsPage: React.FC = () => {
  const [round, setRound] = useState(1);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingMap, setSavingMap] = useState<Record<number, boolean>>({});
  const [successMap, setSuccessMap] = useState<Record<number, boolean>>({});
  const [editingScores, setEditingScores] = useState<Record<number, { a: string; b: string }>>({});
  
  // Other user predictions modal state
  const [selectedMatch, setSelectedMatch] = useState<Prediction | null>(null);
  const [otherPredictions, setOtherPredictions] = useState<OtherUserPrediction[]>([]);
  const [loadingOthers, setLoadingOthers] = useState(false);

  const fetchPredictions = async (targetRound: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/predictions?rodada=${targetRound}`);
      const data = response.data as Prediction[];
      setPredictions(data);
      
      // Initialize inputs with current predictions
      const editing: Record<number, { a: string; b: string }> = {};
      data.forEach(p => {
        editing[p.matchId] = {
          a: p.palpiteGolsA.toString(),
          b: p.palpiteGolsB.toString(),
        };
      });
      setEditingScores(editing);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar os palpites. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions(round);
  }, [round]);

  const handleInputChange = (matchId: number, team: 'a' | 'b', val: string) => {
    // Only allow positive integers
    const sanitized = val.replace(/[^0-9]/g, '');
    setEditingScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: sanitized,
      }
    }));
  };

  const handleSave = async (matchId: number) => {
    const scores = editingScores[matchId];
    if (!scores || scores.a === '' || scores.b === '') {
      showWarning('Por favor, preencha ambos os palpites.');
      return;
    }

    setSavingMap(prev => ({ ...prev, [matchId]: true }));
    try {
      await api.post('/api/predictions', {
        matchId,
        palpiteGolsA: parseInt(scores.a, 10),
        palpiteGolsB: parseInt(scores.b, 10),
      });

      setSuccessMap(prev => ({ ...prev, [matchId]: true }));
      showSuccess('Palpite salvo com sucesso!');

      // Refresh list to update ID if it was newly created
      const response = await api.get(`/api/predictions?rodada=${round}`);
      setPredictions(response.data);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.Message || 'Erro ao salvar o palpite.';
      showError(message);
    } finally {
      setSavingMap(prev => ({ ...prev, [matchId]: false }));
    }
  };

  const openOthersModal = async (match: Prediction) => {
    setSelectedMatch(match);
    setLoadingOthers(true);
    try {
      const response = await api.get(`/api/predictions/match/${match.matchId}`);
      setOtherPredictions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOthers(false);
    }
  };

  // Compute if round is open for predictions
  const firstMatchTime = predictions.length > 0 
    ? Math.min(...predictions.map(p => new Date(p.kickOffTime).getTime())) 
    : 0;
  const roundOpenTime = firstMatchTime ? new Date(firstMatchTime - 24 * 60 * 60 * 1000) : null;
  const isRoundOpen = roundOpenTime ? new Date() >= roundOpenTime : false;

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

  const getPointsBgColor = (points: number) => {
    if (points === 5) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 emerald-glow';
    if (points === 2) return 'bg-amber-500/10 border-amber-500/30 text-amber-400 gold-glow';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="flex items-center justify-center sm:justify-start gap-3 text-3xl font-extrabold text-white">
          <Target className="h-8 w-8 text-emerald-500" />
          Meus Palpites
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Insira seus palpites para cada jogo. O palpite é fechado individualmente na hora do kickoff. A rodada só abre 24 horas antes do primeiro jogo.
        </p>
      </div>

      {/* Round Switcher */}
      <div className="mb-6 flex justify-center sm:justify-start gap-2">
        {[1, 2, 3].map((r) => (
          <button
            key={r}
            onClick={() => setRound(r)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all cursor-pointer ${
              round === r
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Rodada {r}
          </button>
        ))}
      </div>

      {/* Info Alert about Round Lock */}
      {predictions.length > 0 && !isRoundOpen && roundOpenTime && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Rodada Bloqueada:</span> Os palpites para a Rodada {round} só abrem em{' '}
            <span className="underline font-semibold">{formatDateTime(roundOpenTime.toISOString())} BRT</span> (24h antes do jogo de abertura).
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-center text-rose-400">
          {error}
        </div>
      ) : predictions.length === 0 ? (
        <div className="rounded-xl glass-panel p-8 text-center text-slate-400">
          Nenhum jogo encontrado para esta rodada.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {predictions.map((match) => {
            const isMatchOpen = isRoundOpen && !match.isLocked;
            const isFinalized = match.status === 'Finalizado';
            const editable = isMatchOpen && !isFinalized;

            return (
              <div
                key={match.matchId}
                className={`rounded-2xl border transition-all duration-300 p-5 glass-panel flex flex-col justify-between ${
                  isFinalized 
                    ? getPointsBgColor(match.pointsGained) 
                    : editable 
                      ? 'border-emerald-500/20 hover:border-emerald-500/40' 
                      : 'border-slate-800 opacity-80'
                }`}
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-medium bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                      {formatDateTime(match.kickOffTime)} BRT
                    </span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {isFinalized ? (
                        <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Finalizado
                        </span>
                      ) : match.isLocked ? (
                        <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          <Lock className="h-3 w-3" /> Bloqueado
                        </span>
                      ) : !isRoundOpen ? (
                        <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          <Lock className="h-3 w-3" /> Aguardando 24h
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
                          <Unlock className="h-3 w-3" /> Aberto
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Teams vs Score */}
                  <div className="flex items-center justify-between py-2">
                    {/* Team A */}
                    <div className="flex-1 text-center font-semibold text-slate-100 pr-2 truncate text-sm">
                      {match.timeA}
                    </div>

                    {/* Inputs/Scores Area */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        disabled={!editable}
                        value={editingScores[match.matchId]?.a ?? ''}
                        onChange={(e) => handleInputChange(match.matchId, 'a', e.target.value)}
                        className={`w-12 rounded-lg py-1.5 text-center font-bold text-base border focus:outline-none transition-all ${
                          editable
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                            : 'bg-slate-900 border-slate-850 text-slate-400'
                        }`}
                      />
                      <span className="text-slate-500 font-medium text-xs">x</span>
                      <input
                        type="text"
                        disabled={!editable}
                        value={editingScores[match.matchId]?.b ?? ''}
                        onChange={(e) => handleInputChange(match.matchId, 'b', e.target.value)}
                        className={`w-12 rounded-lg py-1.5 text-center font-bold text-base border focus:outline-none transition-all ${
                          editable
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                            : 'bg-slate-900 border-slate-850 text-slate-400'
                        }`}
                      />
                    </div>

                    {/* Team B */}
                    <div className="flex-1 text-center font-semibold text-slate-100 pl-2 truncate text-sm">
                      {match.timeB}
                    </div>
                  </div>
                </div>

                {/* Footer buttons / information */}
                <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between gap-4">
                  {/* Left: Real results or points */}
                  <div className="text-xs">
                    {isFinalized ? (
                      <div className="text-slate-400 font-medium">
                        Placar Real: <span className="font-bold text-slate-200">{match.golsTimeA} x {match.golsTimeB}</span>
                        <div className="mt-0.5 font-bold text-xs">
                          Ganhos: <span className="text-emerald-400 text-sm">{match.pointsGained} pts</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">Nenhum placar oficial</span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openOthersModal(match)}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-350 hover:bg-slate-850 hover:text-white transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Outros palpites
                    </button>

                    {editable && (
                      <button
                        onClick={() => handleSave(match.matchId)}
                        disabled={savingMap[match.matchId] || successMap[match.matchId]}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer disabled:opacity-50 transition disabled:cursor-not-allowed"
                      >
                        {savingMap[match.matchId] ? (
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        ) : successMap[match.matchId] ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Palpite registrado
                          </>
                        ) : (
                          'Salvar'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Others' Predictions Side-drawer/Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white">Palpites do Confronto</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedMatch.timeA} x {selectedMatch.timeB}
                </p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-white text-sm bg-slate-800 hover:bg-slate-755 h-7 w-7 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 flex-1 space-y-2.5">
              {loadingOthers ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                </div>
              ) : otherPredictions.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-4">Nenhum palpite registrado para este jogo.</p>
              ) : (
                otherPredictions.map((op, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                      op.isOwn
                        ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-355'
                        : 'bg-slate-950/50 border-slate-850'
                    }`}
                  >
                    <div className="truncate pr-4">
                      <span className="font-medium text-slate-200">
                        {op.isOwn ? 'Você' : op.userName.split('@')[0]}
                      </span>
                      <span className="text-xs text-slate-500 block">{op.userName}</span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {op.palpiteGolsA !== null && op.palpiteGolsB !== null ? (
                        <span className="font-bold text-slate-100 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                          {op.palpiteGolsA} x {op.palpiteGolsB}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-550 italic bg-slate-900 border border-slate-800/60 px-2.5 py-1 rounded-lg">
                          Oculto até kickoff
                        </span>
                      )}

                      {selectedMatch.status === 'Finalizado' && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                          +{op.pointsGained} pts
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 text-center">
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-full bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionsPage;
