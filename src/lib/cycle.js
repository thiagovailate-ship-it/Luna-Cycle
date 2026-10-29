import { addDaysISO, daysBetween, toISO, todayISO } from './date.js'

const LUTEAL_PHASE_DAYS = 14
const MIN_OVULATION_DAY = 10
const FERTILE_DAYS_BEFORE_OVULATION = 4
const DEFAULT_PERIOD_LENGTH = 5
const HISTORY_SAMPLE = 6

export const CYCLE_LENGTH_LIMITS = Object.freeze({ min: 15, max: 90 })
export const PERIOD_LENGTH_LIMITS = Object.freeze({ min: 1, max: 14 })

export function parseCycleSettings(values = {}) {
  const cycleLength = Number(values.cycleLength)
  const periodLength = Number(values.periodLength)
  if (!Number.isInteger(cycleLength) || cycleLength < CYCLE_LENGTH_LIMITS.min || cycleLength > CYCLE_LENGTH_LIMITS.max) {
    return {
      ok: false,
      field: 'cycleLength',
      error: `Informe a duração do ciclo entre ${CYCLE_LENGTH_LIMITS.min} e ${CYCLE_LENGTH_LIMITS.max} dias.`,
    }
  }
  if (!Number.isInteger(periodLength) || periodLength < PERIOD_LENGTH_LIMITS.min || periodLength > PERIOD_LENGTH_LIMITS.max) {
    return {
      ok: false,
      field: 'periodLength',
      error: `Informe a duração da menstruação entre ${PERIOD_LENGTH_LIMITS.min} e ${PERIOD_LENGTH_LIMITS.max} dias.`,
    }
  }
  return { ok: true, cycleLength, periodLength }
}

export function sortedCycleEntries(data) {
  return [...(data.cycle?.entries || [])].sort((a, b) => b.startDate.localeCompare(a.startDate))
}

