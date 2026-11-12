import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PRIVACY_VERSION } from './data/legal.js'
import { useApp } from './context/AppContext.jsx'
import AppShell from './components/AppShell.jsx'
import PrivacyLockScreen from './components/PrivacyLockScreen.jsx'
import Welcome from './pages/Welcome.jsx'
import Auth from './pages/Auth.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LegalPage, { PublicLegalPage, LegalContent } from './pages/LegalPage.jsx'
import { CycleCalendarPage, HealthPage, MenstruationPage, MyCyclePage } from './pages/CyclePages.jsx'
import { DevicesPage, HormonesPage, ReportsPage, SymptomsPage } from './pages/HealthPages.jsx'
import { MoreMenuPage, BabyPage, DiaryPage, PregnancyCalendarPage, TipsPage, WellnessPage } from './pages/LifestylePages.jsx'
import {
  AboutPage, NotificationsPage, ProfilePage, RemindersPage, SettingsPage, SupportPage,
} from './pages/GeneralPages.jsx'
import { Card } from './components/ui.jsx'

// Caminhos das jornadas antigas continuam redirecionando para o início.
// Os arquivos dessas telas foram preservados no projeto, mas não fazem parte da navegação ativa.
const hiddenPaths = [
  'exams', 'exam-calendar', 'preventive', 'history',
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
  const { authenticated, data } = useApp()
  const location = useLocation()
  if (!authenticated) return <Navigate to="/welcome" state={{ from: location }} replace />
  if (data?.settings?.onboardingComplete === false) return <Navigate to="/onboarding" replace />
  return <AppShell />
}

function OnboardingOnly({ children }) {
  const { authenticated, data } = useApp()
  if (!authenticated) return <Navigate to="/welcome" replace />
  if (data?.settings?.onboardingComplete !== false) return <Navigate to="/app" replace />
  return children
}

function PublicOnly({ children }) {
  const { authenticated } = useApp()
  return authenticated ? <Navigate to="/app" replace /> : children
}

function PregnancyOnly({ children }) {
  const { phase } = useApp()
  return phase === 'pregnancy' ? children : <Navigate to="/app" replace />
}

function ConsentGate() {
  const { acceptPrivacy, logout } = useApp()
  const accept = () => acceptPrivacy(PRIVACY_VERSION)
  return (
    <div className="consent-gate">
      <div className="consent-gate-inner">
        <div className="consent-gate-header">
          <h1>Privacidade e consentimento</h1>
          <p>
            Para continuar usando o Luna Cycle, leia e aceite a Política de Privacidade e os Termos de Uso. Seus dados
            permanecem salvos apenas neste dispositivo.
          </p>
        </div>
        <LegalContent initialTab="privacy" />
        <Card className="consent-gate-actions">
          <p className="muted small" style={{ margin: 0 }}>
            Ao aceitar, você confirma que leu as informações acima e concorda com o tratamento local dos seus dados para
            as finalidades descritas.
          </p>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="button button-primary" onClick={accept}>Li e aceito</button>
            <button type="button" className="button button-secondary" onClick={logout}>Sair da conta</button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function App() {
  const { authenticated, locked, data } = useApp()
  const needsConsent = authenticated
    && data?.settings?.onboardingComplete !== false
    && data?.settings?.consent?.accepted !== true
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/welcome" element={<PublicOnly><Welcome /></PublicOnly>} />
        <Route path="/auth" element={<PublicOnly><Auth /></PublicOnly>} />
        <Route path="/privacy" element={<PublicLegalPage key="privacy" initialTab="privacy" />} />
        <Route path="/terms" element={<PublicLegalPage key="terms" initialTab="terms" />} />
        <Route path="/onboarding" element={<OnboardingOnly><Onboarding /></OnboardingOnly>} />
        <Route path="/app" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cycle-calendar" element={<CycleCalendarPage />} />
          <Route path="menstruation" element={<MenstruationPage />} />
          <Route path="my-cycle" element={<MyCyclePage />} />
          <Route path="calendar" element={<PregnancyOnly><PregnancyCalendarPage /></PregnancyOnly>} />
          <Route path="baby" element={<PregnancyOnly><BabyPage /></PregnancyOnly>} />
          <Route path="diary" element={<PregnancyOnly><DiaryPage /></PregnancyOnly>} />
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
          <Route path="privacy" element={<LegalPage />} />
          <Route path="more" element={<MoreMenuPage />} />
          {hiddenPaths.map((path) => (
            <Route key={path} path={path} element={<Navigate to="/app" replace />} />
          ))}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
      {needsConsent && <ConsentGate />}
      {authenticated && locked && !needsConsent && <PrivacyLockScreen />}
    </>
  )
}
