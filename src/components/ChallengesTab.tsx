import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { ChallengeNode, PartnerId } from '../types';
import {
  GitFork,
  Sparkles,
  Trophy,
  CheckCircle2,
  Circle,
  Lock,
  Flame,
  Award,
  Heart,
  ChevronRight,
  ShieldAlert,
  Dumbbell,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChallengesTab: React.FC = () => {
  const {
    profiles,
    currentPartnerId,
    challenges,
    toggleChallengeNode,
    synergyPoints,
  } = useCouple();

  const [activeBranchFilter, setActiveBranchFilter] = useState<'all' | 'branchA' | 'branchB'>('all');

  const handleCheck = (node: ChallengeNode, pId: PartnerId) => {
    const isBothBefore = node.partner1Done && node.partner2Done;
    toggleChallengeNode(node.id, pId);

    // If this click completes both
    const p1WillBe = pId === 'partner1' ? !node.partner1Done : node.partner1Done;
    const p2WillBe = pId === 'partner2' ? !node.partner2Done : node.partner2Done;

    if (p1WillBe && p2WillBe && !isBothBefore) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#10b981', '#fbbf24', '#0284c7'],
      });
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    if (activeBranchFilter === 'all') return true;
    if (c.branch === 'main') return true;
    return c.branch === activeBranchFilter;
  });

  const totalCompleted = challenges.filter((c) => c.partner1Done && c.partner2Done).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              <GitFork className="w-3.5 h-3.5" />
              <span>Trilhas Ramificadas de Desafios em Casal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Árvore de Quests & Desafios a Dois
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Escolham seu caminho! Ao concluírem nós em dupla, novos ramos são desbloqueados, gerando bônus de imunidade a prendas e troféus exclusivos.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center min-w-[120px]">
              <Trophy className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <div className="text-[11px] text-slate-400">Desafios Vencidos</div>
              <div className="text-base font-black text-white">{totalCompleted} / {challenges.length}</div>
            </div>
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveBranchFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeBranchFilter === 'all'
                ? 'bg-rose-600 text-white border-rose-500 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Visão Geral Completa
          </button>

          <button
            onClick={() => setActiveBranchFilter('branchA')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeBranchFilter === 'branchA'
                ? 'bg-sky-600 text-white border-sky-500 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Ramo A: Guerreiros do Suor (Cardio & HIIT)</span>
          </button>

          <button
            onClick={() => setActiveBranchFilter('branchB')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeBranchFilter === 'branchB'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Ramo B: Gourmet & Mente Zen (Nutrição & Hábito)</span>
          </button>
        </div>
      </div>

      {/* Visual Quest Tree Nodes */}
      <div className="space-y-4">
        {filteredChallenges.map((node, index) => {
          const bothDone = node.partner1Done && node.partner2Done;
          const isBranchA = node.branch === 'branchA';
          const isBranchB = node.branch === 'branchB';

          return (
            <div
              key={node.id}
              className={`relative overflow-hidden rounded-3xl border transition-all p-6 text-white ${
                bothDone
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : !node.unlocked
                  ? 'bg-slate-900/50 border-slate-800/60 opacity-60'
                  : isBranchA
                  ? 'bg-slate-900 border-sky-500/40'
                  : isBranchB
                  ? 'bg-slate-900 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Branch Tag & Stage */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    node.branch === 'main'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isBranchA
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {node.branch === 'main' ? 'Nó Central' : isBranchA ? 'Ramo A: Suor & Movimento' : 'Ramo B: Nutrição & Mente'}
                  </span>

                  <span className="text-xs text-slate-400">
                    Etapa {node.stage}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    +{node.synergyRewardPoints} pts sintonia
                  </span>

                  {bothDone && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conquistado!
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  {!node.unlocked && <Lock className="w-4 h-4 text-slate-500" />}
                  {node.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {node.description}
                </p>
                {node.bonusReward && (
                  <div className="pt-1 text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Recompensa do Casal: <strong>{node.bonusReward}</strong>
                  </div>
                )}
              </div>

              {/* Interactive Dual Checkboxes */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-medium">
                  Confirmação de Execução Individual:
                </div>

                <div className="flex items-center gap-4">
                  {/* Partner 1 Check */}
                  <button
                    onClick={() => handleCheck(node, 'partner1')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                      node.partner1Done
                        ? 'bg-sky-600/30 border-sky-500 text-sky-200'
                        : 'bg-slate-700/60 border-slate-600 text-slate-400 hover:text-white'
                    }`}
                  >
                    <img src={profiles.partner1.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span>{profiles.partner1.name}</span>
                    {node.partner1Done ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {/* Partner 2 Check */}
                  <button
                    onClick={() => handleCheck(node, 'partner2')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                      node.partner2Done
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                        : 'bg-slate-700/60 border-slate-600 text-slate-400 hover:text-white'
                    }`}
                  >
                    <img src={profiles.partner2.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span>{profiles.partner2.name}</span>
                    {node.partner2Done ? (
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
