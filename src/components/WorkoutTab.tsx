import React, { useState, useEffect } from 'react';
import { useCouple } from '../context/CoupleContext';
import { DailyWorkout, PartnerId, ExerciseItem } from '../types';
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertCircle,
  Eye,
  Activity,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseCartoon, detectExerciseKey } from './ExerciseCartoon';
import { ExerciseExecutionModal } from './ExerciseExecutionModal';
import { AlternateDayWalkingCard } from './AlternateDayWalkingCard';

export const WorkoutTab: React.FC = () => {
  const {
    profiles,
    currentPartnerId,
    workouts,
    toggleExercise,
    toggleWorkoutCompletion,
    addCustomExercise,
  } = useCouple();

  const [selectedPartnerId, setSelectedPartnerId] = useState<PartnerId>(currentPartnerId);
  const [selectedDay, setSelectedDay] = useState<string>('Segunda-feira');
  
  // Exercise Execution Modal State
  const [activeExecutionExercise, setActiveExecutionExercise] = useState<ExerciseItem | null>(null);

  // Custom Exercise Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExGroup, setNewExGroup] = useState('Geral');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState('12');
  const [newExWeight, setNewExWeight] = useState(20);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [initialTime, setInitialTime] = useState<number>(60);

  // Sync selected partner if user changes from top navbar
  useEffect(() => {
    setSelectedPartnerId(currentPartnerId);
  }, [currentPartnerId]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play a small beep chime or alert
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setInitialTime(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const currentPartnerWorkouts = workouts.filter((w) => w.partnerId === selectedPartnerId);
  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];

  const activeWorkout = currentPartnerWorkouts.find((w) => w.dayOfWeek === selectedDay) || currentPartnerWorkouts[0];

  const handleToggleComplete = (w: DailyWorkout) => {
    if (!w.completed) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    toggleWorkoutCompletion(w.id);
  };

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkout || !newExName.trim()) return;

    addCustomExercise(activeWorkout.id, {
      name: newExName.trim(),
      muscleGroup: newExGroup,
      sets: Number(newExSets),
      reps: String(newExReps),
      targetWeightKg: Number(newExWeight),
    });

    setNewExName('');
    setIsAddModalOpen(false);
  };

  const completedExercisesCount = activeWorkout ? activeWorkout.exercises.filter((e) => e.completed).length : 0;
  const totalExercisesCount = activeWorkout ? activeWorkout.exercises.length : 0;
  const workoutProgress = totalExercisesCount > 0 ? Math.round((completedExercisesCount / totalExercisesCount) * 100) : 0;

  const currentExerciseIndex = activeWorkout && activeExecutionExercise
    ? activeWorkout.exercises.findIndex((e) => e.id === activeExecutionExercise.id)
    : -1;

  const handleNavigateExercise = (direction: 'prev' | 'next') => {
    if (!activeWorkout || currentExerciseIndex === -1) return;
    const nextIndex = direction === 'next' ? currentExerciseIndex + 1 : currentExerciseIndex - 1;
    if (nextIndex >= 0 && nextIndex < activeWorkout.exercises.length) {
      setActiveExecutionExercise(activeWorkout.exercises[nextIndex]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Partner Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-sky-400" />
            Rotina de Treinos Personalizada
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Ficha de treino adaptada aos objetivos individuais e sessões conjuntas de casal.
          </p>
        </div>

        {/* Partner Select Buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setSelectedPartnerId('partner1')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedPartnerId === 'partner1'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <img
              src={profiles.partner1.avatar}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>{profiles.partner1.name}</span>
          </button>

          <button
            onClick={() => setSelectedPartnerId('partner2')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedPartnerId === 'partner2'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <img
              src={profiles.partner2.avatar}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>{profiles.partner2.name}</span>
          </button>
        </div>
      </div>

      {/* Alternate-Day Walking Goal Card (Meta Dia Sim, Dia Não) */}
      <AlternateDayWalkingCard />

      {/* Week Day Pills */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
        {days.map((day) => {
          const workoutForDay = currentPartnerWorkouts.find((w) => w.dayOfWeek === day);
          const isDone = workoutForDay?.completed;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{day.split('-')[0]}</span>
              {isDone && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Workout Card */}
      {activeWorkout && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6">
          
          {/* Workout Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                  {activeWorkout.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  ~{activeWorkout.estimatedMinutes} min
                </span>
                {activeWorkout.completed && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    Concluído às {activeWorkout.completedAt || 'Hoje'}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {activeWorkout.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Foco de {profiles[selectedPartnerId].name}: {profiles[selectedPartnerId].goalTitle}
              </p>
            </div>

            {/* Workout Complete Button */}
            <div className="flex items-center gap-3">
              <button
                id="toggle-workout-complete-btn"
                onClick={() => handleToggleComplete(activeWorkout)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
                  activeWorkout.completed
                    ? 'bg-emerald-600/90 text-white hover:bg-emerald-600'
                    : 'bg-sky-600 hover:bg-sky-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeWorkout.completed ? 'Treino Concluído!' : 'Marcar Treino Pronto'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar for Exercises */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Progresso dos Exercícios ({completedExercisesCount}/{totalExercisesCount})</span>
              <span>{workoutProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${workoutProgress}%` }}
              />
            </div>
          </div>

          {/* Exercises Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider">
                Exercícios do Treino
              </h4>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Exercício
              </button>
            </div>

            <div className="space-y-3">
              {activeWorkout.exercises.map((ex, idx) => {
                const animKey = detectExerciseKey(ex.name, ex.muscleGroup);
                return (
                  <div
                    key={ex.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all gap-3 ${
                      ex.completed
                        ? 'bg-slate-800/40 border-emerald-500/40 text-slate-400'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleExercise(activeWorkout.id, ex.id)}
                        className="text-slate-400 focus:outline-none shrink-0"
                        title={ex.completed ? 'Marcar como não feito' : 'Concluir exercício'}
                      >
                        {ex.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                        )}
                      </button>

                      {/* Mini cartoon animation thumbnail */}
                      <div
                        onClick={() => setActiveExecutionExercise(ex)}
                        className="cursor-pointer group shrink-0 relative"
                        title="Clique para ver o desenho animado e postura perfeita"
                      >
                        <ExerciseCartoon
                          exerciseKey={animKey}
                          speed={1}
                          size="sm"
                          gender={selectedPartnerId === 'partner2' ? 'female' : 'male'}
                          highlightMuscles={true}
                          className="w-12 h-12 rounded-xl group-hover:border-sky-500 transition shadow"
                        />
                        <span className="absolute -bottom-1 -right-1 p-0.5 rounded bg-sky-500 text-slate-950 shadow">
                          <Eye className="w-2.5 h-2.5" />
                        </span>
                      </div>

                      {/* Exercise Name & Sets/Reps */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm sm:text-base truncate">
                            {idx + 1}. {ex.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/80 text-slate-300 border border-slate-600/50">
                            {ex.muscleGroup}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {ex.sets} séries × {ex.reps} repetições {ex.targetWeightKg ? `• Carga: ${ex.targetWeightKg} kg` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Cartoon Modal Trigger + Completed Badge */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700/50">
                      <button
                        type="button"
                        onClick={() => setActiveExecutionExercise(ex)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition group"
                        title="Ver animação e biomecânica"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform" />
                        <span>Ver Desenho Animado</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExercise(activeWorkout.id, ex.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition shrink-0 ${
                          ex.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {ex.completed ? 'Concluído' : `${ex.sets}x`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integrated Rest Timer Widget */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cronômetro de Descanso entre Séries</h4>
                <p className="text-xs text-slate-400">Descanse o tempo ideal para maximizar os resultados.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl font-black font-mono text-amber-300 bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-700">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition"
                  title={isTimerRunning ? 'Pausar' : 'Iniciar'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(initialTime);
                  }}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => startTimer(45)}
                  className="px-2 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  45s
                </button>
                <button
                  onClick={() => startTimer(60)}
                  className="px-2 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  60s
                </button>
                <button
                  onClick={() => startTimer(90)}
                  className="px-2 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  90s
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-400" />
              Adicionar Exercício à Ficha
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Personalize o treino de {selectedDay} para {profiles[selectedPartnerId].name}.
            </p>

            <form onSubmit={handleAddExerciseSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Exercício</label>
                <input
                  type="text"
                  required
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="Ex: Elevação Pélvica, Supino Reto..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Grupo Muscular</label>
                  <select
                    value={newExGroup}
                    onChange={(e) => setNewExGroup(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Peitoral">Peitoral</option>
                    <option value="Costas">Costas</option>
                    <option value="Quadríceps">Quadríceps</option>
                    <option value="Posterior">Posterior</option>
                    <option value="Glúteos">Glúteos</option>
                    <option value="Ombros">Ombros</option>
                    <option value="Bíceps">Bíceps</option>
                    <option value="Tríceps">Tríceps</option>
                    <option value="Core">Core / Abdômen</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Carga Alvo (kg)</label>
                  <input
                    type="number"
                    value={newExWeight}
                    onChange={(e) => setNewExWeight(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Séries</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newExSets}
                    onChange={(e) => setNewExSets(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Repetições</label>
                  <input
                    type="text"
                    value={newExReps}
                    onChange={(e) => setNewExReps(e.target.value)}
                    placeholder="Ex: 10-12 ou 45s"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white"
                >
                  Adicionar ao Treino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exercise Biomechanics & Animated Cartoon Modal */}
      {activeExecutionExercise && (
        <ExerciseExecutionModal
          isOpen={Boolean(activeExecutionExercise)}
          onClose={() => setActiveExecutionExercise(null)}
          exercise={activeExecutionExercise}
          workoutTitle={activeWorkout?.title || 'Ficha de Treino'}
          partnerId={selectedPartnerId}
          partnerName={profiles[selectedPartnerId].name}
          onToggleComplete={(exId) => {
            if (activeWorkout) {
              toggleExercise(activeWorkout.id, exId);
              setActiveExecutionExercise((prev) => prev ? { ...prev, completed: !prev.completed } : null);
            }
          }}
          onNavigateExercise={handleNavigateExercise}
          hasPrev={currentExerciseIndex > 0}
          hasNext={Boolean(activeWorkout && currentExerciseIndex < activeWorkout.exercises.length - 1)}
        />
      )}

    </div>
  );
};
