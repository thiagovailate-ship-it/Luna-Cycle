import { useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { SYMPTOM_OPTIONS } from '../data/seed.js'
import { formatDate, todayISO, uid } from '../lib/date.js'

export function useQuickLog() {
  const { data, updateData, showToast } = useApp()
  const today = todayISO()
  const todayMood = (data.moods || []).find((item) => item.date === today)?.mood || 3

  const toastWithUndo = useCallback((message, undo) => {
    showToast(message, 'success', { label: 'Desfazer', onClick: undo })
  }, [showToast])

  const saveMood = useCallback((mood) => {
    const previous = (data.moods || []).find((item) => item.date === today) || null
    const record = { id: uid('mood'), date: today, mood, source: 'quick' }
    updateData((current) => ({
      moods: [...(current.moods || []).filter((item) => item.date !== today), record],
    }))
    toastWithUndo('Humor de hoje registrado. Você pode mudar quando quiser.', () => {
      updateData((current) => ({
        moods: [
          ...(current.moods || []).filter((item) => item.date !== today && item.id !== record.id),
          ...(previous ? [previous] : []),
        ],
      }))
    })
  }, [data.moods, today, updateData, toastWithUndo])

  const addSymptom = useCallback((type, intensity = 3) => {
    const option = SYMPTOM_OPTIONS.find((item) => item.id === type)
    const record = {
      id: uid('symptom'),
      date: today,
      type,
      label: option?.label || 'Sintoma',
      intensity,
      mood: todayMood,
      notes: 'Registro rápido — ajuste os detalhes quando quiser.',
    }
    updateData((current) => ({ symptoms: [record, ...(current.symptoms || [])] }))
    toastWithUndo(`${record.label} registrado com intensidade moderada.`, () => {
      updateData((current) => ({ symptoms: (current.symptoms || []).filter((item) => item.id !== record.id) }))
    })
  }, [today, todayMood, updateData, toastWithUndo])

  const addWater = useCallback(() => {
    const record = { id: uid('water'), date: today }
    updateData((current) => ({ water: [...(current.water || []), record] }))
    toastWithUndo('Mais um copo de água registrado. Pequenos cuidados contam.', () => {
      updateData((current) => ({ water: (current.water || []).filter((item) => item.id !== record.id) }))
    })
  }, [today, updateData, toastWithUndo])

  const startPeriod = useCallback(() => {
    const previousEntry = (data.cycle?.entries || []).find((item) => item.startDate === today) || null
    const previousFlow = (data.periodDays || []).find((item) => item.date === today) || null
    const cycleRecord = {
      id: previousEntry?.id || uid('cycle'),
      startDate: today,
      duration: data.settings.periodLength || 5,
      flow: 'Moderado',
      notes: 'Iniciado pelo registro rápido.',
    }
    const flowRecord = { id: previousFlow?.id || uid('flow'), date: today, flow: 'Moderado' }

    updateData((current) => ({
      cycle: {
        ...current.cycle,
        entries: [cycleRecord, ...current.cycle.entries.filter((item) => item.startDate !== today)],
      },
      periodDays: [...(current.periodDays || []).filter((item) => item.date !== today), flowRecord],
    }))

    toastWithUndo('Menstruação de hoje registrada. Você pode ajustar o fluxo depois.', () => {
      updateData((current) => ({
        cycle: {
          ...current.cycle,
          entries: [
            ...(previousEntry ? [previousEntry] : []),
            ...current.cycle.entries.filter((item) => item.startDate !== today && item.id !== cycleRecord.id),
          ],
        },
        periodDays: [
          ...(current.periodDays || []).filter((item) => item.date !== today && item.id !== flowRecord.id),
          ...(previousFlow ? [previousFlow] : []),
        ],
      }))
    })
  }, [data.cycle?.entries, data.periodDays, data.settings.periodLength, today, updateData, toastWithUndo])

  const savePeriodFlow = useCallback((date, flow) => {
    const previous = (data.periodDays || []).find((item) => item.date === date) || null
    const record = { id: previous?.id || uid('flow'), date, flow }
    updateData((current) => ({
      periodDays: [...(current.periodDays || []).filter((item) => item.date !== date), record],
    }))
    toastWithUndo(`Fluxo de ${formatDate(date, 'dd/MM')} salvo como ${flow.toLowerCase()}.`, () => {
      updateData((current) => ({
        periodDays: [
          ...(current.periodDays || []).filter((item) => item.date !== date && item.id !== record.id),
          ...(previous ? [previous] : []),
        ],
      }))
    })
  }, [data.periodDays, updateData, toastWithUndo])

  // Mantidos para as telas legadas preservadas no projeto.
  const addBabyMovement = useCallback(() => {
    const record = {
      id: uid('diary'),
      date: today,
      mood: Math.max(3, todayMood),
      title: 'Momento especial',
      text: 'Um lembrete carinhoso dessa fase.',
      tags: ['Memória'],
    }
    updateData((current) => ({ diary: [record, ...(current.diary || [])] }))
    toastWithUndo('Momento guardado no diário.', () => {
      updateData((current) => ({ diary: (current.diary || []).filter((item) => item.id !== record.id) }))
    })
  }, [today, todayMood, updateData, toastWithUndo])

  const completeNextExam = useCallback(() => {
    const next = [...(data.exams || [])]
      .filter((item) => item.status !== 'Realizado' && item.date >= today)
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
    if (!next) {
      showToast('Você não tem exames pendentes. Tudo em dia por aqui.', 'error')
      return
    }
    const previousStatus = next.status
    updateData((current) => ({
      exams: current.exams.map((item) => (item.id === next.id ? { ...item, status: 'Realizado' } : item)),
    }))
    toastWithUndo('Exame marcado como realizado.', () => {
      updateData((current) => ({
        exams: current.exams.map((item) => (item.id === next.id ? { ...item, status: previousStatus } : item)),
      }))
    })
  }, [data.exams, today, updateData, showToast, toastWithUndo])

  return {
    saveMood,
    addSymptom,
    addWater,
    startPeriod,
    savePeriodFlow,
    addBabyMovement,
    completeNextExam,
  }
}
