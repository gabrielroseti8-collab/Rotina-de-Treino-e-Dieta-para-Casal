export type PartnerId = 'partner1' | 'partner2';

export interface PartnerProfile {
  id: PartnerId;
  name: string;
  nickname: string;
  avatar: string;
  color: string; // theme color class or hex
  goalTitle: string;
  weeklyWorkoutGoal: number; // e.g. 5 days
  dailyWaterGoalMl: number; // e.g. 2500 ml
  dailyCaloriesTarget: number; // e.g. 2100 kcal
  dailyProteinGrams: number; // e.g. 150g
  weightKg: number;
  dietaryPreferences: string[];
  dietaryRestrictions: string[];
  favoriteIngredients?: string[];
  dislikedFoods?: string[];
}

export interface FoodSubstitution {
  title: string;
  portion: string;
  reason: string;
  preparationTip: string;
  estimatedCalories: number;
  estimatedProtein: number;
  estimatedCarbs: number;
  estimatedFat: number;
  matchesRestrictions: boolean;
  compatibilityBadge: string;
}

export interface FoodSubstitutionResponse {
  substitutions: FoodSubstitution[];
  nutritionistAdvice: string;
  partnerSynergyTip?: string;
}

export interface AiSubstitutionRecord {
  id: string;
  partnerId: PartnerId;
  partnerName: string;
  mealId: string;
  mealTitle: string;
  mealType: string;
  originalFood: string;
  originalCalories: number;
  originalProtein: number;
  userCustomPrompt?: string;
  substitutions: FoodSubstitution[];
  nutritionistAdvice: string;
  partnerSynergyTip?: string;
  appliedSubstitution?: FoodSubstitution;
  source: string;
  createdAt: string;
  timestamp: number;
}

export interface ExerciseBiomechanics {
  setup: string;
  execution: string;
  targetMuscles: string[];
  commonMistakes: string[];
  proTip: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetWeightKg?: number;
  muscleGroup: string;
  completed: boolean;
  notes?: string;
  animationKey?: string; // e.g. 'squat', 'bench_press', 'lat_pulldown', 'hip_thrust', etc.
  biomechanics?: ExerciseBiomechanics;
}

export interface DailyWorkout {
  id: string;
  dayOfWeek: string; // 'Segunda', 'Terça', etc.
  title: string;
  category: 'Superior' | 'Inferior' | 'Cardio' | 'Funcional' | 'Descanso Ativo';
  estimatedMinutes: number;
  exercises: ExerciseItem[];
  completed: boolean;
  completedAt?: string;
  partnerId: PartnerId;
}

export interface MealItem {
  id: string;
  type: 'Café da Manhã' | 'Almoço' | 'Lanche da Tarde' | 'Jantar' | 'Ceia';
  time: string;
  title: string;
  description: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  completed: boolean;
  completedAt?: string;
  healthyTip?: string;
  isAiSubstituted?: boolean;
  originalDescription?: string;
}

export interface DailyDiet {
  partnerId: PartnerId;
  meals: MealItem[];
  waterIntakeMl: number;
}

export interface WeeklyDayMetric {
  dayName: string; // Seg, Ter, Qua, Qui, Sex, Sab, Dom
  partner1Workout: boolean;
  partner2Workout: boolean;
  partner1DietPercent: number;
  partner2DietPercent: number;
  partner1WaterMl: number;
  partner2WaterMl: number;
}

export interface SmartReminder {
  id: string;
  targetPartnerId: PartnerId | 'both';
  type: 'workout' | 'water' | 'diet' | 'prenda_warning' | 'partner_cheer';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  urgency: 'low' | 'medium' | 'high';
  actionLabel?: string;
  actionKey?: string;
}

export interface ChallengeNode {
  id: string;
  title: string;
  description: string;
  stage: number;
  branch: 'main' | 'branchA' | 'branchB';
  category: 'treino_dupla' | 'alimentacao_juntos' | 'estilo_de_vida';
  partner1Done: boolean;
  partner2Done: boolean;
  unlocked: boolean;
  synergyRewardPoints: number;
  bonusReward?: string;
  parentId?: string;
}

export type DailyPenaltyOptionKey =
  | 'lavar_louca'
  | 'fazer_comida'
  | 'tirar_lixo'
  | 'limpar_gatos'
  | 'preparar_date'
  | 'lavar_estender_roupas'
  | 'massagem_caprichada';

export interface DailyPenaltyOption {
  key: DailyPenaltyOptionKey;
  title: string;
  description: string;
  category: 'tarefa_domestica' | 'culinaria' | 'cuidado_pets' | 'romantico' | 'bem_estar';
  emoji: string;
  durationOrScope: string;
  practicalTip: string;
}

export interface PrendaContract {
  id: string;
  title: string;
  description: string;
  severity: 'divertida' | 'romantica' | 'gastronomica' | 'esforcada';
  suggestedBy: PartnerId;
  targetUser?: PartnerId; // assigned when penalty triggers
  status: 'banco' | 'ativa' | 'paga'; // 'banco' = in pool, 'ativa' = must be paid, 'paga' = settled
  assignedAt?: string;
  settledAt?: string;
  ratingByPartner?: number; // 1 to 5 stars
  proofNotes?: string;
  penaltyKey?: DailyPenaltyOptionKey;
  chosenBy?: PartnerId;
  isDailyGoalPenalty?: boolean;
}

export interface WalkLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // 'Segunda', 'Terça', etc.
  isScheduledWalkDay: boolean; // whether this is an official "Dia Sim"
  completedByPartner1: boolean;
  completedByPartner2: boolean;
  walkedTogether: boolean;
  durationMinutes: number;
  distanceKm: number;
  stepsCount: number;
  intensity: 'leve' | 'moderado' | 'vigoroso';
  completedAt?: string;
  notes?: string;
}

export interface AlternateDayWalkGoal {
  targetMinutes: number; // e.g. 40 min
  targetKm: number; // e.g. 3.5 km
  targetSteps: number; // e.g. 5000 passos
  cyclePattern: 'odd_days' | 'even_days' | 'mon_wed_fri_sun'; // anchor pattern
  streak: number;
  totalKmThisWeek: number;
  totalMinutesThisWeek: number;
  logs: Record<string, WalkLogEntry>; // keyed by date (YYYY-MM-DD)
}

export interface CoupleActivity {
  id: string;
  partnerId: PartnerId;
  type: 'workout_done' | 'meal_done' | 'water_logged' | 'nudge_sent' | 'prenda_triggered' | 'challenge_unlocked' | 'walk_logged';
  title: string;
  timestamp: string;
  reactionEmoji?: string;
}
