import { addDaysISO, daysBetween, toISO, todayISO } from './date.js'

export function sortedCycleEntries(data) {
  return [...(data.cycle?.entries || [])].sort((a, b) => b.startDate.localeCompare(a.startDate))
}

export function getCurrentCycle(data, date = todayISO()) {
  return sortedCycleEntries(data).find((entry) => entry.startDate <= toISO(date)) || null
}

export function getCycleDay(data, date = todayISO()) {
  const current = getCurrentCycle(data, date)
  const length = data.settings?.cycleLength || 28
  if (!current) return 1
  const diff = daysBetween(date, current.startDate)
  return ((diff % length) + length) % length + 1
}

export function getCycleInfo(data, date = todayISO()) {
  const current = getCurrentCycle(data, date)
  const length = data.settings?.cycleLength || 28
  const day = getCycleDay(data, date)
  const nextPeriod = current ? addDaysISO(current.startDate, length) : addDaysISO(date, length)
  const nextPeriodAdjusted = nextPeriod < toISO(date) ? addDaysISO(nextPeriod, length) : nextPeriod
  const daysToNext = Math.max(0, daysBetween(nextPeriodAdjusted, date))
  const ovulationDay = Math.max(10, length - 14)
  const daysToOvulation = Math.max(0, ovulationDay - day)
  const fertileStart = Math.max(1, ovulationDay - 2)
  const fertileEnd = Math.min(length, ovulationDay + 2)
  let phaseName = 'Fase folicular'
  if (day <= (data.settings?.periodLength || 5)) phaseName = 'Menstruação'
  else if (day >= fertileStart && day <= fertileEnd) phaseName = 'Fase fértil'
  else if (day === ovulationDay) phaseName = 'Ovulação'
  else if (day > ovulationDay) phaseName = 'Fase lútea'
  return {
    current,
    length,
    day,
    nextPeriod: nextPeriodAdjusted,
    daysToNext,
    ovulationDay,
    daysToOvulation,
    fertileStart,
    fertileEnd,
    phaseName,
    progress: day / length,
  }
}

export function getActivePeriod(data, date = todayISO()) {
  const target = toISO(date)
  const entry = sortedCycleEntries(data).find((item) => {
    const diff = daysBetween(target, item.startDate)
    return diff >= 0 && diff < (item.duration || data.settings?.periodLength || 5)
  })
  if (!entry) return null
  return { ...entry, day: daysBetween(target, entry.startDate) + 1 }
}

export function isPeriodDay(data, date) {
  const target = toISO(date)
  return (data.cycle?.entries || []).some((entry) => {
    const diff = daysBetween(target, entry.startDate)
    return diff >= 0 && diff < (entry.duration || data.settings?.periodLength || 5)
  })
}

export function isPredictedPeriodDay(data, date) {
  const info = getCycleInfo(data)
  const target = toISO(date)
  const starts = [info.nextPeriod, addDaysISO(info.nextPeriod, info.length), addDaysISO(info.nextPeriod, -info.length)]
  return starts.some((start) => {
    const diff = daysBetween(target, start)
    return diff >= 0 && diff < (data.settings?.periodLength || 5)
  })
}

export function getDayMeta(data, date) {
  const target = toISO(date)
  const info = getCycleInfo(data, target)
  const cycleDay = getCycleDay(data, target)
  return {
    date: target,
    isToday: target === todayISO(),
    isPeriod: isPeriodDay(data, target),
    isPredictedPeriod: isPredictedPeriodDay(data, target),
    isFertile: cycleDay >= info.fertileStart && cycleDay <= info.fertileEnd,
    isOvulation: cycleDay === info.ovulationDay,
    hasSymptom: (data.symptoms || []).some((item) => item.date === target),
    hasReminder: (data.reminders || []).some((item) => item.date === target && item.active),
    hasExam: (data.exams || []).some((item) => item.date === target),
    hasAppointment: (data.appointments || []).some((item) => item.date === target),
    cycleDay,
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
