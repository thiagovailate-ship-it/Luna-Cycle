import { useEffect } from 'react'
import { todayISO } from '../lib/date.js'

const STORAGE_KEY = 'luna-cycle:notified-reminders'
const WINDOW_MINUTES = 10

function readNotified() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function persistNotified(map) {
  try {
    const recent = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 60)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(recent)))
  } catch {
    // Sem storage, a deduplicação apenas não persiste.
  }
}

function minutesSinceMidnight() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function parseTime(value) {
  const [hours, minutes] = String(value || '').split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

async function showAlert({ title, body, tag, url, icon }) {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration?.() || null
    if (registration?.showNotification) {
      await registration.showNotification(title, { body, tag, icon, badge: icon, data: { url } })
      return
    }
  }
  const notification = new Notification(title, { body, tag, icon })
  notification.onclick = () => {
    window.focus()
    window.location.hash = url
  }
}

export function useReminderAlerts({ data, enabled, discreet, userId }) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('Notification' in window)) return undefined
    if (Notification.permission !== 'granted') return undefined

    const check = () => {
      if (Notification.permission !== 'granted') return
      const now = minutesSinceMidnight()
      const date = todayISO()
      const reminded = readNotified()
      const pending = (data.reminders || []).filter((item) => {
        if (!item.active || item.done || item.date !== date) return false
        const due = parseTime(item.time)
        if (due === null) return false
        if (now < due || now - due > WINDOW_MINUTES) return false
        const key = `${userId || 'local'}:${item.id}:${item.date}:${item.time}`
        return !reminded[key]
      })
      pending.forEach((item) => {
        const key = `${userId || 'local'}:${item.id}:${item.date}:${item.time}`
        reminded[key] = Date.now()
        persistNotified(reminded)
        const icon = `${window.location.origin}${import.meta.env.BASE_URL}icons/icon-192.png`
        showAlert({
          title: 'Luna Cycle',
          body: discreet ? 'Você tem um lembrete esperando por você.' : `${item.title} · ${item.category}`,
          tag: key,
          icon,
          url: '#/app/reminders',
        }).catch(() => {
          delete reminded[key]
          persistNotified(reminded)
        })
      })
    }

    check()
    const timer = window.setInterval(check, 30000)
    return () => window.clearInterval(timer)
  }, [data.reminders, enabled, discreet, userId])
}
