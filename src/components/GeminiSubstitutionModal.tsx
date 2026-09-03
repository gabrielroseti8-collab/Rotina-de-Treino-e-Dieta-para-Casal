import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { PartnerId, MealItem, FoodSubstitution, FoodSubstitutionResponse } from '../types';
import {
  X,
  Sparkles,
  ShieldCheck,
  Flame,
  Apple,
  Check,
  ChefHat,
  HeartHandshake,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GeminiSubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealItem | null;
  partnerId: PartnerId;
}

export const GeminiSubstitutionModal: React.FC<GeminiSubstitutionModalProps> = ({
  isOpen,
  onClose,
  meal,
  partnerId,
}) => {
  const { profiles, replaceMealFood, revertMealFood } = useCouple();
  const profile = profiles[partnerId];

  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<FoodSubstitutionResponse | null>(null);
  const [apiSource, setApiSource] = useState<string>('');
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);

  if (!isOpen || !meal) return null;

  const quickPrompts = [
    'Quero algo doce e proteico',
    'Sem tempo: preparo em 5 min',
    'Acabou o frango em casa',
    'Opção vegetariana balanceada',
    'Mais saciedade para segurar a fome',
  ];

  const handleRequestSubstitutions = async (queryText?: string) => {
    setLoading(true);
    setError(null);
    setSelectedSubIndex(null);

    const textToSend = queryText !== undefined ? queryText : customPrompt;

    try {
      const response = await fetch('/api/diet/substitute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealTitle: meal.title,
          mealType: meal.type,
          originalFood: meal.description,
          calories: meal.calories,
          protein: meal.proteinGrams,
          carbs: meal.carbsGrams,
          fat: meal.fatGrams,
          partnerName: profile.name,
          partnerGoal: profile.goalTitle,
          dietaryPreferences: profile.dietaryPreferences || [],
          dietaryRestrictions: profile.dietaryRestrictions || [],
          userCustomPrompt: textToSend.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o servidor da IA.');
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setResultData(resJson.data);
        setApiSource(resJson.source || 'gemini');
      } else {
        throw new Error(resJson.error || 'Não foi possível gerar substituições no momento.');
      }
    } catch (err: any) {
      console.error('Error fetching substitutions:', err);
      setError(err.message || 'Erro ao consultar o assistente nutricional.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubstitution = (sub: FoodSubstitution, index: number) => {
    setSelectedSubIndex(index);

    const updatedDescription = `${sub.title} (${sub.portion}) - ${sub.preparationTip}`;
    replaceMealFood(
      partnerId,
      meal.id,
      updatedDescription,
      {
        calories: sub.estimatedCalories,
        proteinGrams: sub.estimatedProtein,
        carbsGrams: sub.estimatedCarbs,
        fatGrams: sub.estimatedFat,
      },
      sub.title,
      sub.preparationTip
    );

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleRevert = () => {
    revertMealFood(partnerId, meal.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Substituição com Gemini IA
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Nutrição Inteligente
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculada para o perfil de <strong className="text-white">{profile.name}</strong> mantendo macros e respeitando restrições.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Current Meal Context Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {meal.type} • Refeição Selecionada
                </span>
                <h4 className="text-base font-bold text-white">{meal.title}</h4>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {meal.calories} kcal
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold flex items-center gap-1">
                  <Apple className="w-3.5 h-3.5" />
                  {meal.proteinGrams}g P
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-slate-400">Cardápio atual:</strong> {meal.description}
            </p>

            {meal.isAiSubstituted && (
              <div className="flex items-center justify-between pt-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <span>Esta refeição já possui uma substituição ativa aplicada.</span>
                <button
                  type="button"
                  onClick={handleRevert}
                  className="font-bold underline hover:text-white"
                >
                  Restaurar original
                </button>
              </div>
            )}
          </div>

          {/* Profile Restrictions & Preferences applied */}
          <div className="space-y-2 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Filtros do Perfil de {profile.name} considerados pela IA:
              </span>
              <span className="text-[11px] text-slate-500">
                Meta: {profile.goalTitle}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 ? (
                profile.dietaryRestrictions.map((res, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                  >
                    <span>⚠️</span>
                    <span>{res}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">Nenhuma restrição alimentar cadastrada</span>
              )}

              {profile.dietaryPreferences && profile.dietaryPreferences.slice(0, 3).map((pref, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1"
                >
                  <span>🎯</span>
                  <span>{pref}</span>
                </span>
              ))}
            </div>
          </div>

          {/* User Prompt / Custom query */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Tem algum desejo ou restrição de despensa hoje? (Opcional)</span>
              <span className="text-[11px] text-slate-500">Ex: sem tempo, vontade de doce, sem frango</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Quero uma opção rápida de 5 min ou com ovos..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRequestSubstitutions();
                  }
                }}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => handleRequestSubstitutions()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{resultData ? 'Recalcular' : 'Sugerir com IA'}</span>
              </button>
            </div>

            {/* Quick suggestions pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCustomPrompt(q);
                    handleRequestSubstitutions(q);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition"
                >
                  + {q}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center space-y-3 animate-pulse">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <h4 className="font-bold text-white text-sm">
                Gemini está criando opções personalizadas...
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Cruzando tabela nutricional, respeitando restrições de {profile.name} ({profile.dietaryRestrictions?.join(', ') || 'geral'}) e mantendo balanço de macronutrientes.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Ocorreu um erro ao consultar o Gemini:</p>
                <p className="mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() => handleRequestSubstitutions()}
                  className="mt-2 text-white font-bold underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {resultData && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  Opções Nutricionais Geradas ({resultData.substitutions.length})
                </h4>
                <span className="text-[11px] text-slate-400">
                  Toque para aplicar no cardápio
                </span>
              </div>

              {/* Substitution Cards List */}
              <div className="space-y-3">
                {resultData.substitutions.map((sub, idx) => {
                  const isSelected = selectedSubIndex === idx;
                  const calDiff = sub.estimatedCalories - meal.calories;
                  const protDiff = sub.estimatedProtein - meal.proteinGrams;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                          : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-base text-white">
                              {sub.title}
                            </h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {sub.compatibilityBadge}
                            </span>
                          </div>
                          <span className="text-xs text-amber-400 font-semibold mt-0.5 block">
                            Porção recomendada: {sub.portion}
                          </span>
                        </div>

                        {/* Macros Pill Box */}
                        <div className="flex items-center gap-2 text-xs shrink-0">
                          <div className="bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700 text-center">
                            <div className="font-bold text-white">
                              {sub.estimatedCalories} kcal
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {calDiff > 0 ? `+${calDiff}` : calDiff} kcal
                            </div>
                          </div>

                          <div className="bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700 text-center">
                            <div className="font-bold text-rose-300">
                              {sub.estimatedProtein}g P
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {protDiff > 0 ? `+${protDiff}g` : `${protDiff}g`}
                            </div>
                          </div>

                          <div className="bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-700 text-center hidden sm:block">
                            <div className="font-bold text-sky-300 text-[11px]">
                              {sub.estimatedCarbs}g C
                            </div>
                            <div className="font-bold text-emerald-300 text-[11px]">
                              {sub.estimatedFat}g G
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reason & Preparation */}
                      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                        {sub.reason}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2 mb-3">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Preparo rápido:</strong> {sub.preparationTip}</span>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleApplySubstitution(sub, idx)}
                          disabled={isSelected}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Substituição Aplicada!</span>
                            </>
                          ) : (
                            <>
                              <span>Aplicar no Cardápio de {profile.name}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nutritionist Advice & Couple Synergy Tip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Apple className="w-3.5 h-3.5 text-indigo-400" />
                    Parecer do Nutricionista
                  </div>
                  <p className="text-indigo-300/90 leading-relaxed">
                    {resultData.nutritionistAdvice}
                  </p>
                </div>

                {resultData.partnerSynergyTip && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                      Sinergia para o Casal
                    </div>
                    <p className="text-rose-300/90 leading-relaxed">
                      {resultData.partnerSynergyTip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Initial Helper banner if not yet requested */}
          {!resultData && !loading && (
            <div className="bg-gradient-to-r from-indigo-950/50 to-slate-900 p-5 rounded-2xl border border-indigo-900/40 flex items-start gap-3 text-xs text-slate-300">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-1">
                  Como funciona a inteligência nutricional do Gemini?
                </strong>
                O modelo analisa os macronutrientes da refeição original ({meal.calories} kcal, {meal.proteinGrams}g proteína) e consulta as preferências e restrições de {profile.name} ({profile.dietaryRestrictions?.join(', ') || 'sem restrições'}), propondo pratos reais com o mesmo teor nutricional.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Motor: <strong>Gemini 3.8 Flash</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
