import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import {
  Heart,
  Flame,
  Droplets,
  Dumbbell,
  Utensils,
  Send,
  Sparkles,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  SmilePlus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoupleOverviewProps {
  onNavigateTab: (tab: 'treino' | 'dieta' | 'metricas' | 'desafios' | 'prendas') => void;
}

export const CoupleOverview: React.FC<CoupleOverviewProps> = ({ onNavigateTab }) => {
  const {
    profiles,
    currentPartnerId,
    otherPartnerId,
    currentProfile,
    otherProfile,
    workouts,
    diets,
    coupleSyncScore,
    coupleStreak,
    synergyPoints,
    activityFeed,
    sendNudge,
    prendas,
  } = useCouple();

  const [customNudge, setCustomNudge] = useState('');
  const [justCheered, setJustCheered] = useState(false);

  // Active Prenda check
  const activePrendas = prendas.filter((p) => p.status === 'ativa');

  // Stats calculation for Partner 1
  const p1WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner1' && w.completed).length;
  const p1MealsDone = diets.partner1.meals.filter((m) => m.completed).length;
  const p1WaterPercent = Math.min(100, Math.round((diets.partner1.waterIntakeMl / profiles.partner1.dailyWaterGoalMl) * 100));

  // Stats calculation for Partner 2
  const p2WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner2' && w.completed).length;
  const p2MealsDone = diets.partner2.meals.filter((m) => m.completed).length;
  const p2WaterPercent = Math.min(100, Math.round((diets.partner2.waterIntakeMl / profiles.partner2.dailyWaterGoalMl) * 100));

  const handleSendEmojiNudge = (emoji: string, text: string) => {
    sendNudge(text, emoji);
    setJustCheered(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#0284c7', '#10b981', '#fbbf24'],
    });
    setTimeout(() => setJustCheered(false), 2500);
  };

  const handleSendCustomNudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNudge.trim()) return;
    sendNudge(customNudge, '💌');
    setCustomNudge('');
    setJustCheered(true);
    setTimeout(() => setJustCheered(false), 2500);
  };

  // Sync title evaluation
  const getSyncLabel = (score: number) => {
    if (score >= 85) return { text: 'Casal em Alta Performance! 🔥', desc: 'Vocês dois estão batendo metas juntos e blindados contra prendas!' };
    if (score >= 60) return { text: 'Boa Sintonia em Progresso! 💪', desc: 'Mantenham o ritmo para fechar a semana sem pendências.' };
    return { text: 'Alerta de Descompasso! ⚠️', desc: 'Atenção aos treinos e hidratação para evitar a Roleta de Prendas!' };
  };

  const syncInfo = getSyncLabel(coupleSyncScore);

  return (
    <div className="space-y-6">
      
      {/* Active Prenda Alert Banner */}
      {activePrendas.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/50 p-4 sm:p-5 text-white shadow-lg shadow-red-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/30 border border-red-500/50 text-red-400 shrink-0">
                {activePrendas[0].isDailyGoalPenalty ? (
                  <Scale className="w-6 h-6 text-amber-400 animate-pulse" />
                ) : (
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    {activePrendas[0].isDailyGoalPenalty ? '⚖️ Prenda da Meta do Dia' : 'Prenda em Execução'}
                  </span>
                  <span className="text-xs text-slate-300">
                    {activePrendas[0].chosenBy
                      ? `| Escolhida por ${profiles[activePrendas[0].chosenBy].name}`
                      : '| Acordo do Casal'}
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-slate-100">
                  {profiles[activePrendas[0].targetUser || 'partner1'].name} deve cumprir: "{activePrendas[0].title}"
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {activePrendas[0].description}
                </p>
                {activePrendas[0].proofNotes && (
                  <p className="text-[11px] text-amber-300/90 mt-1">
                    {activePrendas[0].proofNotes}
                  </p>
                )}
              </div>
            </div>

            <button
              id="view-active-prenda-btn"
              onClick={() => onNavigateTab('prendas')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold transition shrink-0 shadow-md"
            >
              <span>Verificar Prenda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Couple Synchrony Gauge Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Acompanhamento em Tempo Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {syncInfo.text}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {syncInfo.desc}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Flame className="w-4 h-4 text-amber-400" />
                Streak: <strong>{coupleStreak} dias</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Pontos de Sintonia: <strong>{synergyPoints}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                Parceria Ativa
              </span>
            </div>
          </div>

          {/* Progress Circular/Linear Counter */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[220px]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sintonia do Casal
            </span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400">
              {coupleSyncScore}%
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${coupleSyncScore}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 text-center">
              Baseado em treinos, dieta e desafios cumpridos
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Live Partner Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Partner 1 */}
        <div className={`rounded-2xl border transition-all p-5 sm:p-6 bg-slate-900 ${
          currentPartnerId === 'partner1'
            ? 'border-sky-500/60 ring-1 ring-sky-500/30 shadow-lg shadow-sky-950/20'
            : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={profiles.partner1.avatar}
                alt={profiles.partner1.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-sky-500/60"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white">{profiles.partner1.name}</h3>
                  {currentPartnerId === 'partner1' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Você
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{profiles.partner1.goalTitle}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Meta Semanal</span>
              <p className="text-sm font-bold text-sky-400">
                {p1WorkoutsDone}/{profiles.partner1.weeklyWorkoutGoal} treinos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 text-center">
              <Dumbbell className="w-4 h-4 mx-auto text-sky-400 mb-1" />
              <div className="text-xs text-slate-400">Treinos</div>
              <div className="text-sm font-bold text-white">{p1WorkoutsDone} feitos</div>
            </div>
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 text-center">
              <Utensils className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
              <div className="text-xs text-slate-400">Dieta</div>
              <div className="text-sm font-bold text-white">{p1MealsDone}/5 refeições</div>
            </div>
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 text-center">
              <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
              <div className="text-xs text-slate-400">Água</div>
              <div className="text-sm font-bold text-white">{diets.partner1.waterIntakeMl} ml</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Hidratação ({p1WaterPercent}%)</span>
              <span>{diets.partner1.waterIntakeMl} / {profiles.partner1.dailyWaterGoalMl} ml</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${p1WaterPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Status: Ativo hoje
            </span>
            <button
              onClick={() => onNavigateTab('treino')}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              Ver Rotina <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Partner 2 */}
        <div className={`rounded-2xl border transition-all p-5 sm:p-6 bg-slate-900 ${
          currentPartnerId === 'partner2'
            ? 'border-rose-500/60 ring-1 ring-rose-500/30 shadow-lg shadow-rose-950/20'
            : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={profiles.partner2.avatar}
                alt={profiles.partner2.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-rose-500/60"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white">{profiles.partner2.name}</h3>
                  {currentPartnerId === 'partner2' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Você
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{profiles.partner2.goalTitle}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Meta Semanal</span>
              <p className="text-sm font-bold text-rose-400">
                {p2WorkoutsDone}/{profiles.partner2.weeklyWorkoutGoal} treinos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 text-center">
              <Dumbbell className="w-4 h-4 mx-auto text-rose-400 mb-1" />
              <div className="text-xs text-slate-400">Treinos</div>
              <div className="text-sm font-bold text-white">{p2WorkoutsDone} feitos</div>
            </div>
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 text-center">
              <Utensils className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
              <div className="text-xs text-slate-400">Dieta</div>
              <div className="text-sm font-bold text-white">{p2MealsDone}/5 refeições</div>
            </div>
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 text-center">
              <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
              <div className="text-xs text-slate-400">Água</div>
              <div className="text-sm font-bold text-white">{diets.partner2.waterIntakeMl} ml</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Hidratação ({p2WaterPercent}%)</span>
              <span>{diets.partner2.waterIntakeMl} / {profiles.partner2.dailyWaterGoalMl} ml</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${p2WaterPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Status: Ativo hoje
            </span>
            <button
              onClick={() => onNavigateTab('treino')}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              Ver Rotina <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Daily Goal Prenda Pact Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Pacto da Meta do Dia Ativo</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">7 Opções Oficiais</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Não cumpriu o treino ou caminhada do dia? O parceiro escolhe a prenda: louça, comida, lixo, cocô dos gatos, date, roupas ou massagem!
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('prendas')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold transition shrink-0 shadow flex items-center gap-1.5"
        >
          <span>Cobrar / Escolher Prenda</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Real-time Interaction: Send Nudge & Cheers */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <SmilePlus className="w-5 h-5 text-rose-400" />
              Incentivar {otherProfile.name} em Tempo Real
            </h3>
            <p className="text-xs text-slate-400">
              Mande um cutucão carinhoso ou lembrete para motivar seu par agora mesmo!
            </p>
          </div>

          {justCheered && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
              Incentivo enviado com sucesso! ✨
            </span>
          )}
        </div>

        {/* Quick Emoji Nudge Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSendEmojiNudge('❤️', `Orgulho de você, amor! Vamos bater a meta juntos!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <span>❤️</span>
            <span>Orgulho de você!</span>
          </button>

          <button
            onClick={() => handleSendEmojiNudge('🔥', `Treinei pesado hoje! Quero ver você suar também!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <span>🔥</span>
            <span>Bora treinar!</span>
          </button>

          <button
            onClick={() => handleSendEmojiNudge('💧', `Bebe água! Faltam copos para a sua meta!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <span>💧</span>
            <span>Bebe água agora!</span>
          </button>

          <button
            onClick={() => handleSendEmojiNudge('🥗', `Foco na dieta! Nada de furar antes do jantar!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <span>🥗</span>
            <span>Foco na dieta!</span>
          </button>

          <button
            onClick={() => handleSendEmojiNudge('🎲', `Cuidado com a Prenda! Faltam poucos dias!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <span>🎲</span>
            <span>Cuidado com a prenda!</span>
          </button>

          <button
            onClick={() => handleSendEmojiNudge('⚖️', `Atenção à meta do dia! Se não cumprir, a prenda é minha escolha!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-xs font-semibold text-amber-300 transition"
          >
            <span>⚖️</span>
            <span>Olha a Prenda do Dia!</span>
          </button>
        </div>

        {/* Custom Nudge Input */}
        <form onSubmit={handleSendCustomNudge} className="flex gap-2 pt-2">
          <input
            type="text"
            value={customNudge}
            onChange={(e) => setCustomNudge(e.target.value)}
            placeholder={`Escreva uma mensagem personalizada para ${otherProfile.name}...`}
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
          />
          <button
            type="submit"
            disabled={!customNudge.trim()}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>

      {/* Live Couple Activity Feed */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Feed de Evolução Compartilhada
          </h3>
          <span className="text-xs text-slate-400">Atualizações em tempo real</span>
        </div>

        <div className="space-y-3">
          {activityFeed.slice(0, 5).map((act) => {
            const isP1 = act.partnerId === 'partner1';
            return (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{act.reactionEmoji || '⚡'}</span>
                  <div>
                    <p className="text-slate-200 font-medium">{act.title}</p>
                    <span className="text-[11px] text-slate-400">
                      {profiles[act.partnerId]?.name} às {act.timestamp}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isP1 ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {profiles[act.partnerId]?.nickname || profiles[act.partnerId]?.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
