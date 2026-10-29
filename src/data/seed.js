import { addDaysISO, todayISO, uid } from '../lib/date.js'

// As quatro jornadas originais ficam preservadas aqui para eventual reativação.
// A interface ativa usa somente ACTIVE_PHASE.
export const PHASES = [
  {
    id: 'cycle',
    label: 'Ciclo menstrual',
    short: 'Ciclo',
    subtitle: 'Seu ciclo, no seu ritmo',
    description: 'Acompanhe menstruação, fertilidade, sintomas e sinais vitais.',
  },
  {
    id: 'pregnancy',
    label: 'Gravidez',
    short: 'Gravidez',
    subtitle: 'Cada fase importa',
    description: 'Acompanhe o desenvolvimento do bebê, consultas e bem-estar.',
  },
  {
    id: 'menopause',
    label: 'Menopausa',
    short: 'Menopausa',
    subtitle: 'Mais equilíbrio para cada fase',
    description: 'Registre sintomas, entenda seus hormônios e crie novos hábitos.',
  },
  {
    id: 'preventive',
    label: 'Exames e preventivo',
    short: 'Exames',
    subtitle: 'Sua saúde em todas as fases',
    description: 'Mantenha exames, vacinas e consultas sempre em dia.',
  },
]

export const PHASE_MAP = Object.fromEntries(PHASES.map((phase) => [phase.id, phase]))
export const ACTIVE_PHASE = PHASE_MAP.cycle

export const SYMPTOM_OPTIONS = [
  { id: 'cramps', label: 'Cólicas', icon: 'cramps', tone: 'rose' },
  { id: 'headache', label: 'Dor de cabeça', icon: 'headache', tone: 'lavender' },
  { id: 'bloating', label: 'Inchaço', icon: 'bloating', tone: 'blue' },
  { id: 'breast-tenderness', label: 'Sensibilidade nos seios', icon: 'Heart', tone: 'rose' },
  { id: 'fatigue', label: 'Cansaço', icon: 'BatteryLow', tone: 'peach' },
  { id: 'mood', label: 'Alterações de humor', icon: 'Smile', tone: 'yellow' },
  { id: 'acne', label: 'Acne', icon: 'Sparkles', tone: 'green' },
  { id: 'back-pain', label: 'Dor lombar', icon: 'Activity', tone: 'rose' },
  { id: 'nausea', label: 'Náusea', icon: 'Waves', tone: 'peach' },
  { id: 'insomnia', label: 'Insônia', icon: 'Moon', tone: 'purple' },
  { id: 'appetite', label: 'Alterações de apetite', icon: 'Utensils', tone: 'green' },
  { id: 'dizziness', label: 'Tontura', icon: 'Sparkles', tone: 'blue' },
]

export const WELLNESS_ARTICLES = [
  {
    id: 'cycle-nutrition',
    category: 'Alimentação',
    title: 'Alimentação ao longo do ciclo',
    description: 'Escolhas simples para apoiar energia, humor e conforto.',
    icon: 'Salad',
    color: 'green',
    body: 'Priorize refeições coloridas, fibras, proteínas magras e gorduras boas. Em dias de fluxo intenso, alimentos ricos em ferro e vitamina C ajudam a repor o que o corpo perde. Observe como você se sente em cada fase e ajuste sem rigidez.',
  },
  {
    id: 'iron',
    category: 'Alimentação',
    title: 'Ferro e energia na menstruação',
    description: 'Entenda por que o cansaço aparece e como se cuidar.',
    icon: 'Milk',
    color: 'rose',
    body: 'Feijão, lentilha, carnes magras, ovos e folhas verde-escuras são fontes de ferro. Combinar com frutas cítricas melhora a absorção. Se o cansaço for frequente, converse com uma profissional de saúde e avalie exames.',
  },
  {
    id: 'hydration',
    category: 'Alimentação',
    title: 'Hidratação sem esforço',
    description: 'Pequenos goles ao longo do dia fazem diferença.',
    icon: 'GlassWater',
    color: 'blue',
    body: 'Manter uma garrafa por perto ajuda a criar o hábito. Água, chás sem cafeína e frutas com bastante água contribuem para o bem-estar. O registro rápido do app pode servir como um lembrete gentil.',
  },
  {
    id: 'movement',
    category: 'Exercício',
    title: 'Movimento em cada fase',
    description: 'Respeite seu corpo e escolha o que faz sentido hoje.',
    icon: 'Dumbbell',
    color: 'purple',
    body: 'Em dias de cólica, alongamentos leves e caminhadas curtas podem ajudar. Em dias com mais disposição, atividades aeróbicas e força são bem-vindas. O melhor movimento é aquele que você consegue fazer com segurança e prazer.',
  },
  {
    id: 'sleep',
    category: 'Sono',
    title: 'Sono e ciclo menstrual',
    description: 'As mudanças hormonais podem influenciar o descanso.',
    icon: 'MoonStar',
    color: 'lavender',
    body: 'Algumas pessoas sentem mais sono antes da menstruação, enquanto outras têm dificuldade para dormir. Horários regulares, menos telas à noite e um ambiente confortável ajudam. Registre seu sono para identificar padrões.',
  },
  {
    id: 'emotions',
    category: 'Saúde mental',
    title: 'Humor e autocuidado',
    description: 'Acolha suas emoções em vez de lutar contra elas.',
    icon: 'Brain',
    color: 'peach',
    body: 'Alterações de humor podem acontecer ao longo do ciclo. Nomear o que você sente, respirar com calma, escrever e pedir apoio são estratégias válidas. Se sentimentos difíceis forem intensos ou persistentes, procure apoio profissional.',
  },
  {
    id: 'heat-therapy',
    category: 'Ciclo',
    title: 'Compressa morna para cólicas',
    description: 'Um cuidado simples que pode trazer alívio.',
    icon: 'Thermometer',
    color: 'rose',
    body: 'Uma compressa morna na região do abdômen ajuda a relaxar a musculatura e pode aliviar cólicas leves. Use por alguns minutos, com cuidado para não aquecer demais a pele. Se a dor for forte ou diferente do habitual, procure avaliação.',
  },
  {
    id: 'cycle-tracking',
    category: 'Ciclo',
    title: 'Por que registrar o primeiro dia?',
    description: 'Seu histórico deixa as previsões mais pessoais.',
    icon: 'Activity',
    color: 'green',
    body: 'O primeiro dia da menstruação marca o início de um novo ciclo. Registrar essa data por alguns meses permite observar a duração média, variações e sintomas recorrentes. Assim, o app deixa de usar apenas uma média genérica.',
  },
]

