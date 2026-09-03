import React, { useState } from 'react';
import { ExerciseItem, PartnerId } from '../types';
import { ExerciseCartoon } from './ExerciseCartoon';
import { getExerciseBiomechanics } from '../data/exerciseBiomechanicsData';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Flame,
  Activity,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseItem | null;
  workoutTitle?: string;
  partnerId: PartnerId;
  partnerName: string;
  onToggleComplete: (exerciseId: string) => void;
  onNavigateExercise?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ExerciseExecutionModal: React.FC<ExerciseExecutionModalProps> = ({
  isOpen,
  onClose,
  exercise,
  workoutTitle = 'Ficha de Treino',
  partnerId,
  partnerName,
  onToggleComplete,
  onNavigateExercise,
  hasPrev = false,
  hasNext = false,
}) => {
  const [speed, setSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showMuscles, setShowMuscles] = useState<boolean>(true);

  if (!isOpen || !exercise) return null;

  const guide = getExerciseBiomechanics(exercise.name, exercise.muscleGroup);

  const handleToggleDone = () => {
    if (!exercise.completed) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    onToggleComplete(exercise.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Guia Animado de Execução • {partnerName}
              </span>
              <p className="text-xs text-slate-500 line-clamp-1">{workoutTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Hero: Cartoon Animation Centerpiece */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900 border border-slate-800 relative">
            <div className="w-full flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {exercise.muscleGroup}
                </span>
                <span className="text-slate-400 font-medium">
                  {exercise.sets} séries × {exercise.reps} {exercise.targetWeightKg ? `(${exercise.targetWeightKg}kg)` : ''}
                </span>
              </div>

              {/* Toggle muscle glow */}
              <button
                type="button"
                onClick={() => setShowMuscles(!showMuscles)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  showMuscles
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{showMuscles ? 'Músculo Ativo: ON' : 'Músculo Ativo: OFF'}</span>
              </button>
            </div>

            {/* Cartoon Athlete Performing Exact Movement */}
            <div className="my-2">
              <ExerciseCartoon
                exerciseKey={guide.animationKey}
                speed={speed}
                isPaused={isPaused}
                size="lg"
                gender={partnerId === 'partner2' ? 'female' : 'male'}
                highlightMuscles={showMuscles}
                className="shadow-2xl shadow-sky-950/40"
              />
            </div>

            {/* Exercise Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white text-center mt-3">
              {exercise.name}
            </h3>

            {/* Live Playback Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 pt-3 border-t border-slate-800/80 w-full">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
                <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                <span className="text-[10px] text-slate-400 px-2 font-semibold hidden sm:inline">Velocidade:</span>
                {[0.5, 1, 1.5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                      speed === s
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Reset Speed */}
              <button
                type="button"
                onClick={() => {
                  setSpeed(1);
                  setIsPaused(false);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                title="Reiniciar ritmo padrão"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Biomechanical Breakdown Cards */}
          <div className="space-y-4">
            
            {/* Step 1 & 2: Setup & Execução */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px]">1</span>
                  Posição Inicial & Setup
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {guide.biomechanics.setup}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">2</span>
                  Execução & Cadência
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {guide.biomechanics.execution}
                </p>
              </div>
            </div>

            {/* Target Muscles */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Músculos Primários e Secundários em Ação:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {guide.biomechanics.targetMuscles.map((muscle, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-emerald-400" />
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Mistakes to Avoid */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Erros Mais Comuns a Evitar</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {guide.biomechanics.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Coach Tip */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 block mb-0.5">
                  Dica de Alta Performance do Treinador:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{guide.biomechanics.proTip}"
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 shrink-0">
          
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {onNavigateExercise && (
              <>
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => onNavigateExercise('prev')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    hasPrev
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => onNavigateExercise('next')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    hasNext
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Toggle Completed & Close */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleToggleDone}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
                exercise.completed
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
              }`}
            >
              {exercise.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Exercício Concluído!</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Concluir Exercício</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
