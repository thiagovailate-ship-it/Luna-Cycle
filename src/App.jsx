import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import AppShell from './components/AppShell.jsx'
import PrivacyLockScreen from './components/PrivacyLockScreen.jsx'
import Welcome from './pages/Welcome.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { CycleCalendarPage, HealthPage, MenstruationPage, MyCyclePage } from './pages/CyclePages.jsx'
import { DevicesPage, HormonesPage, ReportsPage, SymptomsPage } from './pages/HealthPages.jsx'
import { MoreMenuPage, TipsPage, WellnessPage } from './pages/LifestylePages.jsx'
import {
  AboutPage, NotificationsPage, ProfilePage, RemindersPage, SettingsPage, SupportPage,
} from './pages/GeneralPages.jsx'

// Caminhos das jornadas antigas continuam redirecionando para o início.
// Os arquivos dessas telas foram preservados no projeto, mas não fazem parte da navegação ativa.
const hiddenPaths = [
  'calendar', 'baby', 'diary', 'exams', 'exam-calendar', 'preventive', 'history',
  'exam-tips', 'schedule-exam', 'units', 'e-sus', 'alerts',
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.motion === 'reduced'
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [pathname])
  return null
}

function RootRedirect() {
  const { authenticated } = useApp()
  return <Navigate to={authenticated ? '/app' : '/welcome'} replace />
}

function ProtectedLayout() {
  const { authenticated } = useApp()
  const location = useLocation()
  if (!authenticated) return <Navigate to="/welcome" state={{ from: location }} replace />
  return <AppShell />
}

function PublicOnly({ children }) {
  const { authenticated } = useApp()
  return authenticated ? <Navigate to="/app" replace /> : children
}

export default function App() {
  const { authenticated, locked } = useApp()
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/welcome" element={<PublicOnly><Welcome /></PublicOnly>} />
        <Route path="/auth" element={<PublicOnly><Auth /></PublicOnly>} />
        <Route path="/app" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cycle-calendar" element={<CycleCalendarPage />} />
          <Route path="menstruation" element={<MenstruationPage />} />
          <Route path="my-cycle" element={<MyCyclePage />} />
          <Route path="health" element={<HealthPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="hormones" element={<HormonesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="wellness" element={<WellnessPage />} />
          <Route path="tips" element={<TipsPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="more" element={<MoreMenuPage />} />
          {hiddenPaths.map((path) => (
            <Route key={path} path={path} element={<Navigate to="/app" replace />} />
          ))}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
      {authenticated && locked && <PrivacyLockScreen />}
    </>
  )
}
