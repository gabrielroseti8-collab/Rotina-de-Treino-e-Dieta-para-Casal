import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { PartnerId, MealItem } from '../types';
import {
  Utensils,
  Droplets,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Apple,
  Info,
  Clock,
  Sparkles,
  ShieldAlert,
  Wand2,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeminiSubstitutionModal } from './GeminiSubstitutionModal';

export const DietTab: React.FC = () => {
  const {
    profiles,
    currentPartnerId,
    diets,
    toggleMeal,
    revertMealFood,
    addWater,
  } = useCouple();

  const [selectedPartnerId, setSelectedPartnerId] = useState<PartnerId>(currentPartnerId);
  const [selectedMealForSub, setSelectedMealForSub] = useState<MealItem | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const currentDiet = diets[selectedPartnerId];
  const currentProfile = profiles[selectedPartnerId];

  // Calculate consumed macros from completed meals
  const consumedMacros = currentDiet.meals.reduce(
    (acc, meal) => {
      if (meal.completed) {
        acc.calories += meal.calories;
        acc.protein += meal.proteinGrams;
        acc.carbs += meal.carbsGrams;
        acc.fat += meal.fatGrams;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const mealsDoneCount = currentDiet.meals.filter((m) => m.completed).length;
  const dietProgressPercent = Math.round((mealsDoneCount / currentDiet.meals.length) * 100);

  const waterPercent = Math.min(100, Math.round((currentDiet.waterIntakeMl / currentProfile.dailyWaterGoalMl) * 100));

  const handleMealCheck = (meal: MealItem) => {
    if (!meal.completed) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
    toggleMeal(selectedPartnerId, meal.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Partner Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-400" />
            Dieta & Nutrição Personalizada
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Cardápio calculado para metas energéticas e recuperação muscular do casal.
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

      {/* Gemini AI Smart Nutritionist Feature Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-rose-950/40 border border-indigo-500/30 rounded-3xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-indigo-950/20">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shrink-0 mt-0.5 shadow-md shadow-rose-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-base sm:text-lg text-white">
                Substituição Inteligente com Gemini IA
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Faltou algum ingrediente ou quer variar o cardápio sem sair dos macros? O Gemini calcula equivalentes nutricionais exatos em tempo real, respeitando rigorosamente as restrições de <strong className="text-white">{currentProfile.name}</strong>.
            </p>

            {/* Profile badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-semibold text-slate-400">Restrições ativas de {currentProfile.name}:</span>
              {currentProfile.dietaryRestrictions && currentProfile.dietaryRestrictions.length > 0 ? (
                currentProfile.dietaryRestrictions.map((res, i) => (
                  <span
                    key={`res-${i}`}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  >
                    ⚠️ {res}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic">Nenhuma restrição</span>
              )}

              {currentProfile.dietaryPreferences && currentProfile.dietaryPreferences.slice(0, 2).map((pref, i) => (
                <span
                  key={`pref-${i}`}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30"
                >
                  🎯 {pref}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentDiet.meals.length > 0) {
              setSelectedMealForSub(currentDiet.meals[0]);
              setIsSubModalOpen(true);
            }
          }}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-600/25 transition"
        >
          <Wand2 className="w-4 h-4" />
          <span>Sugerir para 1ª Refeição</span>
        </button>
      </div>

      {/* Macros & Calories Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Calories Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calorias</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {consumedMacros.calories} <span className="text-xs font-normal text-slate-400">/ {currentProfile.dailyCaloriesTarget} kcal</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (consumedMacros.calories / currentProfile.dailyCaloriesTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proteínas</span>
            <Apple className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {consumedMacros.protein}g <span className="text-xs font-normal text-slate-400">/ {currentProfile.dailyProteinGrams}g</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-rose-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (consumedMacros.protein / currentProfile.dailyProteinGrams) * 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carboidratos</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {consumedMacros.carbs}g <span className="text-xs font-normal text-slate-400">consumidos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Energia balanceada para os treinos</p>
        </div>

        {/* Fats Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gorduras Boas</span>
            <Apple className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {consumedMacros.fat}g <span className="text-xs font-normal text-slate-400">consumidas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Azeite, castanhas e abacate</p>
        </div>

      </div>

      {/* Hydration Tracker Station */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                Estação de Hidratação ({currentProfile.name})
              </h3>
              <p className="text-xs text-slate-400">
                Meta diária: <strong>{currentProfile.dailyWaterGoalMl} ml</strong> • Registrado hoje: <strong>{currentDiet.waterIntakeMl} ml</strong> ({waterPercent}%)
              </p>
            </div>
          </div>

          {/* Quick Water Log Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => addWater(selectedPartnerId, 250)}
              className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250ml (Copo)</span>
            </button>
            <button
              onClick={() => addWater(selectedPartnerId, 500)}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500ml (Garrafa)</span>
            </button>
          </div>
        </div>

        {/* Water Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0 ml</span>
            <span>{Math.round(currentProfile.dailyWaterGoalMl / 2)} ml</span>
            <span>{currentProfile.dailyWaterGoalMl} ml (Meta)</span>
          </div>
        </div>
      </div>

      {/* Meals Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Cardápio do Dia • {currentProfile.name}
            </h3>
            <p className="text-xs text-slate-400">
              Aderência diária: {mealsDoneCount} de {currentDiet.meals.length} refeições cumpridas ({dietProgressPercent}%)
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {dietProgressPercent === 100 ? '🎉 Dieta 100% Batida!' : 'Em Andamento'}
          </span>
        </div>

        <div className="space-y-4">
          {currentDiet.meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => handleMealCheck(meal)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                meal.completed
                  ? 'bg-slate-800/40 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-800/80 border-slate-700/70 hover:border-slate-600 text-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <button type="button" className="text-slate-400 focus:outline-none">
                    {meal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.time}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                        {meal.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-white mt-0.5">
                      {meal.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                    {meal.calories} kcal
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                    {meal.proteinGrams}g P
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 pl-8 leading-relaxed">
                {meal.description}
              </p>

              {meal.isAiSubstituted && (
                <div className="mt-2.5 ml-8 flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
                  <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Substituição Inteligente IA Ativa
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      revertMealFood(selectedPartnerId, meal.id);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Voltar ao original
                  </button>
                </div>
              )}

              {meal.healthyTip && (
                <div className="mt-3 ml-8 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2 text-xs text-slate-400">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dica:</strong> {meal.healthyTip}</span>
                </div>
              )}

              {/* Action button to suggest substitution with Gemini */}
              <div className="mt-3.5 ml-8 flex items-center justify-between border-t border-slate-800/80 pt-3">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Quer trocar este prato sem sair das metas?
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMealForSub(meal);
                    setIsSubModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition ml-auto shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sugerir Substituição (Gemini IA)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gemini AI Substitution Modal */}
      <GeminiSubstitutionModal
        isOpen={isSubModalOpen}
        onClose={() => {
          setIsSubModalOpen(false);
          setSelectedMealForSub(null);
        }}
        meal={selectedMealForSub}
        partnerId={selectedPartnerId}
      />

    </div>
  );
};
