import { createDefaultData, createEmptyData } from '../data/seed.js'
import { uid } from '../lib/date.js'

export const STORAGE_KEY = 'luna-cycle:database:v1'

export function hashPassword(password, salt) {
  const value = `${salt}::${password}`
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < value.length; i += 1) {
    const ch = value.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return `${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`
}

export function normalizeUserData(rawData = {}) {
  const defaults = createDefaultData(
    rawData?.profile?.name || 'Você',
    rawData?.profile?.email || 'voce@email.com',
    rawData?.settings?.phase || 'cycle',
  )
  const settings = rawData?.settings || {}
  return {
    ...defaults,
    ...rawData,
    profile: { ...defaults.profile, ...(rawData?.profile || {}) },
    settings: {
      ...defaults.settings,
      ...settings,
      phase: 'cycle',
      notifications: { ...defaults.settings.notifications, ...(settings.notifications || {}) },
      privacy: { ...defaults.settings.privacy, ...(settings.privacy || {}) },
      accessibility: { ...defaults.settings.accessibility, ...(settings.accessibility || {}) },
    },
    cycle: { ...defaults.cycle, ...(rawData?.cycle || {}) },
    periodDays: Array.isArray(rawData?.periodDays) ? rawData.periodDays : defaults.periodDays,
    devices: { ...defaults.devices, ...(rawData?.devices || {}) },
    pregnancy: { ...defaults.pregnancy, ...(rawData?.pregnancy || {}) },
    menopause: { ...defaults.menopause, ...(rawData?.menopause || {}) },
    moods: Array.isArray(rawData?.moods) ? rawData.moods : defaults.moods,
    water: Array.isArray(rawData?.water) ? rawData.water : defaults.water,
    symptoms: Array.isArray(rawData?.symptoms) ? rawData.symptoms : defaults.symptoms,
    vitals: Array.isArray(rawData?.vitals) ? rawData.vitals : defaults.vitals,
    reminders: Array.isArray(rawData?.reminders) ? rawData.reminders : defaults.reminders,
    exams: Array.isArray(rawData?.exams) ? rawData.exams : defaults.exams,
    appointments: Array.isArray(rawData?.appointments) ? rawData.appointments : defaults.appointments,
    diary: Array.isArray(rawData?.diary) ? rawData.diary : defaults.diary,
    notifications: Array.isArray(rawData?.notifications) ? rawData.notifications : defaults.notifications,
    favorites: Array.isArray(rawData?.favorites) ? rawData.favorites : defaults.favorites,
  }
}

function createDemoUser() {
  const salt = 'luna-demo-salt'
  return {
    id: 'user-demo',
    name: 'Luciene Oliveira',
    email: 'demo@lunacycle.app',
    salt,
    passwordHash: hashPassword('luna123', salt),
    demo: true,
    createdAt: new Date().toISOString(),
    data: normalizeUserData(createDefaultData('Luciene Oliveira', 'demo@lunacycle.app', 'cycle')),
  }
}

export function createInitialDb() {
  return {
    version: 1,
    currentUserId: null,
    users: [createDemoUser()],
  }
}

export function loadDb() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return createInitialDb()
    const parsed = JSON.parse(stored)
    if (!parsed || !Array.isArray(parsed.users)) return createInitialDb()
    const migrated = {
      ...parsed,
      version: 1,
      currentUserId: parsed.users.some((user) => user.id === parsed.currentUserId) ? parsed.currentUserId : null,
      users: parsed.users.map((user) => ({ ...user, data: normalizeUserData(user.data) })),
    }
    if (parsed.version !== 1) saveDb(migrated)
    return migrated
  } catch {
    return createInitialDb()
  }
}

export function saveDb(db) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (error) {
    console.warn('Não foi possível salvar os dados localmente.', error)
  }
}

export function createUser({ name, email, password }) {
  const salt = uid('salt')
  const cleanName = name.trim()
  const cleanEmail = email.trim().toLowerCase()
  return {
    id: uid('user'),
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash: hashPassword(password, salt),
    demo: false,
    createdAt: new Date().toISOString(),
    data: normalizeUserData(createEmptyData(cleanName, cleanEmail)),
  }
}
