import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { ExerciseCartoon } from './ExerciseCartoon';
import {
  Footprints,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  Trophy,
  Heart,
  Plus,
  Settings2,
  Clock,
  Compass,
  Zap,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlternateDayWalkingCardProps {
  compact?: boolean;
}

export const AlternateDayWalkingCard: React.FC<AlternateDayWalkingCardProps> = ({ compact = false }) => {
  const {
    walkGoal,
    toggleWalkCompletion,
    logWalkDetails,
    updateWalkGoalSettings,
    profiles,
    currentPartnerId,
  } = useCouple();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Form state for logging custom walk
  const todayStr = '2026-09-02'; // Simulated synced date
  const todayLog = walkGoal.logs[todayStr] || {
    id: 'walk-' + todayStr,
    date: todayStr,
    dayOfWeek: 'Quarta-feira',
    isScheduledWalkDay: true,
    completedByPartner1: false,
    completedByPartner2: false,
    walkedTogether: false,
    durationMinutes: walkGoal.targetMinutes,
    distanceKm: walkGoal.targetKm,
    stepsCount: walkGoal.targetSteps,
    intensity: 'moderado' as const,
  };

  const [customMinutes, setCustomMinutes] = useState(todayLog.durationMinutes || walkGoal.targetMinutes);
  const [customKm, setCustomKm] = useState(todayLog.distanceKm || walkGoal.targetKm);
  const [customSteps, setCustomSteps] = useState(todayLog.stepsCount || walkGoal.targetSteps);
  const [customIntensity, setCustomIntensity] = useState<'leve' | 'moderado' | 'vigoroso'>(todayLog.intensity || 'moderado');
  const [customNotes, setCustomNotes] = useState(todayLog.notes || '');

  // Settings form
  const [tempTargetMin, setTempTargetMin] = useState(walkGoal.targetMinutes);
  const [tempTargetKm, setTempTargetKm] = useState(walkGoal.targetKm);
  const [tempTargetSteps, setTempTargetSteps] = useState(walkGoal.targetSteps);

  // 7-day cycle representation
  const weekCycle = [
    { day: 'Seg', name: 'Segunda', isWalkDay: true, date: '2026-08-31' },
    { day: 'Ter', name: 'Terça', isWalkDay: false, date: '2026-09-01' },
    { day: 'Qua', name: 'Quarta', isWalkDay: true, date: '2026-09-02', isToday: true },
    { day: 'Qui', name: 'Quinta', isWalkDay: false, date: '2026-09-03' },
    { day: 'Sex', name: 'Sexta', isWalkDay: true, date: '2026-09-04' },
    { day: 'Sáb', name: 'Sábado', isWalkDay: false, date: '2026-09-05' },
    { day: 'Dom', name: 'Domingo', isWalkDay: true, date: '2026-09-06' },
  ];

  const handleQuickToggle = (partnerKey: 'partner1' | 'partner2') => {
    const isCompleted = partnerKey === 'partner1' ? todayLog.completedByPartner1 : todayLog.completedByPartner2;
    if (!isCompleted) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
      });
    }
    toggleWalkCompletion(todayStr, partnerKey);
  };

  const handleSaveDetailedLog = (e: React.FormEvent) => {
    e.preventDefault();
    logWalkDetails({
      date: todayStr,
      durationMinutes: Number(customMinutes),
      distanceKm: Number(customKm),
      stepsCount: Number(customSteps),
      intensity: customIntensity,
      notes: customNotes,
      completedByPartner1: true,
      completedByPartner2: todayLog.completedByPartner2,
      walkedTogether: todayLog.completedByPartner2,
    });
    setIsLogModalOpen(false);
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWalkGoalSettings({
      targetMinutes: Number(tempTargetMin),
      targetKm: Number(tempTargetKm),
      targetSteps: Number(tempTargetSteps),
    });
    setIsSettingsModalOpen(false);
  };

  const isBothCompleted = todayLog.completedByPartner1 && todayLog.completedByPartner2;

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden text-white">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 text-sky-400">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Meta Fixa do Casal
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <Flame className="w-3 h-3 fill-amber-400" />
                {walkGoal.streak} Ciclos Seguidos
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              Caminhada Dia Sim, Dia Não
            </h3>
            <p className="text-xs text-slate-400">
              Rotina intercalada de cárdio para queima de gordura e fortalecimento do casal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition text-xs flex items-center gap-1.5"
            title="Ajustar parâmetros da meta"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden md:inline font-medium">Metas</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Trajeto</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 items-center">
        
        {/* Left: Cartoon Animation & Today's Highlight */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-950/80 to-slate-900/90 border border-slate-800 text-center">
          <div className="relative mb-2">
            <ExerciseCartoon
              exerciseKey="walking"
              speed={1}
              size="md"
              gender="neutral"
              highlightMuscles={true}
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500 text-slate-950 shadow-md">
              Ritmo Saudável
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
              Status de Hoje (Quarta-feira)
            </span>
            <p className="text-sm font-black text-white">
              👟 HOJE É DIA DE CAMINHADA!
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Meta do dia: <strong className="text-white">{walkGoal.targetMinutes} min</strong> ou <strong className="text-white">{walkGoal.targetKm} km</strong> (~{walkGoal.targetSteps.toLocaleString('pt-BR')} passos)
            </p>
          </div>
        </div>

        {/* Right: 7-Day Alternate Cycle Strip & Partner Checkboxes */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* 7-Day Cycle Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Ciclo Semanal Intercalado (Dia Sim, Dia Não):
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                4 Dias Ativos na Semana
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekCycle.map((item) => {
                const log = walkGoal.logs[item.date];
                const isCompletedBoth = log?.completedByPartner1 && log?.completedByPartner2;
                const isCompletedPartial = log && (log.completedByPartner1 || log.completedByPartner2) && !isCompletedBoth;

                return (
                  <div
                    key={item.day}
                    className={`flex flex-col items-center p-2 sm:p-2.5 rounded-2xl border transition text-center relative ${
                      item.isToday
                        ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/30'
                        : item.isWalkDay
                        ? 'bg-slate-800/60 border-slate-700/80'
                        : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    {item.isToday && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black bg-sky-500 text-slate-950 uppercase tracking-tight">
                        Hoje
                      </span>
                    )}

                    <span className="text-[11px] sm:text-xs font-bold text-slate-300">
                      {item.day}
                    </span>

                    <span
                      className={`text-[9px] font-black uppercase tracking-wider my-1 px-1.5 py-0.5 rounded-md ${
                        item.isWalkDay
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.isWalkDay ? 'SIM' : 'NÃO'}
                    </span>

                    {/* Status dot / check */}
                    <div className="mt-1">
                      {item.isWalkDay ? (
                        isCompletedBoth ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950" title="Ambos completaram!">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950 text-white" />
                          </div>
                        ) : isCompletedPartial ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 text-amber-300 flex items-center justify-center text-[10px] font-bold" title="1 de 2 concluiu">
                            1/2
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-slate-600">
                            <Circle className="w-3 h-3" />
                          </div>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">
                          Descanso
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today Partner Action Checkboxes */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-sky-400" />
                Cumprimento do Dia de Hoje ({todayLog.dayOfWeek}):
              </span>

              {isBothCompleted && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                  Caminhada em Casal Concluída! (+50 pts)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Partner 1 (Gabriel) Button */}
              <button
                type="button"
                onClick={() => handleQuickToggle('partner1')}
                className={`flex items-center justify-between p-3 rounded-xl border transition text-left ${
                  todayLog.completedByPartner1
                    ? 'bg-sky-500/20 border-sky-500/60 text-white'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={profiles.partner1.avatar}
                    alt={profiles.partner1.name}
                    className="w-8 h-8 rounded-full object-cover border border-sky-500/50"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">
                      {profiles.partner1.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {todayLog.completedByPartner1
                        ? `Feito às ${todayLog.completedAt || '07:15'} (${todayLog.distanceKm || walkGoal.targetKm}km)`
                        : 'Pendente hoje'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {todayLog.completedByPartner1 ? (
                    <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Partner 2 (Sofia) Button */}
              <button
                type="button"
                onClick={() => handleQuickToggle('partner2')}
                className={`flex items-center justify-between p-3 rounded-xl border transition text-left ${
                  todayLog.completedByPartner2
                    ? 'bg-rose-500/20 border-rose-500/60 text-white'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={profiles.partner2.avatar}
                    alt={profiles.partner2.name}
                    className="w-8 h-8 rounded-full object-cover border border-rose-500/50"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">
                      {profiles.partner2.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {todayLog.completedByPartner2
                        ? `Feito às ${todayLog.completedAt || '18:00'} (${todayLog.distanceKm || walkGoal.targetKm}km)`
                        : 'Pendente hoje'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {todayLog.completedByPartner2 ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-400 fill-rose-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
            Distância da Semana
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-sky-400">{walkGoal.totalKmThisWeek}</span>
            <span className="text-xs text-slate-400">km</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
            Tempo Acumulado
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-400">{walkGoal.totalMinutesThisWeek}</span>
            <span className="text-xs text-slate-400">minutos</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
            Passos Semanais
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-amber-400">~16.000</span>
            <span className="text-xs text-slate-400">passos</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
            Calorias em Dupla
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-400">~840</span>
            <span className="text-xs text-slate-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Modal: Log Detailed Walk */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 sm:p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-sky-400" />
                <h4 className="font-black text-base">Registrar Detalhes da Caminhada</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDetailedLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">
                    Distância (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="30"
                    value={customKm}
                    onChange={(e) => setCustomKm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">
                    Passos Estimados
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={customSteps}
                    onChange={(e) => setCustomSteps(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">
                    Intensidade
                  </label>
                  <select
                    value={customIntensity}
                    onChange={(e) => setCustomIntensity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                  >
                    <option value="leve">Leve (Passeio)</option>
                    <option value="moderado">Moderado (Ritmo Firme)</option>
                    <option value="vigoroso">Vigoroso (Passo Rápido / Subida)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Notas / Memórias do Casal
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ex: Caminhamos juntos no final da tarde, clima agradável..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Settings for Walking Goal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 sm:p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-sky-400" />
                <h4 className="font-black text-base">Configurações da Meta Dia Sim, Dia Não</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Tempo Alvo por Caminhada (minutos)
                </label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={tempTargetMin}
                  onChange={(e) => setTempTargetMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Distância Alvo por Caminhada (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="20"
                  value={tempTargetKm}
                  onChange={(e) => setTempTargetKm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  Meta de Passos Diária nos Dias de Caminhada
                </label>
                <input
                  type="number"
                  step="500"
                  min="2000"
                  max="25000"
                  value={tempTargetSteps}
                  onChange={(e) => setTempTargetSteps(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-2 text-xs text-sky-200">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  O padrão <strong>"Dia Sim, Dia Não"</strong> intercala 1 dia de caminhada aeróbica (40 min) com 1 dia de recuperação ativa, maximizando a queima lipídica sem cansaço excessivo para os treinos de força.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30"
                >
                  Salvar Metas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
