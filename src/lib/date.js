import { addDays, format, parseISO, differenceInCalendarDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
export const MOODS = [
  { value: 1, label: 'Muito mal', short: 'Muito mal', emoji: '😔', tone: 'rose' },
  { value: 2, label: 'Mal', short: 'Mal', emoji: '🙁', tone: 'peach' },
  { value: 3, label: 'Neutro', short: 'Neutro', emoji: '😐', tone: 'yellow' },
  { value: 4, label: 'Bem', short: 'Bem', emoji: '🙂', tone: 'green' },
  { value: 5, label: 'Muito bem', short: 'Ótimo', emoji: '😄', tone: 'green' },
]

export const toISO = (date) => {
  if (date instanceof Date) return format(date, 'yyyy-MM-dd')
  if (typeof date === 'string') return date.slice(0, 10)
  return format(new Date(), 'yyyy-MM-dd')
}

export const parseDate = (value) => (value ? parseISO(toISO(value)) : new Date())
export const todayISO = () => format(new Date(), 'yyyy-MM-dd')
export const addDaysISO = (value, amount) => format(addDays(parseDate(value), amount), 'yyyy-MM-dd')
export const daysBetween = (a, b) => differenceInCalendarDays(parseDate(a), parseDate(b))

export const formatDate = (value, pattern = "dd 'de' MMMM 'de' yyyy") =>
  format(parseDate(value), pattern, { locale: ptBR })

export const formatShort = (value) => format(parseDate(value), 'dd/MM', { locale: ptBR })
export const formatTime = (value = '08:00') => value?.slice(0, 5) || '08:00'
export const monthLabel = (value) => {
  const label = format(parseDate(value), 'MMMM yyyy', { locale: ptBR })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const getCalendarGrid = (monthDate) => {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 })
  const days = []
  let cursor = start
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor = addDays(cursor, 1)
  }
  return days
}

export const relativeLabel = (value) => {
  const diff = differenceInCalendarDays(parseDate(value), new Date())
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  if (diff === -1) return 'Ontem'
  if (diff > 1 && diff <= 7) return `Em ${diff} dias`
  if (diff < -1 && diff >= -7) return `Há ${Math.abs(diff)} dias`
  return formatDate(value, 'dd/MM/yyyy')
}

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