// Dados das antigas telas de exames, preservados para reativação futura.
export const EXAM_TIPS = [
  { id: 'pap', title: 'Preventivo (Papanicolau)', description: 'É rápido, simples e pode salvar vidas.', icon: 'Flower2' },
  { id: 'mammogram', title: 'Mamografia', description: 'Detecta alterações nas mamas ainda no início.', icon: 'ScanHeart' },
  { id: 'blood', title: 'Exames de sangue', description: 'Ajudam a entender deficiências, doenças e riscos.', icon: 'FlaskConical' },
  { id: 'bone', title: 'Densitometria óssea', description: 'Avalia a densidade dos ossos e previne a osteoporose.', icon: 'Bone' },
  { id: 'breast', title: 'Autoexame das mamas', description: 'Conheça seu corpo e fique atenta a qualquer mudança.', icon: 'HeartHandshake' },
]

export const HEALTH_UNITS = [
  { id: 'ubs-centro', name: 'UBS Centro', address: 'Rua das Flores, 123 — Centro', phone: '(48) 3344-5566', hours: 'Segunda a sexta, 07:00–17:00', available: true, services: ['Consulta ginecológica', 'Preventivo (Papanicolau)', 'Exames laboratoriais', 'Vacinação'] },
  { id: 'ubs-vila-nova', name: 'UBS Vila Nova', address: 'Av. das Palmeiras, 456 — Vila Nova', phone: '(48) 3344-5577', hours: 'Segunda a sexta, 08:00–16:00', available: true, services: ['Consulta ginecológica', 'Preventivo (Papanicolau)', 'Exames laboratoriais'] },
  { id: 'ubs-jardim', name: 'UBS Jardim das Acácias', address: 'Rua das Jéquiz, 789 — Jardim das Acácias', phone: '(48) 3344-5588', hours: 'Terça a sábado, 07:00–13:00', available: true, services: ['Consulta ginecológica', 'Vacinação', 'Exames laboratoriais'] },
]

const symptomSeed = [
  ['cramps', 3], ['fatigue', 2], ['bloating', 2], ['headache', 3],
  ['mood', 3], ['insomnia', 2], ['cramps', 4], ['back-pain', 2],
  ['appetite', 2], ['acne', 2], ['breast-tenderness', 3], ['nausea', 1],
  ['dizziness', 2], ['fatigue', 3],
]

