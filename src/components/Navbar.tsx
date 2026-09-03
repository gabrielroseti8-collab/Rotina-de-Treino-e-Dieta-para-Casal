import React from 'react';
import { useCouple } from '../context/CoupleContext';
import { Heart, Bell, Flame, Zap, UserCheck, Settings, RefreshCw, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  onOpenReminders: () => void;
  onOpenProfileModal: () => void;
  unreadRemindersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReminders,
  onOpenProfileModal,
  unreadRemindersCount,
}) => {
  const {
    profiles,
    currentPartnerId,
    setCurrentPartnerId,
    coupleStreak,
    synergyPoints,
    triggerManualReminderCheck,
    prendas,
  } = useCouple();

  const activePrendasCount = prendas.filter((p) => p.status === 'ativa').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Couple Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 shadow-md shadow-rose-500/20">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent">
                  DuoFit Casal
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Em Parceria
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate max-w-[140px] sm:max-w-none">
                {profiles.partner1.name} & {profiles.partner2.name}
              </p>
            </div>
          </div>

          {/* Center: Perspective Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              id="switch-partner1-btn"
              onClick={() => setCurrentPartnerId('partner1')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPartnerId === 'partner1'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <img
                src={profiles.partner1.avatar}
                alt={profiles.partner1.name}
                className="w-5 h-5 rounded-full object-cover border border-white/40"
              />
              <span className="truncate max-w-[70px] sm:max-w-[100px]">{profiles.partner1.nickname || profiles.partner1.name}</span>
            </button>

            <button
              id="switch-partner2-btn"
              onClick={() => setCurrentPartnerId('partner2')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPartnerId === 'partner2'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <img
                src={profiles.partner2.avatar}
                alt={profiles.partner2.name}
                className="w-5 h-5 rounded-full object-cover border border-white/40"
              />
              <span className="truncate max-w-[70px] sm:max-w-[100px]">{profiles.partner2.nickname || profiles.partner2.name}</span>
            </button>
          </div>

          {/* Right Stats & Quick Triggers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Couple Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs font-medium text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{coupleStreak}d seguidos</span>
            </div>

            {/* Synergy Points */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs font-medium text-emerald-400">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>{synergyPoints} pts</span>
            </div>

            {/* Active Prenda Badge (if any) */}
            {activePrendasCount > 0 && (
              <div
                title={`${activePrendasCount} prenda ativa para pagar!`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold animate-bounce"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Prenda</span>
                <span>{activePrendasCount}</span>
              </div>
            )}

            {/* Smart Reminders Bell */}
            <button
              id="open-reminders-btn"
              onClick={onOpenReminders}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Lembretes automáticos e alertas do par"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadRemindersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-slate-900 animate-pulse">
                  {unreadRemindersCount}
                </span>
              )}
            </button>

            {/* Profile Settings */}
            <button
              id="open-settings-btn"
              onClick={onOpenProfileModal}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Configurar perfis e metas do casal"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
