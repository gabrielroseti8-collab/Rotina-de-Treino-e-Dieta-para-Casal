import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  PartnerId,
  PartnerProfile,
  DailyWorkout,
  DailyDiet,
  WeeklyDayMetric,
  ChallengeNode,
  PrendaContract,
  SmartReminder,
  CoupleActivity,
  ExerciseItem,
  WalkLogEntry,
  AlternateDayWalkGoal,
  DailyPenaltyOptionKey,
  AiSubstitutionRecord,
  FoodSubstitutionResponse,
  FoodSubstitution
} from '../types';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  INITIAL_PROFILES,
  INITIAL_WORKOUTS,
  INITIAL_DIETS,
  INITIAL_WEEKLY_METRICS,
  INITIAL_CHALLENGE_NODES,
  INITIAL_PRENDAS,
  INITIAL_SMART_REMINDERS,
  INITIAL_WALK_GOAL,
  DAILY_PENALTY_OPTIONS,
} from '../data/initialData';

interface CoupleContextType {
  profiles: Record<PartnerId, PartnerProfile>;
  currentPartnerId: PartnerId;
  setCurrentPartnerId: (id: PartnerId) => void;
  otherPartnerId: PartnerId;
  otherProfile: PartnerProfile;
  currentProfile: PartnerProfile;
  workouts: DailyWorkout[];
  diets: Record<PartnerId, DailyDiet>;
  weeklyMetrics: WeeklyDayMetric[];
  challenges: ChallengeNode[];
  prendas: PrendaContract[];
  smartReminders: SmartReminder[];
  activityFeed: CoupleActivity[];
  synergyPoints: number;
  coupleStreak: number;
  coupleSyncScore: number; // 0 to 100%
  toggleExercise: (workoutId: string, exerciseId: string) => void;
  toggleWorkoutCompletion: (workoutId: string) => void;
  addCustomExercise: (workoutId: string, exercise: Omit<ExerciseItem, 'id' | 'completed'>) => void;
  toggleMeal: (partnerId: PartnerId, mealId: string) => void;
  replaceMealFood: (
    partnerId: PartnerId,
    mealId: string,
    newDescription: string,
    updatedMacros?: { calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number },
    substitutionTitle?: string,
    healthyTip?: string
  ) => void;
  revertMealFood: (partnerId: PartnerId, mealId: string) => void;
  addWater: (partnerId: PartnerId, amountMl: number) => void;
  toggleChallengeNode: (nodeId: string, partnerId: PartnerId) => void;
  sendNudge: (message: string, emoji: string) => void;
  addPrenda: (prenda: Omit<PrendaContract, 'id' | 'status'>) => void;
  settlePrenda: (prendaId: string, rating: number, proofNotes: string) => void;
  assignPrenda: (prendaId: string, targetPartner: PartnerId, reason: string) => void;
  assignDailyGoalPenalty: (targetPartner: PartnerId, penaltyKey: DailyPenaltyOptionKey, reason?: string, customNote?: string) => void;
  spinPrendaWheel: (targetPartner: PartnerId) => PrendaContract | null;
  updateProfile: (partnerId: PartnerId, updates: Partial<PartnerProfile>) => void;
  markReminderAsRead: (reminderId: string) => void;
  dismissReminder: (reminderId: string) => void;
  triggerManualReminderCheck: () => void;
  walkGoal: AlternateDayWalkGoal;
  toggleWalkCompletion: (date: string, partnerId: PartnerId) => void;
  logWalkDetails: (details: Partial<WalkLogEntry> & { date: string }) => void;
  updateWalkGoalSettings: (settings: Partial<Pick<AlternateDayWalkGoal, 'targetMinutes' | 'targetKm' | 'targetSteps' | 'cyclePattern'>>) => void;
  resetAllData: () => void;
  aiSubstitutions: AiSubstitutionRecord[];
  saveAiSubstitution: (record: Omit<AiSubstitutionRecord, 'id' | 'createdAt' | 'timestamp'>) => Promise<string>;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILES: 'duofit_profiles_v1',
  CURRENT_USER: 'duofit_current_user_v1',
  WORKOUTS: 'duofit_workouts_v1',
  DIETS: 'duofit_diets_v1',
  METRICS: 'duofit_metrics_v1',
  CHALLENGES: 'duofit_challenges_v1',
  PRENDAS: 'duofit_prendas_v1',
  REMINDERS: 'duofit_reminders_v1',
  ACTIVITIES: 'duofit_activities_v1',
  POINTS: 'duofit_points_v1',
  WALK_GOAL: 'duofit_walk_goal_v1',
  AI_SUBSTITUTIONS: 'duofit_ai_substitutions_v1',
};