function ascendingCycleEntries(data) {
  return [...(data.cycle?.entries || [])]
    .filter((entry) => entry?.startDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .filter((entry, index, entries) => index === 0 || entry.startDate !== entries[index - 1].startDate)
}

export function getCycleIntervalPoints(data, sample = HISTORY_SAMPLE) {
  const entries = ascendingCycleEntries(data)
  const points = []
  for (let index = 1; index < entries.length; index += 1) {
    const days = daysBetween(entries[index].startDate, entries[index - 1].startDate)
    if (days > 14 && days < 90) points.push({ date: entries[index].startDate, days })
  }
  return points.slice(-sample)
}

export function getCycleIntervals(data, sample = HISTORY_SAMPLE) {
  return getCycleIntervalPoints(data, sample).map((point) => point.days)
}

export function median(values = []) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

export function getCycleStats(data) {
  const configured = Number(data.settings?.cycleLength) || 28
  const intervals = getCycleIntervals(data)
  const usesHistory = intervals.length >= 1
  const length = usesHistory ? Math.round(median(intervals)) : configured
  const min = intervals.length ? Math.min(...intervals) : length
  const max = intervals.length ? Math.max(...intervals) : length
  const spread = usesHistory ? Math.max(0, Math.round((max - min) / 2)) : 0
  const irregular = data.settings?.cycleRegularity === 'irregular'
  const rangeDays = irregular ? Math.max(2, spread) : spread
  let confidence = 'baixa'
  if (usesHistory && intervals.length >= 3 && spread <= 1) confidence = 'alta'
  else if (usesHistory && intervals.length >= 2 && spread <= 3) confidence = 'média'

  return {
    length,
    configured,
    min,
    max,
    spread,
    rangeDays,
    intervals,
    count: intervals.length,
    source: usesHistory ? 'history' : 'configured',
    irregular,
    confidence,
  }
}

export function getCurrentCycle(data, date = todayISO()) {
  return sortedCycleEntries(data).find((entry) => entry.startDate <= toISO(date)) || null
}

export function getCycleDay(data, date = todayISO()) {
  const current = getCurrentCycle(data, date)
  if (!current) return 0
  return Math.max(1, daysBetween(date, current.startDate) + 1)
}

function getPhaseDay(data, date, length) {
  const actualDay = getCycleDay(data, date)
  if (!actualDay) return 0
  if (actualDay <= length) return actualDay
  if (toISO(date) <= todayISO()) return length
  return ((actualDay - 1) % length) + 1
}

export function formatDayRange(start, end) {
  if (!start && !end) return '—'
  if (start === end) return `Dia ${start}`
  return `Dias ${start}–${end}`
}

export function getCycleInfo(data, date = todayISO()) {
  const stats = getCycleStats(data)
  const length = stats.length
  const periodLength = Number(data.settings?.periodLength) || DEFAULT_PERIOD_LENGTH
  const current = getCurrentCycle(data, date)
  const target = toISO(date)
  const day = current ? Math.max(1, daysBetween(target, current.startDate) + 1) : 0
  const nextPeriod = current ? addDaysISO(current.startDate, length) : addDaysISO(target, length)
  const isLate = Boolean(current) && nextPeriod < target
  const daysLate = isLate ? daysBetween(target, nextPeriod) : 0
  const daysToNext = isLate ? 0 : daysBetween(nextPeriod, target)
  const ovulationDay = Math.max(MIN_OVULATION_DAY, length - LUTEAL_PHASE_DAYS)
  const daysToOvulation = ovulationDay - day
  const ovulationPassed = day > ovulationDay
  const fertileStart = Math.max(1, ovulationDay - FERTILE_DAYS_BEFORE_OVULATION)
  const fertileEnd = ovulationDay
  const isFertile = day >= fertileStart && day <= fertileEnd
  const rangeDays = stats.rangeDays
  let phaseName = 'Sem registro'
  if (day > 0 && day <= periodLength) phaseName = 'Menstruação'
  else if (day === ovulationDay) phaseName = 'Ovulação'
  else if (day > 0 && day < ovulationDay) phaseName = 'Fase folicular'
  else if (day > ovulationDay) phaseName = 'Fase lútea'

  return {
    current,
    length,
    configuredLength: stats.configured,
    periodLength,
    day,
    nextPeriod,
    predictionStart: addDaysISO(nextPeriod, -rangeDays),
    predictionEnd: addDaysISO(nextPeriod, rangeDays),
    daysToNext,
    isLate,
    daysLate,
    ovulationDay,
    daysToOvulation,
    ovulationPassed,
    fertileStart,
    fertileEnd,
    isFertile,
    phaseName,
    progress: length ? Math.min(1, day / length) : 0,
    stats,
    confidence: stats.confidence,
    cycleSource: stats.source,
    cycleCount: stats.count,
  }
}

export function getPhaseDefinitions(info) {
  const periodLength = info.periodLength || DEFAULT_PERIOD_LENGTH
  const ovulationDay = info.ovulationDay
  const length = info.length
  const phases = [
    { key: 'menstruation', label: 'Menstruação', startDay: 1, endDay: periodLength },
    { key: 'follicular', label: 'Fase folicular', startDay: periodLength + 1, endDay: Math.max(periodLength + 1, ovulationDay - 1) },
    { key: 'ovulation', label: 'Ovulação', startDay: ovulationDay, endDay: ovulationDay },
    { key: 'luteal', label: 'Fase lútea', startDay: Math.min(ovulationDay + 1, length), endDay: length },
  ]
  return phases.map((phase) => ({ ...phase, range: formatDayRange(phase.startDay, phase.endDay) }))
}

export function getCurrentPhaseKey(info, periodLength = info.periodLength || DEFAULT_PERIOD_LENGTH) {
  if (!info.day) return null
  if (info.day <= periodLength) return 'menstruation'
  if (info.day === info.ovulationDay) return 'ovulation'
  if (info.day < info.ovulationDay) return 'follicular'
  return 'luteal'
}

export function getPredictedPeriodStarts(data, date = todayISO(), count = 18) {
  const base = getCurrentCycle(data, date)
  if (!base) return []
  const { length } = getCycleStats(data)
  return Array.from({ length: count }).map((_, index) => addDaysISO(base.startDate, length * (index + 1)))
}

export function getActivePeriod(data, date = todayISO()) {
  const target = toISO(date)
  const entry = sortedCycleEntries(data).find((item) => {
    const diff = daysBetween(target, item.startDate)
    return diff >= 0 && diff < (item.duration || data.settings?.periodLength || DEFAULT_PERIOD_LENGTH)
  })
  if (!entry) return null
  return { ...entry, day: daysBetween(target, entry.startDate) + 1 }
}

export function isPeriodDay(data, date) {
  const target = toISO(date)
  return (data.cycle?.entries || []).some((entry) => {
    const diff = daysBetween(target, entry.startDate)
    return diff >= 0 && diff < (entry.duration || data.settings?.periodLength || DEFAULT_PERIOD_LENGTH)
  })
}

export function isPredictedPeriodDay(data, date) {
  const target = toISO(date)
  const periodLength = data.settings?.periodLength || DEFAULT_PERIOD_LENGTH
  return getPredictedPeriodStarts(data, target).some((start) => {
    const diff = daysBetween(target, start)
    return diff >= 0 && diff < periodLength
  })
}

export function getDayMeta(data, date) {
  const target = toISO(date)
  const info = getCycleInfo(data, target)
  const cycleDay = getCycleDay(data, target)
  const phaseDay = getPhaseDay(data, target, info.length)
  return {
    date: target,
    isToday: target === todayISO(),
    isPeriod: isPeriodDay(data, target),
    isPredictedPeriod: isPredictedPeriodDay(data, target),
    isFertile: phaseDay >= info.fertileStart && phaseDay <= info.fertileEnd,
    isOvulation: phaseDay === info.ovulationDay,
    isLate: info.isLate,
    hasSymptom: (data.symptoms || []).some((item) => item.date === target),
    hasReminder: (data.reminders || []).some((item) => item.date === target && item.active),
    hasExam: (data.exams || []).some((item) => item.date === target),
    hasAppointment: (data.appointments || []).some((item) => item.date === target),
    cycleDay,
    phaseDay,
  }
}

export function getPregnancyInfo(data, date = todayISO()) {
  const start = data.pregnancy?.startDate || addDaysISO(date, -140)
  const day = Math.max(1, daysBetween(date, start) + 1)
  const week = Math.min(42, Math.floor((day - 1) / 7) + 1)
  const days = ((day - 1) % 7)
  const progress = Math.min(100, Math.round((day / 280) * 100))
  const sizeCm = Math.min(50, 8 + week * 0.8)
  const weightG = Math.max(20, Math.round((week - 10) ** 3 * 0.7))
  let trimester = 1
  if (week >= 14) trimester = 2
  if (week >= 28) trimester = 3
  return { day, week, days, progress, sizeCm, weightG, trimester, dueDate: data.pregnancy?.dueDate || addDaysISO(start, 280) }
}

export function getHormoneSeries(phase = 'cycle') {
  const points = 24
  return Array.from({ length: points }).map((_, index) => {
    const x = index / (points - 1)
    const estrogen = phase === 'menopause' ? 82 - x * 67 + Math.sin(x * Math.PI) * 12 : 35 + Math.sin(x * Math.PI * 1.7) * 28
    const progesterone = phase === 'menopause' ? 62 - x * 48 + Math.sin(x * Math.PI * 2) * 8 : 20 + Math.max(0, Math.sin((x - 0.35) * Math.PI)) * 55
    const fsh = phase === 'menopause' ? 25 + x * 57 + Math.cos(x * Math.PI) * 5 : 30 + Math.sin(x * Math.PI * 2.2) * 18
    return { x, estrogen, progesterone, fsh }
  })
}

export function buildPath(values, width = 300, height = 120) {
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - (value / 100) * height
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
}

export function getSymptomStats(data) {
  const counts = {}
  ;(data.symptoms || []).forEach((item) => {
    const key = item.label || item.type
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export function average(values) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length
}
