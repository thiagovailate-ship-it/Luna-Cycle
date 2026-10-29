import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createUser, hashPassword, loadDb, normalizeUserData, saveDb } from './storage.js'
import { createDefaultData, createEmptyData } from '../data/seed.js'

const AppContext = createContext(null)
const LOCK_KEY = 'luna-cycle:locked'
const DEFAULT_ACCESSIBILITY = { highContrast: false, reducedMotion: false, textScale: 1 }
const DEFAULT_PRIVACY = { discreet: false, quickLock: true, autoLock: false, pin: '' }

function readSessionLock() {
  try {
    return window.sessionStorage.getItem(LOCK_KEY) === '1'
  } catch {
    return false
  }
}

export function AppProvider({ children }) {
  const [db, setDb] = useState(() => loadDb())
  const [toast, setToast] = useState(null)
  const [locked, setLocked] = useState(readSessionLock)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)

  useEffect(() => {
    saveDb(db)
  }, [db])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(LOCK_KEY, locked ? '1' : '0')
    } catch {
      // Sessão indisponível: o bloqueio continua funcionando durante a aba atual.
    }
  }, [locked])

  const currentUser = useMemo(
    () => db.users.find((user) => user.id === db.currentUserId) || null,
    [db.users, db.currentUserId],
  )

  const data = currentUser?.data || null
  const phase = 'cycle'
  const accessibility = useMemo(
    () => data?.settings?.accessibility || DEFAULT_ACCESSIBILITY,
    [data?.settings?.accessibility],
  )
  const privacy = useMemo(
    () => data?.settings?.privacy || DEFAULT_PRIVACY,
    [data?.settings?.privacy],
  )
  const discreet = Boolean(privacy.discreet)
  const authenticated = Boolean(currentUser)

  const showToast = useCallback((message, tone = 'success', action = null) => {
    setToast({ id: Date.now(), message, tone, action })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), toast.action ? 5200 : 3400)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contrast = accessibility.highContrast ? 'high' : 'normal'
    root.dataset.motion = accessibility.reducedMotion ? 'reduced' : 'normal'
    root.style.zoom = String(accessibility.textScale || 1)
    document.title = discreet ? 'Meu espaço' : 'Luna Cycle — Seu ciclo, no seu ritmo'
  }, [accessibility.highContrast, accessibility.reducedMotion, accessibility.textScale, discreet])

  const updateData = useCallback((updater) => {
    setDb((previous) => ({
      ...previous,
      users: previous.users.map((user) => {
        if (user.id !== previous.currentUserId) return user
        const nextData = typeof updater === 'function' ? updater(user.data) : updater
        return { ...user, data: { ...user.data, ...nextData } }
      }),
    }))
  }, [])

  const setPhase = useCallback((nextPhase) => {
    updateData((current) => ({
      settings: { ...current.settings, phase: nextPhase },
    }))
  }, [updateData])

  const setDiscreet = useCallback((value) => {
    updateData((current) => ({
      settings: {
        ...current.settings,
        privacy: { ...current.settings.privacy, discreet: value },
      },
    }))
  }, [updateData])

  const setPrivacySetting = useCallback((key, value) => {
    updateData((current) => ({
      settings: {
        ...current.settings,
        privacy: { ...current.settings.privacy, [key]: value },
      },
    }))
  }, [updateData])

  const setAccessibilitySetting = useCallback((key, value) => {
    updateData((current) => ({
      settings: {
        ...current.settings,
        accessibility: { ...current.settings.accessibility, [key]: value },
      },
    }))
  }, [updateData])

  const lockApp = useCallback(() => {
    setQuickActionsOpen(false)
    setLocked(true)
  }, [])

  const unlockApp = useCallback((pin = '') => {
    const expected = data?.settings?.privacy?.pin || ''
    if (expected && String(pin) !== expected) return false
    setLocked(false)
    return true
  }, [data?.settings?.privacy?.pin])

  const openQuickActions = useCallback(() => setQuickActionsOpen(true), [])
  const closeQuickActions = useCallback(() => setQuickActionsOpen(false), [])

  useEffect(() => {
    if (!authenticated || !privacy.autoLock || locked) return undefined
    let timer
    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setLocked(true), 5 * 60 * 1000)
    }
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }))
    reset()
    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [authenticated, privacy.autoLock, locked])

  const login = useCallback((email, password) => {
    const normalized = email.trim().toLowerCase()
    const user = db.users.find((item) => item.email === normalized)
    if (!user || hashPassword(password, user.salt) !== user.passwordHash) {
      return { ok: false, error: 'Não encontramos essa combinação. Vamos tentar de novo?' }
    }
    setDb((previous) => ({ ...previous, currentUserId: user.id }))
    setLocked(false)
    return { ok: true }
  }, [db.users])

  const register = useCallback(({ name, email, password }) => {
    const normalized = email.trim().toLowerCase()
    if (db.users.some((user) => user.email === normalized)) {
      return { ok: false, error: 'Já existe uma conta com esse e-mail. Quer entrar?' }
    }
    const user = createUser({ name, email, password })
    setDb((previous) => ({
      ...previous,
      currentUserId: user.id,
      users: [...previous.users, user],
    }))
    setLocked(false)
    return { ok: true }
  }, [db.users])

  const logout = useCallback(() => {
    setDb((previous) => ({ ...previous, currentUserId: null }))
    setLocked(false)
    setQuickActionsOpen(false)
  }, [])

  const updateProfile = useCallback((patch) => {
    updateData((current) => ({ profile: { ...current.profile, ...patch } }))
  }, [updateData])

  const markAllNotificationsRead = useCallback(() => {
    updateData((current) => ({
      notifications: current.notifications.map((notification) => ({ ...notification, read: true })),
    }))
  }, [updateData])

  const markNotificationRead = useCallback((id) => {
    updateData((current) => ({
      notifications: current.notifications.map((notification) => (
        notification.id === id ? { ...notification, read: true } : notification
      )),
    }))
  }, [updateData])

  const clearNotifications = useCallback(() => {
    updateData(() => ({ notifications: [] }))
  }, [updateData])

  const resetData = useCallback(() => {
    updateData((current) => {
      const fresh = currentUser?.demo
        ? createDefaultData(current.profile.name, current.profile.email, 'cycle')
        : createEmptyData(current.profile.name, current.profile.email)
      return {
        ...fresh,
        settings: {
          ...fresh.settings,
          ...current.settings,
          onboardingComplete: Boolean(currentUser?.demo),
        },
      }
    })
  }, [updateData, currentUser?.demo])

  const importData = useCallback((input) => {
    try {
      const parsed = typeof input === 'string' ? JSON.parse(input) : input
      const payload = parsed.data || parsed
      if (!payload || !payload.profile || !payload.cycle || !Array.isArray(payload.exams)) {
        return { ok: false, error: 'O arquivo não parece ser um backup do Luna Cycle.' }
      }
      updateData(() => normalizeUserData(payload))
      return { ok: true }
    } catch {
      return { ok: false, error: 'Não foi possível ler o arquivo de backup.' }
    }
  }, [updateData])

  const deleteAccount = useCallback(() => {
    setDb((previous) => ({
      ...previous,
      currentUserId: null,
      users: previous.users.filter((user) => user.id !== previous.currentUserId),
    }))
    setLocked(false)
  }, [])

  const value = useMemo(() => ({
    db,
    currentUser,
    data,
    phase,
    authenticated,
    accessibility,
    privacy,
    discreet,
    locked,
    quickActionsOpen,
    toast,
    showToast,
    dismissToast,
    updateData,
    setPhase,
    setDiscreet,
    setPrivacySetting,
    setAccessibilitySetting,
    lockApp,
    unlockApp,
    openQuickActions,
    closeQuickActions,
    login,
    register,
    logout,
    updateProfile,
    markAllNotificationsRead,
    markNotificationRead,
    clearNotifications,
    resetData,
    importData,
    deleteAccount,
  }), [
    db, currentUser, data, phase, authenticated, accessibility, privacy, discreet, locked,
    quickActionsOpen, toast, showToast, dismissToast, updateData, setPhase, setDiscreet,
    setPrivacySetting, setAccessibilitySetting, lockApp, unlockApp, openQuickActions,
    closeQuickActions, login, register, logout, updateProfile, markAllNotificationsRead,
    markNotificationRead, clearNotifications, resetData, importData, deleteAccount,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider')
  return context
}
