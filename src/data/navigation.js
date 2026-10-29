// Navegação ativa: o produto agora é focado exclusivamente no ciclo menstrual.
export const ALL_LINKS = [
  { to: '/app', label: 'Início', icon: 'House', group: 'Meu ciclo' },
  { to: '/app/cycle-calendar', label: 'Calendário do ciclo', icon: 'CalendarDays', group: 'Meu ciclo' },
  { to: '/app/menstruation', label: 'Registrar menstruação', icon: 'Droplet', group: 'Meu ciclo' },
  { to: '/app/my-cycle', label: 'Meu ciclo', icon: 'Activity', group: 'Meu ciclo' },
  { to: '/app/health', label: 'Saúde', icon: 'HeartPulse', group: 'Saúde' },
  { to: '/app/symptoms', label: 'Sintomas', icon: 'Stethoscope', group: 'Saúde' },
  { to: '/app/hormones', label: 'Saúde hormonal', icon: 'ChartNoAxesCombined', group: 'Saúde' },
  { to: '/app/reports', label: 'Relatórios', icon: 'ChartColumn', group: 'Saúde' },
  { to: '/app/devices', label: 'Dispositivos', icon: 'Watch', group: 'Saúde' },
  { to: '/app/wellness', label: 'Bem-estar', icon: 'Flower2', group: 'Cuidados' },
  { to: '/app/tips', label: 'Dicas e orientações', icon: 'Lightbulb', group: 'Cuidados' },
  { to: '/app/reminders', label: 'Lembretes', icon: 'BellRing', group: 'Cuidados' },
  { to: '/app/notifications', label: 'Notificações', icon: 'Bell', group: 'Cuidados' },
  { to: '/app/profile', label: 'Perfil', icon: 'User', group: 'Conta' },
  { to: '/app/settings', label: 'Configurações', icon: 'Settings', group: 'Conta' },
  { to: '/app/about', label: 'Sobre o Luna Cycle', icon: 'Info', group: 'Conta' },
  { to: '/app/support', label: 'Ajuda e suporte', icon: 'CircleHelp', group: 'Conta' },
]

// Preservado para uma possível reativação futura. Não aparece na interface.
export const LEGACY_LINKS = [
  { to: '/app/calendar', label: 'Calendário', icon: 'CalendarRange', group: 'Gravidez' },
  { to: '/app/baby', label: 'Meu bebê', icon: 'Baby', group: 'Gravidez' },
  { to: '/app/diary', label: 'Diário', icon: 'BookHeart', group: 'Gravidez' },
  { to: '/app/exams', label: 'Exames e preventivo', icon: 'ClipboardList', group: 'Exames' },
  { to: '/app/exam-calendar', label: 'Calendário de exames', icon: 'CalendarClock', group: 'Exames' },
  { to: '/app/preventive', label: 'Preventivo', icon: 'ShieldCheck', group: 'Exames' },
  { to: '/app/history', label: 'Meu histórico', icon: 'History', group: 'Exames' },
  { to: '/app/exam-tips', label: 'Dicas de exames', icon: 'Microscope', group: 'Exames' },
  { to: '/app/schedule-exam', label: 'Agendar exame', icon: 'CalendarPlus', group: 'Exames' },
  { to: '/app/units', label: 'Unidades de saúde', icon: 'MapPin', group: 'Exames' },
  { to: '/app/e-sus', label: 'e-SUS', icon: 'CloudUpload', group: 'Exames' },
  { to: '/app/alerts', label: 'Alertas e lembretes', icon: 'TriangleAlert', group: 'Exames' },
]

export const LEGACY_GROUPS = {
  pregnancy: [
    { title: 'Minha gestação', items: ['/app', '/app/baby', '/app/calendar', '/app/diary'] },
    { title: 'Saúde', items: ['/app/health', '/app/symptoms', '/app/exams', '/app/exam-calendar'] },
    { title: 'Cuidados', items: ['/app/reminders', '/app/tips', '/app/notifications'] },
    { title: 'Conta', items: ['/app/profile', '/app/settings', '/app/support'] },
  ],
  menopause: [
    { title: 'Minha fase', items: ['/app', '/app/symptoms', '/app/hormones', '/app/reports'] },
    { title: 'Cuidados', items: ['/app/wellness', '/app/tips', '/app/reminders', '/app/diary'] },
    { title: 'Saúde', items: ['/app/health', '/app/devices', '/app/exams'] },
    { title: 'Conta', items: ['/app/profile', '/app/notifications', '/app/settings'] },
  ],
  preventive: [
    { title: 'Prevenção', items: ['/app', '/app/exams', '/app/exam-calendar', '/app/preventive'] },
    { title: 'Histórico', items: ['/app/history', '/app/exam-tips', '/app/e-sus', '/app/alerts'] },
    { title: 'Rotina', items: ['/app/reminders', '/app/notifications', '/app/health'] },
    { title: 'Conta', items: ['/app/profile', '/app/settings', '/app/support'] },
  ],
}

const byTo = Object.fromEntries(ALL_LINKS.map((link) => [link.to, link]))

const activeGroups = [
  { title: 'Meu ciclo', items: ['/app', '/app/cycle-calendar', '/app/menstruation', '/app/my-cycle'] },
  { title: 'Saúde', items: ['/app/health', '/app/symptoms', '/app/hormones', '/app/reports', '/app/devices'] },
  { title: 'Cuidados', items: ['/app/reminders', '/app/wellness', '/app/tips', '/app/notifications'] },
  { title: 'Conta', items: ['/app/profile', '/app/settings', '/app/about', '/app/support'] },
]

export function getNavigation() {
  return activeGroups.map((group) => ({
    title: group.title,
    items: group.items.map((to) => byTo[to]).filter(Boolean),
  }))
}

export function getBottomNav() {
  return [
    byTo['/app'],
    byTo['/app/cycle-calendar'],
    byTo['/app/menstruation'],
    byTo['/app/symptoms'],
  ]
}

export function getLink(pathname) {
  return ALL_LINKS.find((link) => link.to === pathname) || byTo['/app']
}
