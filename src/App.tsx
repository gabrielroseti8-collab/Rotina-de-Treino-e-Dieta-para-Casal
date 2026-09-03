import React, { useState } from 'react';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import { Navbar } from './components/Navbar';
import { CoupleOverview } from './components/CoupleOverview';
import { WorkoutTab } from './components/WorkoutTab';
import { DietTab } from './components/DietTab';
import { MetricsTab } from './components/MetricsTab';
import { ChallengesTab } from './components/ChallengesTab';
import { PrendasTab } from './components/PrendasTab';
import { SmartReminderDrawer } from './components/SmartReminderDrawer';
import { EditProfileModal } from './components/EditProfileModal';
import {
  Heart,
  Dumbbell,
  Utensils,
  TrendingUp,
  GitFork,
  AlertOctagon,
  Bell,
  Sparkles
} from 'lucide-react';

type TabType = 'visao_geral' | 'treino' | 'dieta' | 'metricas' | 'desafios' | 'prendas';

function CoupleAppContent() {
  const {
    smartReminders,
    prendas,
    profiles,
    currentPartnerId,
  } = useCouple();

  const [activeTab, setActiveTab] = useState<TabType>('visao_geral');
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const unreadRemindersCount = smartReminders.filter((r) => !r.isRead).length;
  const activePrendasCount = prendas.filter((p) => p.status === 'ativa').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Header */}
      <Navbar
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        unreadRemindersCount={unreadRemindersCount}
      />

      {/* Main Navigation Subheader / Tabs */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 sticky top-16 sm:top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Abas de Navegação">
            
            <button
              id="tab-visao-geral"
              onClick={() => setActiveTab('visao_geral')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === 'visao_geral'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Visão do Casal</span>
            </button>

            <button
              id="tab-treino"
              onClick={() => setActiveTab('treino')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === 'treino'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Rotina de Treinos</span>
            </button>

            <button
              id="tab-dieta"
              onClick={() => setActiveTab('dieta')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === 'dieta'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Dieta & Hidratação</span>
            </button>

            <button
              id="tab-metricas"
              onClick={() => setActiveTab('metricas')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === 'metricas'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Métricas Semanais</span>
            </button>

            <button
              id="tab-desafios"
              onClick={() => setActiveTab('desafios')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === 'desafios'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Desafios Ramificados</span>
            </button>

            <button
              id="tab-prendas"
              onClick={() => setActiveTab('prendas')}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === 'prendas'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Contrato & Prendas</span>
              {activePrendasCount > 0 && (
                <span className="flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-black rounded-full bg-white text-red-600">
                  {activePrendasCount}
                </span>
              )}
            </button>

          </nav>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'visao_geral' && (
          <CoupleOverview
            onNavigateTab={(tab) => {
              if (tab === 'treino') setActiveTab('treino');
              else if (tab === 'dieta') setActiveTab('dieta');
              else if (tab === 'metricas') setActiveTab('metricas');
              else if (tab === 'desafios') setActiveTab('desafios');
              else if (tab === 'prendas') setActiveTab('prendas');
            }}
          />
        )}

        {activeTab === 'treino' && <WorkoutTab />}

        {activeTab === 'dieta' && <DietTab />}

        {activeTab === 'metricas' && (
          <MetricsTab onNavigateToPrendas={() => setActiveTab('prendas')} />
        )}

        {activeTab === 'desafios' && <ChallengesTab />}

        {activeTab === 'prendas' && <PrendasTab />}
      </main>

      {/* Smart Reminders Drawer */}
      <SmartReminderDrawer
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        onNavigateTab={(tab) => {
          if (tab === 'treino') setActiveTab('treino');
          else if (tab === 'dieta') setActiveTab('dieta');
          else if (tab === 'metricas') setActiveTab('metricas');
          else if (tab === 'desafios') setActiveTab('desafios');
          else if (tab === 'prendas') setActiveTab('prendas');
        }}
      />

      {/* Profile & Goals Settings Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DuoFit Casal • Rotina de Treino e Dieta Compartilhada em Tempo Real</span>
          <span className="flex items-center gap-1">
            Construído para motivar <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {profiles.partner1.name} & {profiles.partner2.name}
          </span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <CoupleProvider>
      <CoupleAppContent />
    </CoupleProvider>
  );
}