export const CoupleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<PartnerId, PartnerProfile>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!saved) return INITIAL_PROFILES;
    try {
      const parsed = JSON.parse(saved);
      return {
        partner1: {
          ...INITIAL_PROFILES.partner1,
          ...parsed.partner1,
          dietaryPreferences: parsed.partner1?.dietaryPreferences?.length
            ? parsed.partner1.dietaryPreferences
            : INITIAL_PROFILES.partner1.dietaryPreferences,
          dietaryRestrictions: parsed.partner1?.dietaryRestrictions?.length
            ? parsed.partner1.dietaryRestrictions
            : INITIAL_PROFILES.partner1.dietaryRestrictions,
        },
        partner2: {
          ...INITIAL_PROFILES.partner2,
          ...parsed.partner2,
          dietaryPreferences: parsed.partner2?.dietaryPreferences?.length
            ? parsed.partner2.dietaryPreferences
            : INITIAL_PROFILES.partner2.dietaryPreferences,
          dietaryRestrictions: parsed.partner2?.dietaryRestrictions?.length
            ? parsed.partner2.dietaryRestrictions
            : INITIAL_PROFILES.partner2.dietaryRestrictions,
        },
      };
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [currentPartnerId, setCurrentPartnerId] = useState<PartnerId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return (saved as PartnerId) || 'partner1';
  });

  const [workouts, setWorkouts] = useState<DailyWorkout[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });

  const [diets, setDiets] = useState<Record<PartnerId, DailyDiet>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DIETS);
    return saved ? JSON.parse(saved) : INITIAL_DIETS;
  });

  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyDayMetric[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_METRICS;
  });

  const [challenges, setChallenges] = useState<ChallengeNode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGE_NODES;
  });

  const [prendas, setPrendas] = useState<PrendaContract[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRENDAS);
    return saved ? JSON.parse(saved) : INITIAL_PRENDAS;
  });

  const [smartReminders, setSmartReminders] = useState<SmartReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : INITIAL_SMART_REMINDERS;
  });

  const [activityFeed, setActivityFeed] = useState<CoupleActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'act-1',
        partnerId: 'partner2',
        type: 'workout_done',
        title: 'Sofia concluiu o treino de Glúteos & Posteriores!',
        timestamp: '08:00',
        reactionEmoji: '🔥',
      },
      {
        id: 'act-2',
        partnerId: 'partner1',
        type: 'water_logged',
        title: 'Gabriel bebeu +500ml de água mineral.',
        timestamp: '11:20',
        reactionEmoji: '💧',
      },
      {
        id: 'act-3',
        partnerId: 'partner2',
        type: 'nudge_sent',
        title: 'Sofia te mandou um incentivo: "Bora treinar amor! ❤️"',
        timestamp: '13:40',
        reactionEmoji: '❤️',
      },
    ];
  });

  const [synergyPoints, setSynergyPoints] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
    return saved ? Number(saved) : 850;
  });

  const [walkGoal, setWalkGoal] = useState<AlternateDayWalkGoal>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALK_GOAL);
    return saved ? JSON.parse(saved) : INITIAL_WALK_GOAL;
  });

  const [aiSubstitutions, setAiSubstitutions] = useState<AiSubstitutionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AI_SUBSTITUTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const otherPartnerId: PartnerId = currentPartnerId === 'partner1' ? 'partner2' : 'partner1';
  const currentProfile = profiles[currentPartnerId];
  const otherProfile = profiles[otherPartnerId];

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, currentPartnerId);
  }, [currentPartnerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIETS, JSON.stringify(diets));
  }, [diets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(weeklyMetrics));
  }, [weeklyMetrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRENDAS, JSON.stringify(prendas));
  }, [prendas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(smartReminders));
  }, [smartReminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityFeed));
  }, [activityFeed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINTS, String(synergyPoints));
  }, [synergyPoints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALK_GOAL, JSON.stringify(walkGoal));
  }, [walkGoal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AI_SUBSTITUTIONS, JSON.stringify(aiSubstitutions));
  }, [aiSubstitutions]);

  // Real-time Firestore synchronization for AI Substitutions across devices
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'ai_substitutions'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: AiSubstitutionRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              partnerId: data.partnerId || 'partner1',
              partnerName: data.partnerName || 'Parceiro',
              mealId: data.mealId || '',
              mealTitle: data.mealTitle || '',
              mealType: data.mealType || '',
              originalFood: data.originalFood || '',
              originalCalories: data.originalCalories || 0,
              originalProtein: data.originalProtein || 0,
              userCustomPrompt: data.userCustomPrompt || '',
              substitutions: data.substitutions || [],
              nutritionistAdvice: data.nutritionistAdvice || '',
              partnerSynergyTip: data.partnerSynergyTip || '',
              appliedSubstitution: data.appliedSubstitution || undefined,
              source: data.source || 'gemini-3.8-flash',
              createdAt: data.createdAt || new Date().toISOString(),
              timestamp: data.timestamp || Date.now(),
            });
          });

          if (list.length > 0) {
            setAiSubstitutions(list);
          }
        },
        (error) => {
          console.warn('[Firestore] Realtime subscription to ai_substitutions failed:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('[Firestore] Could not initiate real-time subscription:', err);
    }
  }, []);

  const saveAiSubstitution = async (
    record: Omit<AiSubstitutionRecord, 'id' | 'createdAt' | 'timestamp'>
  ): Promise<string> => {
    const newId = 'ai-sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const nowIso = new Date().toISOString();
    const nowTime = Date.now();

    const fullRecord: AiSubstitutionRecord = {
      ...record,
      id: newId,
      createdAt: nowIso,
      timestamp: nowTime,
    };

    // Update local state immediately for fast response
    setAiSubstitutions((prev) => [fullRecord, ...prev.filter((item) => item.id !== newId)]);

    // Save directly to Firestore collection 'ai_substitutions'
    try {
      await setDoc(doc(db, 'ai_substitutions', newId), {
        ...fullRecord,
        serverCreatedAt: serverTimestamp(),
      });
      console.log('[Firestore] AI substitution saved to Firestore:', newId);
    } catch (error) {
      console.error('[Firestore] Error saving AI substitution to Firestore:', error);
    }

    return newId;
  };

  const addActivity = (type: CoupleActivity['type'], title: string, partnerId: PartnerId, reactionEmoji?: string) => {
    const newAct: CoupleActivity = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      partnerId,
      type,
      title,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      reactionEmoji,
    };
    setActivityFeed((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Workout interactions
  const toggleExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts((prev) => {
      return prev.map((w) => {
        if (w.id !== workoutId) return w;
        const updatedExercises = w.exercises.map((e) => {
          if (e.id === exerciseId) {
            return { ...e, completed: !e.completed };
          }
          return e;
        });
        const allDone = updatedExercises.length > 0 && updatedExercises.every((e) => e.completed);
        return {
          ...w,
          exercises: updatedExercises,
          completed: allDone,
          completedAt: allDone ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      });
    });
  };

  const toggleWorkoutCompletion = (workoutId: string) => {
    let nowDone = false;
    let wTitle = '';
    let pId: PartnerId = 'partner1';

    setWorkouts((prev) => {
      return prev.map((w) => {
        if (w.id !== workoutId) return w;
        nowDone = !w.completed;
        wTitle = w.title;
        pId = w.partnerId;
        const updatedExercises = w.exercises.map((e) => ({ ...e, completed: nowDone }));
        return {
          ...w,
          completed: nowDone,
          completedAt: nowDone ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
          exercises: updatedExercises,
        };
      });
    });

    if (nowDone) {
      addActivity('workout_done', `${profiles[pId].name} concluiu o treino: "${wTitle}"! 💪`, pId, '💪');
      setSynergyPoints((p) => p + 50);

      // Add smart reminder to partner celebrating or nudging
      const otherId: PartnerId = pId === 'partner1' ? 'partner2' : 'partner1';
      const newReminder: SmartReminder = {
        id: 'rem-' + Date.now(),
        targetPartnerId: otherId,
        type: 'partner_cheer',
        title: `🔥 ${profiles[pId].name} acabou de treinar!`,
        message: `${profiles[pId].name} finalizou "${wTitle}". Hora de manter o ritmo e não ficar para trás!`,
        timestamp: 'Agora',
        isRead: false,
        urgency: 'medium',
        actionLabel: 'Ver Treino',
        actionKey: 'open_workout',
      };
      setSmartReminders((r) => [newReminder, ...r]);
    }
  };

  const addCustomExercise = (workoutId: string, exercise: Omit<ExerciseItem, 'id' | 'completed'>) => {
    const newEx: ExerciseItem = {
      ...exercise,
      id: 'ex-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      completed: false,
    };
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          exercises: [...w.exercises, newEx],
          completed: false,
        };
      })
    );
  };

  // Diet interactions
  const toggleMeal = (partnerId: PartnerId, mealId: string) => {
    setDiets((prev) => {
      const partnerDiet = prev[partnerId];
      let toggledTitle = '';
      let isDone = false;

      const updatedMeals = partnerDiet.meals.map((m) => {
        if (m.id === mealId) {
          isDone = !m.completed;
          toggledTitle = m.title;
          return {
            ...m,
            completed: isDone,
            completedAt: isDone ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return m;
      });

      if (isDone) {
        addActivity('meal_done', `${profiles[partnerId].name} fez o check-in da refeição: ${toggledTitle}`, partnerId, '🥗');
        setSynergyPoints((p) => p + 20);
      }

      return {
        ...prev,
        [partnerId]: {
          ...partnerDiet,
          meals: updatedMeals,
        },
      };
    });
  };

  const replaceMealFood = (
    partnerId: PartnerId,
    mealId: string,
    newDescription: string,
    updatedMacros?: { calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number },
    substitutionTitle?: string,
    healthyTip?: string
  ) => {
    setDiets((prev) => {
      const partnerDiet = prev[partnerId];
      let mealTitle = '';
      const updatedMeals = partnerDiet.meals.map((m) => {
        if (m.id === mealId) {
          mealTitle = m.title;
          return {
            ...m,
            originalDescription: m.originalDescription || m.description,
            description: newDescription,
            calories: updatedMacros ? updatedMacros.calories : m.calories,
            proteinGrams: updatedMacros ? updatedMacros.proteinGrams : m.proteinGrams,
            carbsGrams: updatedMacros ? updatedMacros.carbsGrams : m.carbsGrams,
            fatGrams: updatedMacros ? updatedMacros.fatGrams : m.fatGrams,
            healthyTip: healthyTip || m.healthyTip,
            isAiSubstituted: true,
          };
        }
        return m;
      });

      const partnerName = profiles[partnerId].name;
      addActivity(
        'meal_done',
        `✨ ${partnerName} usou a IA do Gemini para substituir alimento no ${mealTitle}: "${substitutionTitle || 'Nova opção nutritiva'}"`,
        partnerId,
        '🪄'
      );
      setSynergyPoints((p) => p + 15);

      return {
        ...prev,
        [partnerId]: {
          ...partnerDiet,
          meals: updatedMeals,
        },
      };
    });
  };

  const revertMealFood = (partnerId: PartnerId, mealId: string) => {
    setDiets((prev) => {
      const partnerDiet = prev[partnerId];
      const updatedMeals = partnerDiet.meals.map((m) => {
        if (m.id === mealId && m.originalDescription) {
          return {
            ...m,
            description: m.originalDescription,
            isAiSubstituted: false,
          };
        }
        return m;
      });

      return {
        ...prev,
        [partnerId]: {
          ...partnerDiet,
          meals: updatedMeals,
        },
      };
    });
  };

  const addWater = (partnerId: PartnerId, amountMl: number) => {
    setDiets((prev) => {
      const currentMl = prev[partnerId].waterIntakeMl;
      const newMl = Math.max(0, currentMl + amountMl);
      const partnerName = profiles[partnerId].name;

      if (amountMl > 0) {
        addActivity('water_logged', `${partnerName} bebeu +${amountMl}ml de água (${newMl}ml hoje)`, partnerId, '💧');
      }

      // Check if goal reached
      if (newMl >= profiles[partnerId].dailyWaterGoalMl && currentMl < profiles[partnerId].dailyWaterGoalMl) {
        setSynergyPoints((p) => p + 40);
        const cheer: SmartReminder = {
          id: 'rem-w-' + Date.now(),
          targetPartnerId: partnerId,
          type: 'water',
          title: '🎉 Meta de Água Batida!',
          message: `Parabéns ${partnerName}! Você atingiu seus ${profiles[partnerId].dailyWaterGoalMl}ml de água hoje. Corpo hidratado e mente focada!`,
          timestamp: 'Agora',
          isRead: false,
          urgency: 'low',
        };
        setSmartReminders((r) => [cheer, ...r]);
      }

      return {
        ...prev,
        [partnerId]: {
          ...prev[partnerId],
          waterIntakeMl: newMl,
        },
      };
    });
  };

  // Branching challenges
  const toggleChallengeNode = (nodeId: string, partnerId: PartnerId) => {
    setChallenges((prev) => {
      return prev.map((node) => {
        if (node.id !== nodeId) return node;

        const p1Done = partnerId === 'partner1' ? !node.partner1Done : node.partner1Done;
        const p2Done = partnerId === 'partner2' ? !node.partner2Done : node.partner2Done;
        const bothDone = p1Done && p2Done;

        if (bothDone && (!node.partner1Done || !node.partner2Done)) {
          setSynergyPoints((p) => p + node.synergyRewardPoints);
          addActivity('challenge_unlocked', `🏆 CASAL CONCLUIU: "${node.title}"! (+${node.synergyRewardPoints} pts em sintonia)`, partnerId, '🏆');
        }

        return {
          ...node,
          partner1Done: p1Done,
          partner2Done: p2Done,
        };
      });
    });
  };

  // Nudge / Real-time cheer
  const sendNudge = (message: string, emoji: string) => {
    const sender = profiles[currentPartnerId].name;
    addActivity('nudge_sent', `${sender} mandou um incentivo especial: "${message}"`, currentPartnerId, emoji);

    const reminder: SmartReminder = {
      id: 'rem-nudge-' + Date.now(),
      targetPartnerId: otherPartnerId,
      type: 'partner_cheer',
      title: `${emoji} Mensagem do seu amor (${sender})`,
      message: `"${message}"`,
      timestamp: 'Agora',
      isRead: false,
      urgency: 'high',
      actionLabel: 'Mandar Coração',
      actionKey: 'return_heart',
    };
    setSmartReminders((r) => [reminder, ...r]);
    setSynergyPoints((p) => p + 15);
  };

  // Prenda actions
  const addPrenda = (newPrenda: Omit<PrendaContract, 'id' | 'status'>) => {
    const contract: PrendaContract = {
      ...newPrenda,
      id: 'pr-' + Date.now(),
      status: 'banco',
    };
    setPrendas((prev) => [contract, ...prev]);
    addActivity('prenda_triggered', `Nova prenda divertida cadastrada no banco: "${newPrenda.title}"`, currentPartnerId, '🎲');
  };

  const assignPrenda = (prendaId: string, targetPartner: PartnerId, reason: string) => {
    setPrendas((prev) =>
      prev.map((p) => {
        if (p.id !== prendaId) return p;
        return {
          ...p,
          status: 'ativa',
          targetUser: targetPartner,
          assignedAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          proofNotes: reason,
        };
      })
    );

    const victimName = profiles[targetPartner].name;
    addActivity('prenda_triggered', `🚨 PRENDA ATIVADA para ${victimName}: "${prendas.find((p) => p.id === prendaId)?.title || 'Prenda'}" (${reason})`, targetPartner, '⚖️');

    const reminder: SmartReminder = {
      id: 'rem-pr-' + Date.now(),
      targetPartnerId: targetPartner,
      type: 'prenda_warning',
      title: '🚨 Prenda Divertida Ativada!',
      message: `${victimName}, você tem uma prenda para pagar: "${prendas.find((p) => p.id === prendaId)?.title}". Não cumpriu a meta acordada!`,
      timestamp: 'Agora',
      isRead: false,
      urgency: 'high',
      actionLabel: 'Ver Detalhes da Prenda',
      actionKey: 'open_prenda',
    };
    setSmartReminders((r) => [reminder, ...r]);
  };

  const assignDailyGoalPenalty = (
    targetPartner: PartnerId,
    penaltyKey: DailyPenaltyOptionKey,
    reason?: string,
    customNote?: string
  ) => {
    const penaltyOption = DAILY_PENALTY_OPTIONS.find((opt) => opt.key === penaltyKey);
    const title = penaltyOption ? penaltyOption.title : 'Prenda Diária';
    const description = penaltyOption ? penaltyOption.description : 'Cumprir a prenda acordada pelo parceiro.';
    const chooser = targetPartner === 'partner1' ? 'partner2' : 'partner1';
    const chooserName = profiles[chooser].name;
    const victimName = profiles[targetPartner].name;

    const defaultReason = reason || `${victimName} não cumpriu a meta do dia e ${chooserName} escolheu esta prenda!`;
    const fullNotes = customNote ? `${defaultReason} (Obs: ${customNote})` : defaultReason;

    const newPrenda: PrendaContract = {
      id: 'pr-daily-' + Date.now(),
      title,
      description,
      severity: penaltyKey === 'massagem_caprichada' || penaltyKey === 'preparar_date' ? 'romantica' : penaltyKey === 'fazer_comida' ? 'gastronomica' : 'divertida',
      suggestedBy: chooser,
      targetUser: targetPartner,
      chosenBy: chooser,
      isDailyGoalPenalty: true,
      penaltyKey,
      status: 'ativa',
      assignedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      proofNotes: fullNotes,
    };

    setPrendas((prev) => [newPrenda, ...prev]);

    addActivity(
      'prenda_triggered',
      `⚖️ PRENDA DIÁRIA: ${chooserName} escolheu "${title}" para ${victimName} por não cumprir a meta do dia!`,
      chooser,
      penaltyOption ? penaltyOption.emoji : '⚖️'
    );

    const reminder: SmartReminder = {
      id: 'sr-daily-pr-' + Date.now(),
      targetPartnerId: targetPartner,
      type: 'prenda_warning',
      title: `🚨 Prenda do Dia Escolhida por ${chooserName}!`,
      message: `${victimName}, você não cumpriu a meta diária combinada! Sua prenda definida é: "${title}". ${fullNotes}`,
      timestamp: 'Agora',
      isRead: false,
      urgency: 'high',
      actionLabel: 'Ver Detalhes da Prenda',
      actionKey: 'open_prenda',
    };
    setSmartReminders((r) => [reminder, ...r]);
  };

  const settlePrenda = (prendaId: string, rating: number, proofNotes: string) => {
    setPrendas((prev) =>
      prev.map((p) => {
        if (p.id !== prendaId) return p;
        return {
          ...p,
          status: 'paga',
          settledAt: new Date().toLocaleDateString('pt-BR'),
          ratingByPartner: rating,
          proofNotes,
        };
      })
    );
    const prenda = prendas.find((p) => p.id === prendaId);
    if (prenda) {
      addActivity('prenda_triggered', `🎉 Prenda cumprida e perdoada! "${prenda.title}" (${rating} estrelas)`, currentPartnerId, '⭐');
      setSynergyPoints((p) => p + 100);
    }
  };

  const spinPrendaWheel = (targetPartner: PartnerId): PrendaContract | null => {
    const available = prendas.filter((p) => p.status === 'banco');
    if (available.length === 0) return null;
    const chosen = available[Math.floor(Math.random() * available.length)];
    assignPrenda(chosen.id, targetPartner, 'Sorteado na Roleta de Prendas por não cumprir a meta semanal');
    return chosen;
  };

  const updateProfile = (partnerId: PartnerId, updates: Partial<PartnerProfile>) => {
    setProfiles((prev) => ({
      ...prev,
      [partnerId]: {
        ...prev[partnerId],
        ...updates,
      },
    }));
  };

  const markReminderAsRead = (reminderId: string) => {
    setSmartReminders((prev) => prev.map((r) => (r.id === reminderId ? { ...r, isRead: true } : r)));
  };

  const dismissReminder = (reminderId: string) => {
    setSmartReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };

  // Smart reminder automated evaluation engine
  const triggerManualReminderCheck = () => {
    const newReminders: SmartReminder[] = [];
    const now = new Date();
    const p1WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner1' && w.completed).length;
    const p2WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner2' && w.completed).length;

    // Workout progress check
    if (p1WorkoutsDone < profiles.partner1.weeklyWorkoutGoal) {
      const remaining = profiles.partner1.weeklyWorkoutGoal - p1WorkoutsDone;
      newReminders.push({
        id: 'auto-w1-' + Date.now(),
        targetPartnerId: 'partner1',
        type: 'prenda_warning',
        title: '⚠️ Atenção à Meta de Treino!',
        message: `${profiles.partner1.name}, faltam ${remaining} treinos para cumprir sua meta semanal e evitar a prenda da semana!`,
        timestamp: 'Agora',
        isRead: false,
        urgency: remaining <= 2 ? 'high' : 'medium',
        actionLabel: 'Abrir Treinos',
        actionKey: 'open_workout',
      });
    }

    if (p2WorkoutsDone < profiles.partner2.weeklyWorkoutGoal) {
      const remaining = profiles.partner2.weeklyWorkoutGoal - p2WorkoutsDone;
      newReminders.push({
        id: 'auto-w2-' + Date.now(),
        targetPartnerId: 'partner2',
        type: 'prenda_warning',
        title: '⚠️ Atenção à Meta de Treino!',
        message: `${profiles.partner2.name}, faltam ${remaining} treinos para cumprir sua meta semanal e ficar livre de prendas!`,
        timestamp: 'Agora',
        isRead: false,
        urgency: remaining <= 2 ? 'high' : 'medium',
        actionLabel: 'Abrir Treinos',
        actionKey: 'open_workout',
      });
    }

    // Water intake check
    (['partner1', 'partner2'] as PartnerId[]).forEach((pId) => {
      const diet = diets[pId];
      const goal = profiles[pId].dailyWaterGoalMl;
      if (diet.waterIntakeMl < goal) {
        const missing = goal - diet.waterIntakeMl;
        newReminders.push({
          id: `auto-water-${pId}-` + Date.now(),
          targetPartnerId: pId,
          type: 'water',
          title: `💧 Hidratação para ${profiles[pId].name}`,
          message: `Você bebeu ${diet.waterIntakeMl}ml hoje. Faltam ${missing}ml para a meta diária. Tome água agora!`,
          timestamp: 'Agora',
          isRead: false,
          urgency: 'medium',
          actionLabel: '+300ml',
          actionKey: 'add_water',
        });
      }
    });

    if (newReminders.length > 0) {
      setSmartReminders((prev) => [...newReminders, ...prev.slice(0, 15)]);
    }
  };

  const toggleWalkCompletion = (date: string, partnerId: PartnerId) => {
    setWalkGoal((prev) => {
      const existing = prev.logs[date] || {
        id: 'walk-' + date,
        date,
        dayOfWeek: new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' }),
        isScheduledWalkDay: true,
        completedByPartner1: false,
        completedByPartner2: false,
        walkedTogether: false,
        durationMinutes: prev.targetMinutes,
        distanceKm: prev.targetKm,
        stepsCount: prev.targetSteps,
        intensity: 'moderado' as const,
      };

      const isP1 = partnerId === 'partner1';
      const currentVal = isP1 ? existing.completedByPartner1 : existing.completedByPartner2;
      const newVal = !currentVal;

      const updatedEntry: WalkLogEntry = {
        ...existing,
        completedByPartner1: isP1 ? newVal : existing.completedByPartner1,
        completedByPartner2: !isP1 ? newVal : existing.completedByPartner2,
        completedAt: newVal ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      };

      if (updatedEntry.completedByPartner1 && updatedEntry.completedByPartner2) {
        updatedEntry.walkedTogether = true;
      }

      const updatedLogs: Record<string, WalkLogEntry> = {
        ...prev.logs,
        [date]: updatedEntry,
      };

      let totalKm = 0;
      let totalMin = 0;
      Object.values(updatedLogs).forEach((log) => {
        if (log.completedByPartner1 || log.completedByPartner2) {
          totalKm += log.distanceKm || 0;
          totalMin += log.durationMinutes || 0;
        }
      });

      return {
        ...prev,
        totalKmThisWeek: Number(totalKm.toFixed(1)),
        totalMinutesThisWeek: totalMin,
        logs: updatedLogs,
      };
    });

    const pName = profiles[partnerId].name;
    addActivity('walk_logged', `👟 ${pName} concluiu a meta da caminhada dia sim, dia não!`, partnerId, '🚶');
    setSynergyPoints((p) => p + 35);
  };

  const logWalkDetails = (details: Partial<WalkLogEntry> & { date: string }) => {
    setWalkGoal((prev) => {
      const existing = prev.logs[details.date] || {
        id: 'walk-' + details.date,
        date: details.date,
        dayOfWeek: new Date(details.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' }),
        isScheduledWalkDay: true,
        completedByPartner1: false,
        completedByPartner2: false,
        walkedTogether: false,
        durationMinutes: prev.targetMinutes,
        distanceKm: prev.targetKm,
        stepsCount: prev.targetSteps,
        intensity: 'moderado' as const,
      };

      const updatedEntry: WalkLogEntry = {
        ...existing,
        ...details,
      };

      const updatedLogs: Record<string, WalkLogEntry> = {
        ...prev.logs,
        [details.date]: updatedEntry,
      };

      let totalKm = 0;
      let totalMin = 0;
      Object.values(updatedLogs).forEach((log) => {
        if (log.completedByPartner1 || log.completedByPartner2) {
          totalKm += log.distanceKm || 0;
          totalMin += log.durationMinutes || 0;
        }
      });

      return {
        ...prev,
        totalKmThisWeek: Number(totalKm.toFixed(1)),
        totalMinutesThisWeek: totalMin,
        logs: updatedLogs,
      };
    });

    addActivity('walk_logged', `🗺️ Registro de caminhada: ${details.distanceKm || 0}km (${details.durationMinutes || 0} min)`, currentPartnerId, '👟');
    setSynergyPoints((p) => p + 30);
  };

  const updateWalkGoalSettings = (settings: Partial<Pick<AlternateDayWalkGoal, 'targetMinutes' | 'targetKm' | 'targetSteps' | 'cyclePattern'>>) => {
    setWalkGoal((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setProfiles(INITIAL_PROFILES);
    setWorkouts(INITIAL_WORKOUTS);
    setDiets(INITIAL_DIETS);
    setWeeklyMetrics(INITIAL_WEEKLY_METRICS);
    setChallenges(INITIAL_CHALLENGE_NODES);
    setPrendas(INITIAL_PRENDAS);
    setSmartReminders(INITIAL_SMART_REMINDERS);
    setWalkGoal(INITIAL_WALK_GOAL);
    setSynergyPoints(850);
  };

  // Calculate Couple Sync Score (0 - 100%)
  const coupleSyncScore = useMemo(() => {
    const p1WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner1' && w.completed).length;
    const p2WorkoutsDone = workouts.filter((w) => w.partnerId === 'partner2' && w.completed).length;
    const workoutRatio = Math.min(1, (p1WorkoutsDone + p2WorkoutsDone) / (profiles.partner1.weeklyWorkoutGoal + profiles.partner2.weeklyWorkoutGoal));

    const p1WaterRatio = Math.min(1, diets.partner1.waterIntakeMl / profiles.partner1.dailyWaterGoalMl);
    const p2WaterRatio = Math.min(1, diets.partner2.waterIntakeMl / profiles.partner2.dailyWaterGoalMl);
    const waterRatio = (p1WaterRatio + p2WaterRatio) / 2;

    const p1MealsDone = diets.partner1.meals.filter((m) => m.completed).length;
    const p2MealsDone = diets.partner2.meals.filter((m) => m.completed).length;
    const dietRatio = (p1MealsDone / (diets.partner1.meals.length || 1) + p2MealsDone / (diets.partner2.meals.length || 1)) / 2;

    const challengesDone = challenges.filter((c) => c.partner1Done && c.partner2Done).length;
    const challengeRatio = Math.min(1, challengesDone / (challenges.length || 1));

    const score = Math.round(workoutRatio * 35 + waterRatio * 20 + dietRatio * 25 + challengeRatio * 20);
    return Math.min(100, Math.max(10, score));
  }, [workouts, diets, profiles, challenges]);

  return (
    <CoupleContext.Provider
      value={{
        profiles,
        currentPartnerId,
        setCurrentPartnerId,
        otherPartnerId,
        otherProfile,
        currentProfile,
        workouts,
        diets,
        weeklyMetrics,
        challenges,
        prendas,
        smartReminders,
        activityFeed,
        synergyPoints,
        coupleStreak: 8,
        coupleSyncScore,
        walkGoal,
        toggleWalkCompletion,
        logWalkDetails,
        updateWalkGoalSettings,
        toggleExercise,
        toggleWorkoutCompletion,
        addCustomExercise,
        toggleMeal,
        replaceMealFood,
        revertMealFood,
        addWater,
        toggleChallengeNode,
        sendNudge,
        addPrenda,
        settlePrenda,
        assignPrenda,
        assignDailyGoalPenalty,
        spinPrendaWheel,
        updateProfile,
        markReminderAsRead,
        dismissReminder,
        triggerManualReminderCheck,
        resetAllData,
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
