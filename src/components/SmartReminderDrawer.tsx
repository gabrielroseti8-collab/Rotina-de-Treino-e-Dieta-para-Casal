import React, { useState } from 'react';
import { useCouple } from '../context/CoupleContext';
import { SmartReminder } from '../types';
import {
  Bell,
  X,
  AlertTriangle,
  Droplets,
  Dumbbell,
  Heart,
  Utensils,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface SmartReminderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'treino' | 'dieta' | 'metricas' | 'desafios' | 'prendas') => void;
}

export const SmartReminderDrawer: React.FC<SmartReminderDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const {
    profiles,
    currentPartnerId,
    smartReminders,
    markReminderAsRead,
    dismissReminder,
    triggerManualReminderCheck,
    addWater,
  } = useCouple();

  const [filter, setFilter] = useState<'all' | 'unread' | 'prendas'>('all');
  const [justScanned, setJustScanned] = useState(false);

  if (!isOpen) return null;

  const handleScan = () => {
    triggerManualReminderCheck();
    setJustScanned(true);
    setTimeout(() => setJustScanned(false), 2000);
  };

  const handleQuickAction = (rem: SmartReminder) => {
    markReminderAsRead(rem.id);

    if (rem.actionKey === 'add_water') {
      addWater(currentPartnerId, 300);
    } else if (rem.actionKey === 'workout_today' || rem.actionKey === 'open_workout') {
      onNavigateTab('treino');
      onClose();
    } else if (rem.actionKey === 'open_prenda') {
      onNavigateTab('prendas');
      onClose();
    } else if (rem.actionKey === 'check_meal') {
      onNavigateTab('dieta');
      onClose();
    }
  };

  const filteredReminders = smartReminders.filter((rem) => {
    if (filter === 'unread') return !rem.isRead;
    if (filter === 'prendas') return rem.type === 'prenda_warning';
    return true;
  });

  const getReminderIcon = (type: SmartReminder['type']) => {
    switch (type) {
      case 'prenda_warning':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'workout':
        return <Dumbbell className="w-5 h-5 text-sky-400" />;
      case 'partner_cheer':
        return <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />;
      case 'diet':
        return <Utensils className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col text-white shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Central de Lembretes Automáticos</h3>
              <p className="text-xs text-slate-400">Notificações baseadas no progresso do casal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan / Progress Check bar */}
        <div className="p-4 bg-slate-800/60 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            {justScanned ? (
              <span className="text-emerald-400 font-semibold">Metas e ritmo escaneados! ✅</span>
            ) : (
              <span>Auditar progresso e atualizar alertas</span>
            )}
          </div>

          <button
            onClick={handleScan}
            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${justScanned ? 'animate-spin' : ''}`} />
            <span>Auditar Agora</span>
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 pt-3 pb-2 flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({smartReminders.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'unread' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Não lidos
          </button>
          <button
            onClick={() => setFilter('prendas')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'prendas' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ Alertas de Prenda
          </button>
        </div>

        {/* Reminders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/40 mb-2" />
              <p>Nenhum lembrete pendente nesta categoria!</p>
              <p className="mt-1">O casal está em dia com as metas.</p>
            </div>
          ) : (
            filteredReminders.map((rem) => {
              const isPrenda = rem.type === 'prenda_warning';

              return (
                <div
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    !rem.isRead
                      ? isPrenda
                        ? 'bg-red-950/40 border-red-500/50 shadow-md shadow-red-950/30'
                        : 'bg-slate-800 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                        {getReminderIcon(rem.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {rem.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {rem.timestamp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissReminder(rem.id)}
                      className="p-1 rounded text-slate-500 hover:text-slate-300"
                      title="Dispensar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rem.message}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    {!rem.isRead ? (
                      <button
                        onClick={() => markReminderAsRead(rem.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        Marcar como lido
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Lido</span>
                    )}

                    {rem.actionLabel && (
                      <button
                        onClick={() => handleQuickAction(rem)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1 shadow"
                      >
                        <span>{rem.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Lembretes gerados dinamicamente com base em água, treinos e metas semanais.
        </div>

      </div>
    </div>
  );
};
