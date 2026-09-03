import { ExerciseBiomechanics } from '../types';
import { detectExerciseKey, ExerciseAnimationKey } from '../components/ExerciseCartoon';

export interface ExerciseGuideDetails {
  title: string;
  muscleGroup: string;
  animationKey: ExerciseAnimationKey;
  biomechanics: ExerciseBiomechanics;
}

const BIOMECHANICS_DATABASE: Record<string, ExerciseBiomechanics> = {
  squat: {
    setup: 'Pés na largura dos ombros ou ligeiramente mais abertos, pontas voltadas 15º a 30º para fora. Barra apoiada confortavelmente no trapézio (não na cervical). Abdômen travado com manobra de Valsalva.',
    execution: 'Inicie o movimento projetando o quadril para trás e flexionando os joelhos em sincronia. Desça controladamente em 2 a 3 segundos até as coxas quebrarem ou igualarem a linha paralela com o chão (90º). Empurre o chão com os calcanhares para subir.',
    targetMuscles: ['Quadríceps', 'Glúteo Máximo', 'Core / Eretores da Espinha', 'Panturrilhas'],
    commonMistakes: [
      'Deixar os joelhos colapsarem para dentro (valgo dinâmico)',
      'Tirar os calcanhares do chão ou projetar todo o peso nas pontas dos pés',
      'Curvar a lombar ("butt wink" excessivo no ponto mais fundo)',
    ],
    proTip: 'Imagine que você está "abrindo o chão" para fora com os pés durante toda a descida e subida.',
  },
  bench_press: {
    setup: 'Deitado no banco com 5 pontos de apoio firmes (cabeça, ombros, glúteos e os dois pés no chão). Escápulas aduzidas e deprimidas ("guardadas no bolso de trás").',
    execution: 'Desça os halteres ou a barra em 2 a 3 segundos, mantendo os cotovelos em um ângulo seguro de 45º a 60º em relação ao tronco. Toque suavemente a linha média do peitoral e empurre com explosão controlada.',
    targetMuscles: ['Peitoral Maior (Fibras Claviculares e Esternais)', 'Deltoide Anterior', 'Tríceps Braquial'],
    commonMistakes: [
      'Abrir os cotovelos a 90º da linha do corpo (sobrecarga na articulação do ombro)',
      'Tirar o glúteo do banco para compensar a carga',
      'Descer a barra quicando no osso do peito',
    ],
    proTip: 'Mantenha os punhos sempre retos e firmes na mesma linha dos antebraços.',
  },
  overhead_press: {
    setup: 'Em pé com base firme na largura do quadril, glúteos e abdômen fortemente contraídos para proteger a coluna lombar. Barra repousada na altura das clavículas com pegada um pouco mais aberta que os ombros.',
    execution: 'Empurre a barra verticalmente em linha reta. Afaste levemente a cabeça para trás para a passagem da barra e, assim que ela passar pela testa, encaixe o tronco suavemente para a frente.',
    targetMuscles: ['Deltoide Anterior e Lateral', 'Trapézio Superior', 'Tríceps', 'Core Estabilizador'],
    commonMistakes: [
      'Arquear excessivamente a coluna lombar para trás',
      'Não travar os glúteos durante o empurrão',
      'Projetar a barra muito para a frente em vez de para cima',
    ],
    proTip: 'Aperte a barra com força total nas mãos: isso ativa a irradiação neural e estabiliza os ombros.',
  },
  lateral_raise: {
    setup: 'Em pé ou sentado, tronco com inclinação sutil de 5º para a frente. Halteres ao lado das coxas, cotovelos levemente semi-flexionados.',
    execution: 'Eleve os halteres lateralmente pelos cotovelos (e não puxando pelas mãos) até a linha dos ombros. Segure o pico por 1 segundo e desça resistindo à gravidade em 2 a 3 segundos.',
    targetMuscles: ['Deltoide Lateral (Ombro Cabeça Medial)'],
    commonMistakes: [
      'Balançar o tronco usando impulso das pernas e lombar',
      'Elevar as mãos acima do nível dos cotovelos',
      'Encolher o pescoço e recrutar trapézio em vez do ombro',
    ],
    proTip: 'Pense em "derramar um jarro d\'água" suavemente no topo para isolar ao máximo o feixe lateral do ombro.',
  },
  lat_pulldown: {
    setup: 'Ajuste o rolo da coxa para travar suas pernas sem folga. Pegada aberta pronada ou neutra. Peito estufado e olhar voltado ligeiramente para cima.',
    execution: 'Inicie deprimindo as escápulas (ombros para baixo) e puxe a barra na direção da parte superior do peitoral, puxando com os cotovelos em direção ao quadril. Suba alongando totalmente os dorsais.',
    targetMuscles: ['Latíssimo do Dorso (Asas)', 'Romboide', 'Bíceps Braquial', 'Braquial'],
    commonMistakes: [
      'Puxar a barra atrás da nuca (risco lesivo desnecessário para o manguito)',
      'Jogar o tronco excessivamente para trás transformando em remada',
      'Não completar a extensão dos braços no topo',
    ],
    proTip: 'Conecte sua mente aos cotovelos: imagine que são ganchos puxando a barra em direção aos bolsos da calça.',
  },
  barbell_row: {
    setup: 'Pés na largura do quadril, joelhos levemente destravados, tronco inclinado a cerca de 45º a 60º com coluna neutra e firme. Olhar fixado 1 metro à frente no chão.',
    execution: 'Puxe a barra em direção ao umbigo, mantendo os cotovelos próximos às costelas. Conecte as duas escápulas no final do movimento e desça controladamente.',
    targetMuscles: ['Dorsais', 'Trapézio Médio/Inferior', 'Romboides', 'Deltoide Posterior', 'Bíceps'],
    commonMistakes: [
      'Arredondar a coluna lombar (perda da lordose natural)',
      'Usar tranco de quadril para erguer o peso',
      'Puxar na garganta em vez da linha do umbigo',
    ],
    proTip: 'Pausa isométrica de 1 segundo esmagando as costas no topo muda o resultado do exercício.',
  },
  bicep_curl: {
    setup: 'Em pé ou sentado, ombros para trás e peito aberto. Cotovelos firmemente colados nas laterais das costelas.',
    execution: 'Flexione os cotovelos erguendo a carga em arco sem permitir que os cotovelos se desloquem para a frente. No ponto mais alto, aperte o bíceps e desça resistindo por 3 segundos.',
    targetMuscles: ['Bíceps Braquial (Cabeça Longa e Curta)', 'Braquial Anterior', 'Braquiorradial'],
    commonMistakes: [
      'Jogar os cotovelos para a frente no topo para descansar a carga no ombro',
      'Balançar o tronco com a coluna lombar',
      'Não estender os braços quase por completo na parte baixa',
    ],
    proTip: 'Gire sutilmente o punho para fora (supinação) nos halteres para recrutar a cabeça curta do bíceps.',
  },
  tricep_pushdown: {
    setup: 'De frente para a polia alta, pés firmes, tronco com inclinação sutil para a frente. Cotovelos colados ao tronco.',
    execution: 'Estenda os braços para baixo empurrando a corda ou barra até o travamento total dos cotovelos. Na corda, afaste as pontas para fora no final para contração máxima.',
    targetMuscles: ['Tríceps Braquial (Cabeça Lateral, Medial e Longa)'],
    commonMistakes: [
      'Deixar os cotovelos subirem e descerem junto com o cabo',
      'Usar o peso do corpo jogando o peito por cima da corda',
    ],
    proTip: 'Mantenha o ombro 100% imóvel: apenas o antebraço se move como uma dobradiça de porta.',
  },
  hip_thrust: {
    setup: 'Parte inferior das escápulas apoiada no banco acolchoado. Pés afastados na largura dos ombros, apontando ligeiramente para fora. Barra posicionada exatamente na dobra do quadril (com almofada de proteção).',
    execution: 'Empurre o quadril para cima pelo calcanhar até que tronco, quadril e coxas formem uma mesa reta horizontal a 180º. Segure o pico por 2 segundos apertando os glúteos e desça controlando.',
    targetMuscles: ['Glúteo Máximo', 'Isquiotibiais (Posterior)', 'Quadríceps', 'Core'],
    commonMistakes: [
      'Hiperestender a coluna lombar no topo em vez de empurrar pelo quadril',
      'Olhar para o teto (mantenha o queixo apontado para o peito durante todo o movimento)',
      'Pés muito distantes ou muito próximos do banco',
    ],
    proTip: 'Mantenha o queixo colado ao peito e olhe para a frente durante toda a subida: isso garante ativação pura de glúteo e protege a lombar!',
  },
  bulgarian_squat: {
    setup: 'Em pé, posicione o peito de um dos pés apoiado para trás em um banco ou caixa. O pé da frente fica a cerca de 60-80cm de distância.',
    execution: 'Desça o joelho de trás em direção ao chão até que a coxa da frente fique paralela ao chão. Empurre pelo calcanhar da frente para retornar à posição inicial.',
    targetMuscles: ['Glúteo Máximo', 'Quadríceps', 'Isquiotibiais', 'Estabilizadores do Quadril'],
    commonMistakes: [
      'Dar passos muito curtos provocando sobrecarga patelar',
      'Desabar o tronco para os lados por falta de equilíbrio',
    ],
    proTip: 'Incline o tronco levemente para a frente (cerca de 15º) para transferir ainda mais carga para o glúteo.',
  },
  stiff: {
    setup: 'Pés na largura do quadril, halteres à frente das coxas. Joelhos semi-flexionados (destravados, mas mantidos fixos nessa angulação).',
    execution: 'Empurre o quadril para trás como se quisesse encostar em uma parede atrás de você. Deixe os halteres descerem colados às pernas até sentir um alongamento intenso na parte de trás da coxa. Retorne contraindo os glúteos.',
    targetMuscles: ['Isquiotibiais (Posterior de Coxa)', 'Glúteo Máximo', 'Eretores da Espinha'],
    commonMistakes: [
      'Dobrar excessivamente os joelhos transformando em agachamento',
      'Curvar a coluna dorsal ou lombar durante a descida',
      'Afastar os pesos para longe do corpo',
    ],
    proTip: 'O movimento não é de abaixar o tronco: é de EMPURRAR O BUMBUM PARA TRÁS. O tronco desce como consequência!',
  },
  leg_extension: {
    setup: 'Ajuste o encosto para que a dobra do seu joelho fique perfeitamente alinhada com o eixo de rotação da máquina. O rolo acolchoado deve repousar acima dos tornozelos.',
    execution: 'Estenda os joelhos até a contração total dos quadríceps. Segure a pausa de pico por 1 a 2 segundos antes de descer de forma lenta e controlada.',
    targetMuscles: ['Quadríceps (Reto Femoral e Vasto Lateral/Medial)'],
    commonMistakes: [
      'Deixar a carga bater no descanso entre repetições',
      'Jogar o tronco para trás e usar impulso',
    ],
    proTip: 'Aponte os dedos dos pés ligeiramente para cima durante a subida para tensionar ainda mais as fibras do quadríceps.',
  },
  plank: {
    setup: 'Antebraços no chão paralelos, cotovelos alinhados exatamente abaixo dos ombros. Pés apoiados na ponta dos dedos.',
    execution: 'Forme uma linha perfeitamente reta da cabeça aos calcanhares. Aperte glúteos, trave o abdômen ("puxe o umbigo na direção da coluna") e mantenha a respiração ritmada.',
    targetMuscles: ['Reto Abdominal', 'Transverso do Abdômen', 'Oblíquos', 'Glúteos', 'Ombros'],
    commonMistakes: [
      'Deixar o quadril cair em direção ao chão (sobrecarga lombar)',
      'Subir o bumbum formando uma pirâmide',
      'Prender a respiração (apneia)',
    ],
    proTip: 'Tente puxar os cotovelos isometricamente em direção aos pés: isso triplica a queima do core.',
  },
  crunches: {
    setup: 'Deitado de costas, joelhos dobrados a 90º com pés no chão ou suspensos. Mãos nas têmporas ou cruzadas sobre o peito.',
    execution: 'Enrole a coluna erguendo as escápulas do chão cerca de 10 a 15 cm. Concentre-se em aproximar as costelas do quadril, soltando todo o ar. Retorne sem relaxar a tensão.',
    targetMuscles: ['Reto Abdominal (Porção Superior e Média)'],
    commonMistakes: [
      'Puxar o pescoço com as mãos (forçando a cervical)',
      'Erguer toda a lombar do chão (o que ativa flexores de quadril em vez de abdômen)',
    ],
    proTip: 'Solte TODO o ar dos pulmões no momento mais alto do crunch para alcançar contração profunda do abdômen.',
  },
  walking: {
    setup: 'Postura ereta, ombros relaxados e para trás, olhar direcionado para o horizonte. Tênis de amortecimento adequado.',
    execution: 'Passadas naturais e ritmadas. Toque primeiro o calcanhar e role o pé suavemente até a ponta dos dedos. Braços oscilam suavemente a 90º em sincronia cruzada.',
    targetMuscles: ['Sistema Cardiovascular', 'Panturrilhas', 'Glúteos', 'Quadríceps', 'Queima Lipídica'],
    commonMistakes: [
      'Caminhar olhando para a tela do celular com o pescoço inclinado',
      'Dar passadas excessivamente longas que batem o calcanhar com impacto brusco',
      'Manter os braços caídos e imóveis',
    ],
    proTip: 'Aproveitem a caminhada para conversar sobre os objetivos da semana: é conexão de casal e saúde cardiovascular no mesmo ritmo!',
  },
  running: {
    setup: 'Tronco com leve inclinação natural de 5º para a frente a partir dos tornozelos. Olhar fixado 10 metros à frente.',
    execution: 'Cadência rápida (160-180 passos/min). Aterrissagem com o meio do pé logo abaixo do centro de gravidade. Braços bombeiam ritmicamente de trás para a frente.',
    targetMuscles: ['Capacidade Cardiorrespiratória', 'Panturrilhas', 'Quadríceps', 'Isquiotibiais', 'Core'],
    commonMistakes: [
      'Aterrissar com o calcanhar muito à frente do corpo (efeito freio)',
      'Cruzar os braços na frente do peito',
    ],
    proTip: 'Mantenham o ritmo sincronizado lado a lado para incentivar o parceiro no último terço do treino!',
  },
  general: {
    setup: 'Postura base com pés firmes, peito aberto, escápulas ativas e abdômen contraído.',
    execution: 'Execute o movimento mantendo controle articular pleno em todo o arco de movimento. Cadência recomendada: 2 segundos na fase excêntrica e 1 segundo com energia na concêntrica.',
    targetMuscles: ['Músculos Principais e Sinergistas do Movimento'],
    commonMistakes: [
      'Uso de impulsos corporais ou balanço exagerado',
      'Perda de postura e desalinhamento articular',
    ],
    proTip: 'Qualidade de movimento supera carga em qualquer fase do treino.',
  },
};

export function getExerciseBiomechanics(exerciseName: string, muscleGroup: string = ''): ExerciseGuideDetails {
  const key = detectExerciseKey(exerciseName, muscleGroup);
  const bio = BIOMECHANICS_DATABASE[key] || BIOMECHANICS_DATABASE.general;

  return {
    title: exerciseName,
    muscleGroup: muscleGroup || 'Geral',
    animationKey: key,
    biomechanics: bio,
  };
}
