import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { DailyPenaltyOptionKey, PartnerId } from '../types';
import { DAILY_PENALTY_OPTIONS } from '../data/initialData';
import {
  AlertTriangle,
  Check,
  X,
  Sparkles,
  CookingPot,
  Trash2,
  Cat,
  Heart,
  Shirt,
  HandHeart,
  Utensils,
  Clock,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyPrendaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTargetPartner?: PartnerId;
  failedGoalDescription?: string;
}

export const DailyPrendaSelectorModal: React.FC<DailyPrendaSelectorModalProps> = ({
  isOpen,
  onClose,
  defaultTargetPartner = 'partner1',
  failedGoalDescription,
}) => {
  const { profiles, currentPartnerId, assignDailyGoalPenalty } = useCouple();

  // The partner who failed the goal
  const [targetPartner, setTargetPartner] = useState<PartnerId>(defaultTargetPartner);
  const [selectedKey, setSelectedKey] = useState<DailyPenaltyOptionKey>('lavar_louca');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  // The partner who is choosing
  const chooserId: PartnerId = targetPartner === 'partner1' ? 'partner2' : 'partner1';
  const victimProfile = profiles[targetPartner];
  const chooserProfile = profiles[chooserId];

  const handleDecree = (e: React.FormEvent) => {
    e.preventDefault();
    const penaltyOption = DAILY_PENALTY_OPTIONS.find((opt) => opt.key === selectedKey);
    if (!penaltyOption) return;

    const defaultReason = failedGoalDescription || `${victimProfile.name} não cumpriu a meta do dia e ${chooserProfile.name} exerceu o direito de escolha da prenda!`;

    assignDailyGoalPenalty(targetPartner, selectedKey, defaultReason, customNote.trim() || undefined);

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#ec4899', '#8b5cf6'],
    });

    onClose();
  };

  const getOptionIcon = (key: DailyPenaltyOptionKey) => {
    switch (key) {
      case 'lavar_louca':
        return <Utensils className="w-5 h-5 text-sky-400" />;
      case 'fazer_comida':
        return <CookingPot className="w-5 h-5 text-amber-400" />;
      case 'tirar_lixo':
        return <Trash2 className="w-5 h-5 text-emerald-400" />;
      case 'limpar_gatos':
        return <Cat className="w-5 h-5 text-purple-400" />;
      case 'preparar_date':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'lavar_estender_roupas':
        return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'massagem_caprichada':
        return <HandHeart className="w-5 h-5 text-pink-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden my-6">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 p-6 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Pacto de Metas Diárias do Casal</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Escolher a Prenda do Dia
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Regra acordada: quem não cumpriu a meta do dia terá que cumprir a prenda onde o outro parceiro escolhe entre as 7 opções oficiais!
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleDecree} className="p-6 space-y-6">
          
          {/* Who failed the goal */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              1. Quem não cumpriu a meta hoje? (Devedor da prenda)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetPartner('partner1')}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition text-left ${
                  targetPartner === 'partner1'
                    ? 'bg-sky-950/40 border-sky-500 ring-2 ring-sky-500/40'
                    : 'bg-slate-800/50 border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={profiles.partner1.avatar}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-sky-400"
                />
                <div>
                  <div className="text-sm font-bold text-white">{profiles.partner1.name}</div>
                  <div className="text-[11px] text-sky-400">
                    {targetPartner === 'partner1' ? 'Paga a prenda' : 'Cumpre metas'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetPartner('partner2')}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition text-left ${
                  targetPartner === 'partner2'
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/40'
                    : 'bg-slate-800/50 border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={profiles.partner2.avatar}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-rose-400"
                />
                <div>
                  <div className="text-sm font-bold text-white">{profiles.partner2.name}</div>
                  <div className="text-[11px] text-rose-400">
                    {targetPartner === 'partner2' ? 'Paga a prenda' : 'Cumpre metas'}
                  </div>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              👉 {chooserProfile.name} está escolhendo a prenda para {victimProfile.name}.
            </p>
          </div>

          {/* 7 Official Options Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                2. Selecione a prenda entre as opções do pacto:
              </label>
              <span className="text-[11px] text-amber-400 font-semibold">
                7 opções oficiais
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {DAILY_PENALTY_OPTIONS.map((option) => {
                const isSelected = selectedKey === option.key;
                return (
                  <div
                    key={option.key}
                    onClick={() => setSelectedKey(option.key)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/20 via-slate-800 to-rose-500/20 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none">{option.emoji}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {option.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {option.durationOrScope}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-amber-400 border-amber-300 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional specific note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Recado ou exigência especial de {chooserProfile.name} para {victimProfile.name} (opcional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ex: Caprichar nas panelas de gordura; jantarinho sem pimenta; massagem de 30 min..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-slate-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-xs sm:text-sm font-black text-white shadow-lg shadow-rose-950/40 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Decretar Prenda para {victimProfile.name}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
