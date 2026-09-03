import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { PrendaContract, PartnerId, DailyPenaltyOptionKey } from '../types';
import { DAILY_PENALTY_OPTIONS } from '../data/initialData';
import { DailyPrendaSelectorModal } from './DailyPrendaSelectorModal';
import {
  AlertOctagon,
  Sparkles,
  Plus,
  RotateCw,
  Star,
  CheckCircle2,
  Clock,
  Heart,
  Smile,
  Coffee,
  Dumbbell,
  ShieldCheck,
  Award,
  AlertTriangle,
  Scale,
  Utensils,
  CookingPot,
  Trash2,
  Cat,
  Shirt,
  HandHeart,
  Check,
  Footprints
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PrendasTab: React.FC = () => {
  const {
    profiles,
    currentPartnerId,
    prendas,
    workouts,
    walkGoal,
    addPrenda,
    settlePrenda,
    assignPrenda,
    assignDailyGoalPenalty,
    spinPrendaWheel,
  } = useCouple();

  // Daily Prenda Picker Modal
  const [isDailyPickerOpen, setIsDailyPickerOpen] = useState(false);
  const [dailyPickerTarget, setDailyPickerTarget] = useState<PartnerId>('partner1');
  const [dailyPickerReason, setDailyPickerReason] = useState<string>('');

  // Roulette Wheel Animation State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spunResult, setSpunResult] = useState<PrendaContract | null>(null);
  const [spinTargetPartner, setSpinTargetPartner] = useState<PartnerId>('partner1');

  // Settle Prenda Modal State
  const [settlingPrenda, setSettlingPrenda] = useState<PrendaContract | null>(null);
  const [settleRating, setSettleRating] = useState<number>(5);
  const [settleNotes, setSettleNotes] = useState<string>('');

  // Add Custom Prenda Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<PrendaContract['severity']>('divertida');

  const activePrendas = prendas.filter((p) => p.status === 'ativa');
  const poolPrendas = prendas.filter((p) => p.status === 'banco');
  const settledPrendas = prendas.filter((p) => p.status === 'paga');

  // Check today's status (Wednesday / Quarta-feira, 2026-09-02)
  const p1TodayWorkout = workouts.find((w) => w.partnerId === 'partner1' && w.dayOfWeek === 'Quarta-feira');
  const p1WorkoutDone = p1TodayWorkout?.completed ?? false;
  const p1WalkDone = walkGoal.logs['2026-09-02']?.completedByPartner1 ?? false;
  const p1HasPendingGoals = !p1WorkoutDone || !p1WalkDone;

  const p2TodayWorkout = workouts.find((w) => w.partnerId === 'partner2' && w.dayOfWeek === 'Quarta-feira');
  const p2WorkoutDone = p2TodayWorkout?.completed ?? false;
  const p2WalkDone = walkGoal.logs['2026-09-02']?.completedByPartner2 ?? false;
  const p2HasPendingGoals = !p2WorkoutDone || !p2WalkDone;

  const handleOpenDailyPicker = (target: PartnerId, reason?: string) => {
    setDailyPickerTarget(target);
    const victim = profiles[target].name;
    const chooser = profiles[target === 'partner1' ? 'partner2' : 'partner1'].name;
    setDailyPickerReason(
      reason || `${victim} não cumpriu a meta do dia e ${chooser} está escolhendo a prenda!`
    );
    setIsDailyPickerOpen(true);
  };

  const handleQuickDecree = (target: PartnerId, penaltyKey: DailyPenaltyOptionKey) => {
    const penalty = DAILY_PENALTY_OPTIONS.find((opt) => opt.key === penaltyKey);
    if (!penalty) return;
    const chooser = target === 'partner1' ? 'partner2' : 'partner1';
    assignDailyGoalPenalty(
      target,
      penaltyKey,
      `${profiles[target].name} não cumpriu a meta diária e ${profiles[chooser].name} escolheu "${penalty.title}"!`
    );
    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  };

  const handleSpinRoulette = () => {
    if (poolPrendas.length === 0) return;
    setIsSpinning(true);
    setSpunResult(null);

    // Simulate intense wheel spin
    setTimeout(() => {
      const chosen = spinPrendaWheel(spinTargetPartner);
      setSpunResult(chosen);
      setIsSpinning(false);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    }, 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    addPrenda({
      title: newTitle.trim(),
      description: newDesc.trim(),
      severity: newSeverity,
      suggestedBy: currentPartnerId,
    });

    setNewTitle('');
    setNewDesc('');
    setIsAddOpen(false);
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingPrenda) return;

    settlePrenda(settlingPrenda.id, settleRating, settleNotes || 'Prenda cumprida com sucesso e aprovada pelo parceiro!');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
    setSettlingPrenda(null);
    setSettleNotes('');
  };

  const getSeverityBadge = (severity: PrendaContract['severity']) => {
    switch (severity) {
      case 'romantica':
        return { label: 'Romântica ❤️', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'divertida':
        return { label: 'Engraçada / Cômica 😂', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'gastronomica':
        return { label: 'Gastronômica 🍽️', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'esforcada':
        return { label: 'Esforço Físico 🏋️', cls: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      default:
        return { label: 'Divertida', cls: 'bg-slate-700 text-slate-300' };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold mb-2">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Pacto Divertido de Casal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Contrato de Prendas do Casal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Para aquele que não cumprir a meta do dia terá que cumprir a prenda onde o outro parceiro escolhe entre as 7 opções do pacto!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenDailyPicker(currentPartnerId === 'partner1' ? 'partner2' : 'partner1')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-xs sm:text-sm font-black text-white shadow-lg shadow-amber-950/40 transition"
            >
              <Scale className="w-4 h-4" />
              <span>Cobrar Prenda da Meta do Dia</span>
            </button>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-white transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Combinar Nova Prenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regra da Meta do Dia: Escolha da Prenda pelo Parceiro */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 p-6 sm:p-7 text-white shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
              <Scale className="w-3.5 h-3.5" />
              <span>Regra de Ouro: Descumprimento da Meta do Dia</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Pacto Diário: Quem não cumpriu a meta paga a prenda escolhida pelo outro!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Se um dos parceiros não cumprir o treino ou a caminhada planejada para hoje, o outro parceiro tem o direito irrefutável de escolher a prenda a ser paga entre as 7 opções oficiais acordadas:
              <span className="font-semibold text-amber-300"> Lavar a louça, Fazer a comida, Tirar o lixo, Limpar o cocô dos gatos, Preparar o date do dia, Lavar e estender as roupas ou Uma massagem caprichada</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenDailyPicker('partner1')}
              className="px-3.5 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/50 text-sky-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Prenda p/ Gabriel</span>
            </button>
            <button
              onClick={() => handleOpenDailyPicker('partner2')}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Prenda p/ Sofia</span>
            </button>
          </div>
        </div>

        {/* Status Diário de Cada Parceiro Hoje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Gabriel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={profiles.partner1.avatar}
                  alt={profiles.partner1.name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-sky-400"
                />
                <div>
                  <h4 className="font-bold text-base text-white">{profiles.partner1.name}</h4>
                  <span className="text-xs text-slate-400">Metas de Quarta-feira</span>
                </div>
              </div>

              {p1HasPendingGoals ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  ⚠️ Meta Pendente
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✅ 100% Cumprido
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Dumbbell className="w-4 h-4 text-sky-400" />
                  Treino: {p1TodayWorkout?.title || 'Ficha do Dia'}
                </span>
                <span className={`font-bold ${p1WorkoutDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {p1WorkoutDone ? 'Concluído ✓' : 'Não Feito ✗'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  Caminhada "Dia Sim, Dia Não"
                </span>
                <span className={`font-bold ${p1WalkDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {p1WalkDone ? 'Concluída ✓' : 'Pendente ✗'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenDailyPicker('partner1', 'Gabriel não concluiu as metas de treino e caminhada de hoje!')}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Sofia: Escolher Prenda para Gabriel</span>
            </button>
          </div>

          {/* Card Sofia */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={profiles.partner2.avatar}
                  alt={profiles.partner2.name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-rose-400"
                />
                <div>
                  <h4 className="font-bold text-base text-white">{profiles.partner2.name}</h4>
                  <span className="text-xs text-slate-400">Metas de Quarta-feira</span>
                </div>
              </div>

              {p2HasPendingGoals ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  ⚠️ Meta Pendente
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✅ 100% Cumprido
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Dumbbell className="w-4 h-4 text-rose-400" />
                  Treino: {p2TodayWorkout?.title || 'Ficha do Dia'}
                </span>
                <span className={`font-bold ${p2WorkoutDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {p2WorkoutDone ? 'Concluído ✓' : 'Não Feito ✗'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  Caminhada "Dia Sim, Dia Não"
                </span>
                <span className={`font-bold ${p2WalkDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {p2WalkDone ? 'Concluída ✓' : 'Pendente ✗'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenDailyPicker('partner2', 'Sofia não concluiu as metas de treino e caminhada de hoje!')}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Gabriel: Escolher Prenda para Sofia</span>
            </button>
          </div>
        </div>

        {/* As 7 Opções Oficiais do Pacto com Ação Direta */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>As 7 Opções Oficiais do Pacto (Escolha 1-Clique)</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Clique em um dos botões para decretar imediatamente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {DAILY_PENALTY_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 hover:border-amber-400/60 transition flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {opt.durationOrScope}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-white">{opt.title}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                  <button
                    onClick={() => handleQuickDecree('partner1', opt.key)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-200 text-[11px] font-bold transition text-center"
                    title={`Decretar ${opt.title} para Gabriel`}
                  >
                    p/ Gabriel
                  </button>
                  <button
                    onClick={() => handleQuickDecree('partner2', opt.key)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-[11px] font-bold transition text-center"
                    title={`Decretar ${opt.title} para Sofia`}
                  >
                    p/ Sofia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Prendas Ativas em Execução */}
      {activePrendas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-white">
                Prendas Ativas para Pagar ({activePrendas.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Devem ser cumpridas e comprovadas para restabelecer a sinergia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePrendas.map((prenda) => {
              const victim = profiles[prenda.targetUser || 'partner1'];
              const chooser = profiles[prenda.chosenBy || prenda.suggestedBy || (prenda.targetUser === 'partner1' ? 'partner2' : 'partner1')];
              const badge = getSeverityBadge(prenda.severity);

              return (
                <div
                  key={prenda.id}
                  className="rounded-2xl bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-900 border-2 border-red-500/50 p-5 text-white shadow-xl shadow-red-950/30 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={victim.avatar}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border-2 border-red-500/60"
                      />
                      <div>
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>Devedor(a): {victim.name}</span>
                        </div>
                        <div className="text-xs text-slate-300">
                          Escolhida por: <strong className="text-white">{chooser.name}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {prenda.isDailyGoalPenalty && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-amber-400" />
                          Prenda do Dia
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-white">
                      "{prenda.title}"
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {prenda.description}
                    </p>
                  </div>

                  {prenda.proofNotes && (
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                      <strong className="text-amber-400">Motivo:</strong> {prenda.proofNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Ativada {prenda.assignedAt || 'nesta semana'}
                    </span>

                    <button
                      onClick={() => setSettlingPrenda(prenda)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Comprovar & Dar Baixa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Roleta Interativa de Prendas */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Sorteio Aleatório de Penalidades</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Roleta de Prendas do Casal
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Não bateu a meta semanal de 5 treinos ou furou a hidratação? Escolha quem falhou e gire a roleta para sortear a punição divertida!
            </p>

            {/* Target Partner Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 font-semibold">Quem vai pagar a prenda?</span>
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setSpinTargetPartner('partner1')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    spinTargetPartner === 'partner1' ? 'bg-sky-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {profiles.partner1.name}
                </button>
                <button
                  onClick={() => setSpinTargetPartner('partner2')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    spinTargetPartner === 'partner2' ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {profiles.partner2.name}
                </button>
              </div>
            </div>
          </div>

          {/* Wheel Visual Box */}
          <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-3xl flex flex-col items-center justify-center min-w-[260px] text-center">
            <div className={`w-20 h-20 rounded-full border-4 border-amber-400 flex items-center justify-center bg-gradient-to-tr from-amber-500/30 to-rose-500/30 shadow-lg shadow-amber-500/20 mb-4 ${
              isSpinning ? 'animate-spin' : ''
            }`}>
              <RotateCw className="w-9 h-9 text-amber-300" />
            </div>

            <button
              onClick={handleSpinRoulette}
              disabled={isSpinning || poolPrendas.length === 0}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 font-black text-sm text-white shadow-lg shadow-amber-950/40 transition"
            >
              {isSpinning ? 'Girando a Roleta...' : 'GIRAR ROLETA DE PRENDAS'}
            </button>

            <span className="text-[11px] text-slate-400 mt-2">
              {poolPrendas.length} prendas disponíveis no banco
            </span>
          </div>
        </div>

        {/* Spun Result Notification */}
        {spunResult && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-center animate-bounce">
            <span className="text-xs font-bold uppercase tracking-wider block">🚨 Prenda Sorteada!</span>
            <strong className="text-base sm:text-lg text-white">
              {profiles[spunResult.targetUser || 'partner1'].name} deve pagar: "{spunResult.title}"
            </strong>
          </div>
        )}
      </div>

      {/* 3. Banco de Prendas Pré-Acordadas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Banco de Prendas Pré-Acordadas ({poolPrendas.length})
            </h3>
            <p className="text-xs text-slate-400">
              Ideias cadastradas pelo par para serem ativadas quando uma meta for descumprida.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {poolPrendas.map((prenda) => {
            const badge = getSeverityBadge(prenda.severity);
            const author = profiles[prenda.suggestedBy];

            return (
              <div
                key={prenda.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white flex flex-col justify-between gap-3 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sugerida por {author.nickname || author.name}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white">
                    {prenda.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {prenda.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => assignPrenda(prenda.id, 'partner1', 'Ativada manualmente pelo par')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-sky-600/30 text-slate-300 hover:text-sky-300 text-[11px] font-bold border border-slate-700 transition"
                  >
                    Ativar p/ {profiles.partner1.name}
                  </button>
                  <button
                    onClick={() => assignPrenda(prenda.id, 'partner2', 'Ativada manualmente pelo par')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 text-[11px] font-bold border border-slate-700 transition"
                  >
                    Ativar p/ {profiles.partner2.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Histórico de Prendas Pagas com Sucesso */}
      {settledPrendas.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Histórico de Prendas Cumpridas & Perdoadas ({settledPrendas.length})
          </h3>

          <div className="space-y-2">
            {settledPrendas.map((sp) => (
              <div
                key={sp.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300"
              >
                <div>
                  <span className="font-bold text-white">"{sp.title}"</span> — paga em {sp.settledAt}
                  <p className="text-xs text-slate-400 mt-0.5">{sp.proofNotes}</p>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  {Array.from({ length: sp.ratingByPartner || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">({sp.ratingByPartner || 5}/5)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Prenda Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-bold">Combinar Nova Prenda Divertida</h3>
              <p className="text-xs text-slate-400">
                Combinem juntos uma punição divertida caso alguém não cumpra a rotina.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Título da Prenda</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Fazer café na cama domingo, Massagem de 30 min..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descrição / Regras</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explique exatamente como e quando a prenda deve ser paga..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Estilo da Prenda</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="divertida">Engraçada / Cômica 😂</option>
                  <option value="romantica">Romântica & Carinhosa ❤️</option>
                  <option value="gastronomica">Gastronômica (Pagar Jantar / Cozinhar) 🍽️</option>
                  <option value="esforcada">Esforço Físico Extra 🏋️</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow"
                >
                  Salvar no Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Prenda Modal */}
      {settlingPrenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Dar Baixa na Prenda</span>
              <h3 className="text-lg font-bold">"{settlingPrenda.title}"</h3>
              <p className="text-xs text-slate-400 mt-1">
                {profiles[settlingPrenda.targetUser || 'partner1'].name} cumpriu a prenda combinada?
              </p>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Avaliação da Execução pelo Par (1 a 5 estrelas)
                </label>
                <div className="flex gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setSettleRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${star <= settleRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Comentário / Comprovação (opcional)
                </label>
                <input
                  type="text"
                  value={settleNotes}
                  onChange={(e) => setSettleNotes(e.target.value)}
                  placeholder="Ex: Pagou o café na cama impecável com flores!"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettlingPrenda(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow"
                >
                  Aprovar & Perdoar Prenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Oficial de Escolha da Prenda da Meta do Dia */}
      <DailyPrendaSelectorModal
        isOpen={isDailyPickerOpen}
        onClose={() => setIsDailyPickerOpen(false)}
        defaultTargetPartner={dailyPickerTarget}
        failedGoalDescription={dailyPickerReason}
      />

    </div>
  );
};
