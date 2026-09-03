import React from 'react';
import { useCouple } from '../context/CoupleContext';
import {
  TrendingUp,
  Award,
  Dumbbell,
  Utensils,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface MetricsTabProps {
  onNavigateToPrendas: () => void;
}

export const MetricsTab: React.FC<MetricsTabProps> = ({ onNavigateToPrendas }) => {
  const {
    profiles,
    workouts,
    diets,
    weeklyMetrics,
    coupleStreak,
    synergyPoints,
    prendas,
    spinPrendaWheel,
  } = useCouple();

  // Calculate actual workouts completed this week
  const p1WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner1' && w.completed).length;
  const p2WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner2' && w.completed).length;

  const p1WorkoutGoal = profiles.partner1.weeklyWorkoutGoal;
  const p2WorkoutGoal = profiles.partner2.weeklyWorkoutGoal;

  const p1WorkoutPercent = Math.min(100, Math.round((p1WorkoutsDone / p1WorkoutGoal) * 100));
  const p2WorkoutPercent = Math.min(100, Math.round((p2WorkoutsDone / p2WorkoutGoal) * 100));

  // Determine Prenda risk status
  const p1Safe = p1WorkoutsDone >= p1WorkoutGoal;
  const p2Safe = p2WorkoutsDone >= p2WorkoutGoal;

  const p1Remaining = p1WorkoutGoal - p1WorkoutsDone;
  const p2Remaining = p2WorkoutGoal - p2WorkoutsDone;

  const activePrendasCount = prendas.filter((p) => p.status === 'ativa').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Métricas de Desempenho Semanal do Casal
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Análise comparativa das metas semanais, consistência na dieta e auditoria de prendas.
        </p>
      </div>

      {/* Auditoria Semanal de Prenda (The Penalty Watchdog) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Auditoria Semanal de Metas & Prendas</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Status de Risco de Prenda da Semana
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              O pacto do casal estipula que quem não cumprir a meta mínima semanal de treinos pagará uma prenda divertida acordada na Roleta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToPrendas}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-red-950/40 transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Ver Banco & Roleta de Prendas</span>
            </button>
          </div>
        </div>

        {/* Status Breakdown for both partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800">
          
          {/* Partner 1 Audit */}
          <div className={`p-4 rounded-2xl border ${
            p1Safe
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : p1Remaining <= 2
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-red-950/20 border-red-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={profiles.partner1.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-bold text-sm text-white">{profiles.partner1.name}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                p1Safe
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : p1Remaining <= 2
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {p1Safe ? 'Meta Cumprida! 🛡️' : `${p1Remaining} treinos restantes`}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {p1Safe
                ? `${profiles.partner1.name} atingiu a meta semanal e está a salvo de qualquer prenda!`
                : `Atenção: faltam ${p1Remaining} treinos para fechar a semana. Caso não complete, o par acionará a prenda!`}
            </p>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  p1Safe ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${p1WorkoutPercent}%` }}
              />
            </div>
          </div>

          {/* Partner 2 Audit */}
          <div className={`p-4 rounded-2xl border ${
            p2Safe
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : p2Remaining <= 2
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-red-950/20 border-red-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={profiles.partner2.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-bold text-sm text-white">{profiles.partner2.name}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                p2Safe
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : p2Remaining <= 2
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {p2Safe ? 'Meta Cumprida! 🛡️' : `${p2Remaining} treinos restantes`}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {p2Safe
                ? `${profiles.partner2.name} atingiu a meta semanal e está a salvo de qualquer prenda!`
                : `Atenção: faltam ${p2Remaining} treinos para fechar a semana. Não deixe a meta escapar!`}
            </p>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  p2Safe ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
                style={{ width: `${p2WorkoutPercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Head-to-Head Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Workouts Done */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Treinos na Semana</span>
            <Dumbbell className="w-4 h-4 text-sky-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{profiles.partner1.name}</span>
                <span className="font-bold">{p1WorkoutsDone} / {p1WorkoutGoal}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${p1WorkoutPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{profiles.partner2.name}</span>
                <span className="font-bold">{p2WorkoutsDone} / {p2WorkoutGoal}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${p2WorkoutPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Ritmo do Casal:</span>
            <span className="font-bold text-emerald-400">{p1WorkoutsDone + p2WorkoutsDone} treinos combinados</span>
          </div>
        </div>

        {/* Metric 2: Diet Adherence */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aderência à Dieta</span>
            <Utensils className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{profiles.partner1.name}</span>
                <span className="font-bold">92% conformidade</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `92%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{profiles.partner2.name}</span>
                <span className="font-bold">96% conformidade</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `96%` }} />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Destaque Nutrição:</span>
            <span className="font-bold text-rose-300">{profiles.partner2.name} liderando! ⭐</span>
          </div>
        </div>

        {/* Metric 3: Water Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hidratação Média Diária</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{profiles.partner1.name}</span>
                <span className="font-bold">{diets.partner1.waterIntakeMl} ml</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (diets.partner1.waterIntakeMl / profiles.partner1.dailyWaterGoalMl) * 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>{profiles.partner2.name}</span>
                <span className="font-bold">{diets.partner2.waterIntakeMl} ml</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${Math.min(100, (diets.partner2.waterIntakeMl / profiles.partner2.dailyWaterGoalMl) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Volume Total Conjunto:</span>
            <span className="font-bold text-blue-400">
              {((diets.partner1.waterIntakeMl + diets.partner2.waterIntakeMl) / 1000).toFixed(1)} Litros
            </span>
          </div>
        </div>

      </div>

      {/* Weekly History Table / Bar visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
        <h3 className="font-bold text-base text-white">
          Histórico Diário da Semana Atual
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">Dia</th>
                <th className="pb-3 font-semibold">{profiles.partner1.name} (Treino)</th>
                <th className="pb-3 font-semibold">{profiles.partner2.name} (Treino)</th>
                <th className="pb-3 font-semibold">Dieta % Média</th>
                <th className="pb-3 font-semibold">Água Total</th>
                <th className="pb-3 font-semibold text-right">Status do Casal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {weeklyMetrics.map((day) => {
                const bothTrained = day.partner1Workout && day.partner2Workout;
                const waterSum = ((day.partner1WaterMl + day.partner2WaterMl) / 1000).toFixed(1);
                const dietAvg = Math.round((day.partner1DietPercent + day.partner2DietPercent) / 2);

                return (
                  <tr key={day.dayName} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 font-bold text-white">{day.dayName}</td>
                    <td className="py-3.5">
                      {day.partner1Workout ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                        </span>
                      ) : (
                        <span className="text-slate-500">Pendente</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {day.partner2Workout ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                        </span>
                      ) : (
                        <span className="text-slate-500">Pendente</span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-300">
                      {dietAvg > 0 ? `${dietAvg}%` : '-'}
                    </td>
                    <td className="py-3.5 text-slate-300">
                      {waterSum !== '0.0' ? `${waterSum} L` : '-'}
                    </td>
                    <td className="py-3.5 text-right">
                      {bothTrained ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          🔥 Dupla Imparável
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
