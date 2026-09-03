import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { PartnerId } from '../types';
import { X, UserCheck, Settings, Dumbbell, Droplets, Flame, RotateCcw } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profiles, updateProfile, resetAllData } = useCouple();

  const [activeTab, setActiveTab] = useState<PartnerId>('partner1');

  // Form states for Partner 1
  const [p1Name, setP1Name] = useState(profiles.partner1.name);
  const [p1Nick, setP1Nick] = useState(profiles.partner1.nickname);
  const [p1GoalTitle, setP1GoalTitle] = useState(profiles.partner1.goalTitle);
  const [p1Workouts, setP1Workouts] = useState(profiles.partner1.weeklyWorkoutGoal);
  const [p1Water, setP1Water] = useState(profiles.partner1.dailyWaterGoalMl);
  const [p1Calories, setP1Calories] = useState(profiles.partner1.dailyCaloriesTarget);
  const [p1Weight, setP1Weight] = useState(profiles.partner1.weightKg);
  const [p1Preferences, setP1Preferences] = useState<string[]>(profiles.partner1.dietaryPreferences || []);
  const [p1Restrictions, setP1Restrictions] = useState<string[]>(profiles.partner1.dietaryRestrictions || []);
  const [p1NewTag, setP1NewTag] = useState('');
  const [p1TagType, setP1TagType] = useState<'pref' | 'rest'>('rest');

  // Form states for Partner 2
  const [p2Name, setP2Name] = useState(profiles.partner2.name);
  const [p2Nick, setP2Nick] = useState(profiles.partner2.nickname);
  const [p2GoalTitle, setP2GoalTitle] = useState(profiles.partner2.goalTitle);
  const [p2Workouts, setP2Workouts] = useState(profiles.partner2.weeklyWorkoutGoal);
  const [p2Water, setP2Water] = useState(profiles.partner2.dailyWaterGoalMl);
  const [p2Calories, setP2Calories] = useState(profiles.partner2.dailyCaloriesTarget);
  const [p2Weight, setP2Weight] = useState(profiles.partner2.weightKg);
  const [p2Preferences, setP2Preferences] = useState<string[]>(profiles.partner2.dietaryPreferences || []);
  const [p2Restrictions, setP2Restrictions] = useState<string[]>(profiles.partner2.dietaryRestrictions || []);
  const [p2NewTag, setP2NewTag] = useState('');
  const [p2TagType, setP2TagType] = useState<'pref' | 'rest'>('rest');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile('partner1', {
      name: p1Name.trim() || 'Gabriel',
      nickname: p1Nick.trim() || 'Biel',
      goalTitle: p1GoalTitle.trim(),
      weeklyWorkoutGoal: Number(p1Workouts),
      dailyWaterGoalMl: Number(p1Water),
      dailyCaloriesTarget: Number(p1Calories),
      weightKg: Number(p1Weight),
      dietaryPreferences: p1Preferences,
      dietaryRestrictions: p1Restrictions,
    });

    updateProfile('partner2', {
      name: p2Name.trim() || 'Sofia',
      nickname: p2Nick.trim() || 'Sofi',
      goalTitle: p2GoalTitle.trim(),
      weeklyWorkoutGoal: Number(p2Workouts),
      dailyWaterGoalMl: Number(p2Water),
      dailyCaloriesTarget: Number(p2Calories),
      weightKg: Number(p2Weight),
      dietaryPreferences: p2Preferences,
      dietaryRestrictions: p2Restrictions,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar os dados de exemplo originais do casal?')) {
      resetAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-rose-400 border border-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Configurar Metas & Perfis do Casal</h3>
              <p className="text-xs text-slate-400">Personalize os dados de ambos os parceiros</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner Select Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('partner1')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'partner1' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <img src={profiles.partner1.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span>{p1Name || 'Parceiro 1'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partner2')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'partner2' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <img src={profiles.partner2.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span>{p2Name || 'Parceiro 2'}</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === 'partner1' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Apelido Carinhoso</label>
                  <input
                    type="text"
                    value={p1Nick}
                    onChange={(e) => setP1Nick(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Objetivo Principal</label>
                <input
                  type="text"
                  value={p1GoalTitle}
                  onChange={(e) => setP1GoalTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Treinos/Sem</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={p1Workouts}
                    onChange={(e) => setP1Workouts(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Água Diária (ml)</label>
                  <input
                    type="number"
                    step={100}
                    value={p1Water}
                    onChange={(e) => setP1Water(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Calorias (kcal)</label>
                  <input
                    type="number"
                    step={50}
                    value={p1Calories}
                    onChange={(e) => setP1Calories(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Dietary Restrictions (Gemini AI) */}
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span>⚠️</span>
                    Restrições & Alergias (Usadas pelo Gemini)
                  </span>
                  <span className="text-[10px] text-slate-400">Clique no 'x' para remover</span>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {p1Restrictions.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setP1Restrictions(p1Restrictions.filter((_, i) => i !== idx))}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {p1Restrictions.length === 0 && (
                    <span className="text-xs text-slate-500 italic">Sem restrições cadastradas</span>
                  )}
                </div>

                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Nova restrição (ex: Sem lactose, Sem amendoim...)"
                    value={p1NewTag}
                    onChange={(e) => setP1NewTag(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (p1NewTag.trim()) {
                        setP1Restrictions([...p1Restrictions, p1NewTag.trim()]);
                        setP1NewTag('');
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Dietary Preferences (Gemini AI) */}
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <span>🎯</span>
                  Preferências Alimentares (Usadas pelo Gemini)
                </span>

                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {p1Preferences.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setP1Preferences(p1Preferences.filter((_, i) => i !== idx))}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick chip suggestions for Gabriel */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 pt-1">
                  {['Hipertrofia Muscular', 'Mais Proteínas', 'Aveia e Batata Doce', 'Prático Pré-Treino'].map((sug, i) => (
                    !p1Preferences.includes(sug) && (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setP1Preferences([...p1Preferences, sug])}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
                      >
                        + {sug}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Apelido Carinhoso</label>
                  <input
                    type="text"
                    value={p2Nick}
                    onChange={(e) => setP2Nick(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Objetivo Principal</label>
                <input
                  type="text"
                  value={p2GoalTitle}
                  onChange={(e) => setP2GoalTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Treinos/Sem</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={p2Workouts}
                    onChange={(e) => setP2Workouts(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Água Diária (ml)</label>
                  <input
                    type="number"
                    step={100}
                    value={p2Water}
                    onChange={(e) => setP2Water(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Calorias (kcal)</label>
                  <input
                    type="number"
                    step={50}
                    value={p2Calories}
                    onChange={(e) => setP2Calories(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Dietary Restrictions for Partner 2 (Sofia) */}
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span>⚠️</span>
                    Restrições & Alergias (Usadas pelo Gemini)
                  </span>
                  <span className="text-[10px] text-slate-400">Clique no 'x' para remover</span>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {p2Restrictions.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setP2Restrictions(p2Restrictions.filter((_, i) => i !== idx))}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {p2Restrictions.length === 0 && (
                    <span className="text-xs text-slate-500 italic">Sem restrições cadastradas</span>
                  )}
                </div>

                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Nova restrição (ex: Intolerância a lactose, Sem glúten...)"
                    value={p2NewTag}
                    onChange={(e) => setP2NewTag(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (p2NewTag.trim()) {
                        setP2Restrictions([...p2Restrictions, p2NewTag.trim()]);
                        setP2NewTag('');
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Dietary Preferences for Partner 2 (Sofia) */}
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span>🎯</span>
                  Preferências Alimentares (Usadas pelo Gemini)
                </span>

                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {p2Preferences.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setP2Preferences(p2Preferences.filter((_, i) => i !== idx))}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick chip suggestions for Sofia */}
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 pt-1">
                  {['Definição & Saciedade', 'Gorduras Boas (Abacate, Azeite)', 'Peixes e Saladas Frescas', 'Zero Açúcar'].map((sug, i) => (
                    !p2Preferences.includes(sug) && (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setP2Preferences([...p2Preferences, sug])}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
                      >
                        + {sug}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold text-center animate-pulse">
              Metas e perfis atualizados com sucesso! ✨
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrão
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
