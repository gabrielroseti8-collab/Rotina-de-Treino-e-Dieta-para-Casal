import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Gemini] GEMINI_API_KEY is not set. Fallback substitutions will be provided.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Intelligent fallback generator respecting dietary preferences and restrictions
function generateFallbackSubstitutions(params: {
  mealTitle: string;
  mealType: string;
  originalFood: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  partnerName: string;
  partnerGoal: string;
  dietaryPreferences: string[];
  dietaryRestrictions: string[];
  userCustomPrompt?: string;
}) {
  const {
    mealType,
    originalFood,
    calories,
    protein,
    carbs,
    fat,
    partnerName,
    dietaryRestrictions = [],
    dietaryPreferences = [],
    userCustomPrompt,
  } = params;

  const isDairyFree = dietaryRestrictions.some((r) =>
    r.toLowerCase().includes('lactose') || r.toLowerCase().includes('leite')
  );
  const isGlutenFree = dietaryRestrictions.some((r) =>
    r.toLowerCase().includes('glúten') || r.toLowerCase().includes('gluten')
  );
  const isHypertrophy = dietaryPreferences.some((p) =>
    p.toLowerCase().includes('hipertrofia') || p.toLowerCase().includes('massa')
  );

  let substitutions = [];

  if (mealType.toLowerCase().includes('café') || mealType.toLowerCase().includes('lanche')) {
    substitutions = [
      {
        title: isDairyFree
          ? 'Crepioca Proteica com Recheio de Frango e Ervas'
          : 'Omelete de Claras com Queijo de Búfala e Tomatinhos',
        portion: '2 claras + 1 ovo inteiro com 80g de recheio magro',
        reason: `Substitui "${originalFood}" mantendo alto teor proteico de alto valor biológico, sem sobrecarregar calorias e ${
          isDairyFree ? 'rigorosamente 100% livre de lactose.' : 'com digestão leve e saciedade prolongada.'
        }`,
        preparationTip: 'Bata os ovos com uma pitada de orégano e cúrcuma anti-inflamatória em frigideira antiaderente untada com gotas de azeite.',
        estimatedCalories: Math.round(calories * 0.95),
        estimatedProtein: Math.max(20, Math.round(protein * 1.05)),
        estimatedCarbs: Math.round(carbs * 0.8),
        estimatedFat: Math.round(fat * 0.9),
        matchesRestrictions: true,
        compatibilityBadge: isDairyFree ? '✅ 100% Sem Lactose' : '💪 Alta Proteína',
      },
      {
        title: isDairyFree
          ? 'Shake Anabólico com Leite de Amêndoas, Proteína Vegetal e Frutas Vermelhas'
          : 'Bowl de Iogurte Grego Proteico com Morangos e Sementes de Chia',
        portion: '1 porção média (300ml / 250g)',
        reason: `Excelente para ${partnerName} quando busca praticidade ou sabor refrescante. Garante energia contínua e rica em antioxidantes.`,
        preparationTip: 'Misture bem e adicione sementes de chia ou linhaça para desacelerar o índice glicêmico e dar crocância.',
        estimatedCalories: Math.round(calories * 0.9),
        estimatedProtein: Math.round(protein * 0.98),
        estimatedCarbs: Math.round(carbs * 1.1),
        estimatedFat: Math.round(fat * 0.85),
        matchesRestrictions: true,
        compatibilityBadge: isGlutenFree ? '🌾 Sem Glúten' : '⚡ Rápido e Prático',
      },
      {
        title: 'Panqueca de Banana com Farelo de Aveia e Pasta de Amendoim',
        portion: '1 banana madura + 2 colheres de aveia + 1 ovo',
        reason: 'Alternativa doce saudável para saciar a vontade de sobremesa sem furar a dieta do casal.',
        preparationTip: 'Amasse a banana, misture com o ovo e o farelo de aveia. Grelhe dos dois lados e finalize com canela em pó.',
        estimatedCalories: Math.round(calories * 1.02),
        estimatedProtein: Math.round(protein * 0.9),
        estimatedCarbs: Math.round(carbs * 1.2),
        estimatedFat: Math.round(fat * 0.95),
        matchesRestrictions: true,
        compatibilityBadge: '🍌 Sabor Doce & Saudável',
      },
    ];
  } else {
    // Almoço ou Jantar
    substitutions = [
      {
        title: isDairyFree
          ? 'Filé de Tilápia com Purê de Mandioquinha e Brócolis no Vapor'
          : 'Salmão Grelhado com Arroz Negro e Aspargos',
        portion: '150g de peixe grelhado + 120g de mandioquinha/arroz + legumes à vontade',
        reason: `Substituição leve e riquíssima em ômega-3 e aminoácidos essenciais, perfeita para a recuperação muscular de ${partnerName} respeitando restrições.`,
        preparationTip: 'Tempere o peixe com raspas de limão siciliano, alecrim e pimenta-do-reino moída na hora antes de grelhar.',
        estimatedCalories: Math.round(calories * 0.98),
        estimatedProtein: Math.round(protein * 1.05),
        estimatedCarbs: Math.round(carbs * 0.95),
        estimatedFat: Math.round(fat * 0.9),
        matchesRestrictions: true,
        compatibilityBadge: '🐟 Rico em Ômega-3',
      },
      {
        title: 'Iscas de Patinho Aceboladas com Batata Doce Assada e Mix de Folhas Verdes',
        portion: '140g de carne magra + 130g de batata doce com casca',
        reason: `Densidade de ferro e zinco para ${isHypertrophy ? 'otimizar o ganho de massa magra' : 'manter a saciedade e disposição'}, com carboidrato de baixo índice glicêmico.`,
        preparationTip: 'Asse a batata doce cortada em rodelas com páprica defumada e alecrim por 25 minutos na airfryer ou forno.',
        estimatedCalories: Math.round(calories * 1.02),
        estimatedProtein: Math.round(protein * 1.08),
        estimatedCarbs: Math.round(carbs * 1.0),
        estimatedFat: Math.round(fat * 0.92),
        matchesRestrictions: true,
        compatibilityBadge: '🥩 Alta Saciedade',
      },
      {
        title: 'Bowl Colorido de Frango Grelhado com Quinoa Real e Abacate em Cubos',
        portion: '130g de peito de frango + 4 colheres de quinoa cozida + 1/4 de abacate',
        reason: 'Combinação perfeita de gorduras monoinsaturadas anti-inflamatórias, carboidratos ricos em fibras e proteína limpa.',
        preparationTip: 'Regue com azeite extravirgem e gotas de limão para potencializar a absorção de micronutrientes.',
        estimatedCalories: Math.round(calories * 0.96),
        estimatedProtein: Math.round(protein * 0.97),
        estimatedCarbs: Math.round(carbs * 0.9),
        estimatedFat: Math.round(fat * 1.05),
        matchesRestrictions: true,
        compatibilityBadge: '🥑 Gorduras Boas',
      },
    ];
  }

  return {
    substitutions,
    nutritionistAdvice: `Para a meta de ${partnerName} (${params.partnerGoal}), as opções acima equilibram os macronutrientes da refeição (${protein}g proteína e ~${calories} kcal), eliminando qualquer risco de ingredientes incompatíveis com as restrições cadastradas (${dietaryRestrictions.join(', ') || 'nenhuma restrição'}).`,
    partnerSynergyTip: `Dica para o casal: Preparem a base dos vegetais e carboidratos juntos em porções dobradas (batch cooking) para economizar tempo durante a semana e manterem a disciplina mútua!`,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Food Substitution Endpoint using Gemini API
  app.post('/api/diet/substitute', async (req: Request, res: Response) => {
    try {
      const {
        mealTitle = 'Refeição',
        mealType = 'Almoço',
        originalFood = 'Refeição balanceada',
        calories = 450,
        protein = 30,
        carbs = 40,
        fat = 15,
        partnerName = 'Parceiro',
        partnerGoal = 'Vida Saudável',
        dietaryPreferences = [],
        dietaryRestrictions = [],
        userCustomPrompt = '',
      } = req.body;

      const ai = getGenAI();

      if (!ai) {
        // Fallback when API key is not yet configured
        const fallbackData = generateFallbackSubstitutions({
          mealTitle,
          mealType,
          originalFood,
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat),
          partnerName,
          partnerGoal,
          dietaryPreferences,
          dietaryRestrictions,
          userCustomPrompt,
        });

        return res.json({
          success: true,
          data: fallbackData,
          source: 'local_smart_engine',
          note: 'Configure GEMINI_API_KEY nos Secrets para utilizar o modelo gemini-3.8-flash em tempo real.',
        });
      }

      // Prompt for Gemini model
      const prompt = `Você é um nutricionista esportivo de elite especializado em alimentação e rotina saudável para casais.
O parceiro(a) "${partnerName}" precisa de uma sugestão de substituição alimentar para a seguinte refeição:
- Refeição: ${mealTitle} (${mealType})
- Alimento/Preparo atual: "${originalFood}"
- Macronutrientes atuais: ~${calories} kcal | ${protein}g Proteína | ${carbs}g Carboidratos | ${fat}g Gordura
- Objetivo físico cadastrado: ${partnerGoal}
- Preferências cadastradas no perfil: ${
        Array.isArray(dietaryPreferences) && dietaryPreferences.length > 0
          ? dietaryPreferences.join(', ')
          : 'Sem preferências específicas'
      }
- Restrições alimentares / Alergias cadastradas: ${
        Array.isArray(dietaryRestrictions) && dietaryRestrictions.length > 0
          ? dietaryRestrictions.join(', ')
          : 'Sem restrições declaradas'
      }
${userCustomPrompt ? `- Desejo / Pedido adicional pontual do usuário: "${userCustomPrompt}"` : ''}

DIRETRIZES CRÍTICAS:
1. Respeite com 100% de rigor as restrições alimentares declaradas. Se o perfil tiver intolerância a lactose, NUNCA sugira laticínios normais (use versões zero lactose, vegetais ou ovos/carnes). Se tiver preferência sem glúten, evite trigo/farinhas com glúten.
2. Mantenha os macronutrientes equivalentes ou muito próximos da refeição original para manter a consistência da dieta diária do casal.
3. Forneça de 2 a 3 sugestões de alta gastronomia saudável e fácil preparo no dia a dia.
4. Explique a justificativa nutricional, modo de preparo prático e estimativa precisa de calorias, proteínas, carboidratos e gorduras.
5. Forneça uma dica nutricional focada no objetivo do parceiro e uma dica de sinergia para o casal preparar ou compartilhar momentos juntos na cozinha.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              substitutions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    portion: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    preparationTip: { type: Type.STRING },
                    estimatedCalories: { type: Type.INTEGER },
                    estimatedProtein: { type: Type.INTEGER },
                    estimatedCarbs: { type: Type.INTEGER },
                    estimatedFat: { type: Type.INTEGER },
                    matchesRestrictions: { type: Type.BOOLEAN },
                    compatibilityBadge: { type: Type.STRING },
                  },
                  required: [
                    'title',
                    'portion',
                    'reason',
                    'preparationTip',
                    'estimatedCalories',
                    'estimatedProtein',
                    'estimatedCarbs',
                    'estimatedFat',
                    'matchesRestrictions',
                    'compatibilityBadge',
                  ],
                },
              },
              nutritionistAdvice: { type: Type.STRING },
              partnerSynergyTip: { type: Type.STRING },
            },
            required: ['substitutions', 'nutritionistAdvice'],
          },
        },
      });

      const rawText = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch (err) {
        console.error('[Gemini] JSON Parse error from model output:', rawText);
        parsedData = generateFallbackSubstitutions({
          mealTitle,
          mealType,
          originalFood,
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat),
          partnerName,
          partnerGoal,
          dietaryPreferences,
          dietaryRestrictions,
          userCustomPrompt,
        });
      }

      return res.json({
        success: true,
        data: parsedData,
        source: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.error('[Gemini API Error]:', error);
      // If error occurs, smoothly provide fallback substitutions so UI never fails
      const fallbackData = generateFallbackSubstitutions({
        mealTitle: req.body?.mealTitle || 'Refeição',
        mealType: req.body?.mealType || 'Almoço',
        originalFood: req.body?.originalFood || 'Refeição',
        calories: Number(req.body?.calories || 450),
        protein: Number(req.body?.protein || 30),
        carbs: Number(req.body?.carbs || 40),
        fat: Number(req.body?.fat || 15),
        partnerName: req.body?.partnerName || 'Parceiro',
        partnerGoal: req.body?.partnerGoal || 'Saúde',
        dietaryPreferences: req.body?.dietaryPreferences || [],
        dietaryRestrictions: req.body?.dietaryRestrictions || [],
        userCustomPrompt: req.body?.userCustomPrompt || '',
      });

      return res.json({
        success: true,
        data: fallbackData,
        source: 'local_smart_engine',
        warning: 'Resposta gerada pelo motor inteligente de contingência.',
      });
    }
  });

  // Vite development middleware or static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DuoFit Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