export function createDefaultData(name = 'Luciene Oliveira', email = 'luciene@email.com', _phase = 'cycle') {
  const today = todayISO()
  const symptomLabel = (type) => SYMPTOM_OPTIONS.find((option) => option.id === type)?.label || 'Sintoma'
  const cycleStart = addDaysISO(today, -11)

  return {
    version: 1,
    profile: {
      name,
      email,
      phone: '(48) 99999-0000',
      birthDate: '1990-05-18',
      city: 'Palhoça, SC',
      avatar: '',
      emergencyContact: '',
      bio: 'Cuidando do meu ciclo, um dia de cada vez.',
    },
    settings: {
      phase: 'cycle',
      cycleLength: 28,
      periodLength: 5,
      notifications: { reminders: true, symptoms: true, tips: true, email: false, sound: false },
      privacy: {
        biometricLock: false,
        usageData: true,
        shareWithProfessional: false,
        discreet: false,
        quickLock: true,
        autoLock: false,
        pin: '',
      },
      accessibility: { highContrast: false, reducedMotion: false, textScale: 1 },
      language: 'pt-BR',
      deviceConnected: true,
    },
    cycle: {
      entries: [
        { id: uid('cycle'), startDate: cycleStart, duration: 5, flow: 'Moderado', notes: 'Ciclo atual' },
        { id: uid('cycle'), startDate: addDaysISO(today, -39), duration: 5, flow: 'Leve', notes: '' },
        { id: uid('cycle'), startDate: addDaysISO(today, -67), duration: 6, flow: 'Moderado', notes: '' },
        { id: uid('cycle'), startDate: addDaysISO(today, -95), duration: 5, flow: 'Intenso', notes: '' },
      ],
    },
    periodDays: Array.from({ length: 5 }).map((_, index) => ({
      id: uid('flow'),
      date: addDaysISO(cycleStart, index),
      flow: ['Moderado', 'Moderado', 'Intenso', 'Leve', 'Leve'][index],
    })),
    symptoms: symptomSeed.map(([type, intensity], index) => ({
      id: uid('symptom'),
      date: addDaysISO(today, -index),
      type,
      label: symptomLabel(type),
      intensity,
      mood: [3, 4, 2, 4, 3, 5, 3, 2, 4, 3, 4, 3, 2, 4][index],
      notes: index === 1 ? 'Um dia de mais cansaço, com pausas ao longo da tarde.' : '',
    })),
    moods: [
      { id: uid('mood'), date: addDaysISO(today, -3), mood: 4, source: 'seed' },
      { id: uid('mood'), date: addDaysISO(today, -2), mood: 3, source: 'seed' },
      { id: uid('mood'), date: addDaysISO(today, -1), mood: 4, source: 'seed' },
    ],
    water: [
      { id: uid('water'), date: today },
      { id: uid('water'), date: today },
    ],
    vitals: Array.from({ length: 12 }).map((_, index) => ({
      id: uid('vital'),
      date: addDaysISO(today, -(11 - index)),
      temperature: Number((36.15 + (index / 11) * 0.55 + (index % 3) * 0.04).toFixed(1)),
      heartRate: 68 + ((index * 3) % 8),
      sleep: Number((6.4 + ((index * 7) % 16) / 10).toFixed(1)),
      weight: Number((62.1 + index * 0.04).toFixed(1)),
      bloodPressure: '110/70',
    })),
    reminders: [
      { id: uid('rem'), title: 'Registrar como me sinto', description: 'Check-in de sintomas e humor', date: today, time: '09:00', category: 'Sintomas', active: true, done: false },
      { id: uid('rem'), title: 'Suplemento de vitamina D', description: 'Todos os dias · 1 cápsula', date: today, time: '09:30', category: 'Medicação', active: true, done: false },
      { id: uid('rem'), title: 'Hidrate-se', description: 'Hoje · 2 litros', date: today, time: '14:00', category: 'Bem-estar', active: true, done: false },
      { id: uid('rem'), title: 'Revisar calendário do ciclo', description: 'Veja a previsão do próximo período', date: addDaysISO(today, 3), time: '10:00', category: 'Ciclo', active: true, done: false },
      { id: uid('rem'), title: 'Preparar compressa morna', description: 'Cuidado para dias de cólica', date: addDaysISO(today, 8), time: '19:00', category: 'Bem-estar', active: true, done: false },
    ],
    exams: [],
    appointments: [],
    diary: [],
    notifications: [
      { id: uid('notif'), title: 'Seu ciclo está na fase fértil', description: 'Acompanhe os sinais do seu corpo hoje.', date: today, time: '08:30', read: false, category: 'Ciclo' },
      { id: uid('notif'), title: 'Registre como você está', description: 'Humor, sintomas e água em um toque.', date: today, time: '07:00', read: false, category: 'Bem-estar' },
      { id: uid('notif'), title: 'Dica do dia', description: 'Pequenas pausas ajudam em dias de cólica.', date: addDaysISO(today, -1), time: '09:15', read: false, category: 'Dica' },
      { id: uid('notif'), title: 'Previsão do próximo ciclo', description: 'Sua próxima menstruação está chegando.', date: addDaysISO(today, -2), time: '16:20', read: true, category: 'Ciclo' },
      { id: uid('notif'), title: 'Relatório do ciclo pronto', description: 'Veja seus padrões dos últimos meses.', date: addDaysISO(today, -5), time: '10:12', read: true, category: 'Relatório' },
    ],
    devices: { connected: true, battery: 78, name: 'Pulseira Luna Cycle', lastSync: today },
    pregnancy: { startDate: null, dueDate: null, babyName: '', favorite: false },
    menopause: { stage: 'Ciclo menstrual', startAge: null, focus: ['Ciclo', 'Humor', 'Sintomas'] },
    favorites: ['cycle-nutrition', 'sleep'],
    createdAt: new Date().toISOString(),
  }
}
