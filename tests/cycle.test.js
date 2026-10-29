import test from 'node:test'
import assert from 'node:assert/strict'
import { addDaysISO, todayISO } from '../src/lib/date.js'
import {
  getCycleStats, getCycleInfo, getCycleDay, getDayMeta, getPhaseDefinitions,
  getCurrentPhaseKey, getPredictedPeriodStarts, getCycleIntervalPoints, median, parseCycleSettings,
} from '../src/lib/cycle.js'

function makeData(entries, overrides = {}) {
  return {
    cycle: { entries },
    settings: { cycleLength: 28, periodLength: 5, cycleRegularity: 'regular', ...overrides },
    symptoms: [],
    reminders: [],
    exams: [],
    appointments: [],
  }
}

function entry(startDate, duration = 5) {
  return { id: startDate, startDate, duration, flow: 'Moderado' }
}

test('median handles odd and even samples', () => {
  assert.equal(median([28, 30, 29]), 29)
  assert.equal(median([27, 29, 30, 32]), 29.5)
  assert.equal(median([]), 0)
})

test('cycle settings accept typed durations within range', () => {
  assert.deepEqual(parseCycleSettings({ cycleLength: '31', periodLength: '6' }), {
    ok: true, cycleLength: 31, periodLength: 6,
  })
  assert.equal(parseCycleSettings({ cycleLength: '90', periodLength: '14' }).ok, true)
})

test('cycle settings reject missing, out-of-range and inconsistent durations', () => {
  assert.deepEqual(parseCycleSettings({ cycleLength: '', periodLength: '5' }), {
    ok: false, field: 'cycleLength', error: 'Informe a duração do ciclo entre 15 e 90 dias.',
  })
  assert.equal(parseCycleSettings({ cycleLength: '91', periodLength: '5' }).field, 'cycleLength')
  assert.equal(parseCycleSettings({ cycleLength: '28', periodLength: '0' }).field, 'periodLength')
  assert.equal(parseCycleSettings({ cycleLength: '28', periodLength: '15' }).field, 'periodLength')
  assert.equal(parseCycleSettings({ cycleLength: '28.5', periodLength: '5' }).ok, false)
})

test('cycle stats use the median of recent intervals', () => {
  const today = todayISO()
  const data = makeData([
    entry(addDaysISO(today, -120)),
    entry(addDaysISO(today, -90)),
    entry(addDaysISO(today, -60)),
    entry(addDaysISO(today, -30)),
    entry(addDaysISO(today, -1)),
  ])
  const stats = getCycleStats(data)
  assert.equal(stats.source, 'history')
  assert.equal(stats.length, 30)
  assert.equal(stats.count, 4)
  assert.equal(stats.confidence, 'alta')
})

test('cycle stats fall back to configured length without intervals', () => {
  const stats = getCycleStats(makeData([entry(todayISO())], { cycleLength: 31 }))
  assert.equal(stats.source, 'configured')
  assert.equal(stats.length, 31)
  assert.equal(stats.confidence, 'baixa')
})

test('fertile window ends on ovulation day and never includes days after it', () => {
  const today = todayISO()
  const data = makeData([entry(addDaysISO(today, -9))])
  const info = getCycleInfo(data, today)
  assert.equal(info.ovulationDay, 14)
  assert.equal(info.fertileStart, 10)
  assert.equal(info.fertileEnd, 14)
  assert.equal(info.day, 10)
  assert.equal(info.isFertile, true)
  assert.equal(info.phaseName, 'Fase folicular')

  const after = getCycleInfo(data, addDaysISO(today, 5))
  assert.equal(after.day, 15)
  assert.equal(after.isFertile, false)
  assert.equal(after.phaseName, 'Fase lútea')
})

test('ovulation day is named ovulação, not fase fértil', () => {
  const today = todayISO()
  const data = makeData([entry(addDaysISO(today, -13))])
  const info = getCycleInfo(data, today)
  assert.equal(info.day, 14)
  assert.equal(info.isFertile, true)
  assert.equal(info.phaseName, 'Ovulação')
})

test('cycle day keeps counting when the period is late instead of wrapping to day 1', () => {
  const today = todayISO()
  const data = makeData([entry(addDaysISO(today, -31))])
  const info = getCycleInfo(data, today)
  assert.equal(info.day, 32)
  assert.equal(info.length, 28)
  assert.equal(info.isLate, true)
  assert.equal(info.daysLate, 3)
  assert.equal(info.daysToNext, 0)
  assert.equal(info.phaseName, 'Fase lútea')
  assert.equal(info.progress, 1)
})

test('prediction range widens with cycle variability', () => {
  const today = todayISO()
  const data = makeData([
    entry(addDaysISO(today, -125)),
    entry(addDaysISO(today, -95)),
    entry(addDaysISO(today, -64)),
    entry(addDaysISO(today, -31)),
    entry(addDaysISO(today, -1)),
  ])
  const info = getCycleInfo(data, today)
  assert.equal(info.length, 31)
  assert.ok(info.predictionStart < info.nextPeriod)
  assert.ok(info.predictionEnd > info.nextPeriod)
})

test('phase definitions cover the cycle without overlapping', () => {
  const info = getCycleInfo(makeData([entry(todayISO())]), todayISO())
  const phases = getPhaseDefinitions(info)
  assert.deepEqual(phases.map((phase) => phase.key), ['menstruation', 'follicular', 'ovulation', 'luteal'])
  assert.equal(phases[0].range, 'Dias 1–5')
  assert.equal(phases[3].endDay, info.length)
  assert.equal(getCurrentPhaseKey(info), 'menstruation')
})

test('future calendar dates project phases into predicted cycles', () => {
  const today = todayISO()
  const data = makeData([entry(addDaysISO(today, -1))])
  const future = addDaysISO(today, 40)
  const meta = getDayMeta(data, future)
  assert.equal(meta.isOvulation, true)
  assert.equal(getCycleDay(data, future), 42)
})

test('predicted period starts continue from the last recorded cycle', () => {
  const today = todayISO()
  const start = addDaysISO(today, -10)
  const data = makeData([entry(start)])
  const starts = getPredictedPeriodStarts(data, today, 3)
  assert.deepEqual(starts, [addDaysISO(start, 28), addDaysISO(start, 56), addDaysISO(start, 84)])
})

test('interval points expose the newer cycle date for chart labels', () => {
  const today = todayISO()
  const lastStart = addDaysISO(today, -30)
  const data = makeData([
    entry(addDaysISO(today, -90)),
    entry(addDaysISO(today, -60)),
    entry(lastStart),
  ])
  assert.deepEqual(getCycleIntervalPoints(data), [
    { date: addDaysISO(today, -60), days: 30 },
    { date: lastStart, days: 30 },
  ])
})
