import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Command, Eye, EyeOff, LockKeyhole, Menu, Search, Settings2, ShieldCheck, X,
} from 'lucide-react'
import { ACTIVE_PHASE } from '../data/seed.js'
import { ALL_LINKS, getBottomNav, getLink, getNavigation } from '../data/navigation.js'
import { getCycleInfo } from '../lib/cycle.js'
import { relativeLabel } from '../lib/date.js'
import { useApp } from '../context/AppContext.jsx'
import { useReminderAlerts } from '../hooks/useReminderAlerts.js'
import { Avatar, Icon, Logo, Modal } from './ui.jsx'
import { AppIcon } from './AppIcon.jsx'
import { CycleOrbitArt } from './CycleArt.jsx'
import { QuickActionFab, QuickActionsPanel } from './QuickActions.jsx'

function isTypingTarget(target) {
  if (!target) return false
  const tag = target.tagName
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || target.isContentEditable
}

function JourneyCard() {
  const { data, discreet } = useApp()
  const info = getCycleInfo(data)
  return (
    <div className="journey-card">
      <CycleOrbitArt className="journey-card-orbit" size={118} />
      <div className="journey-card-content">
        <div className="journey-card-head">
          <span className="icon-circle icon-rose"><AppIcon name="cycle" size={20} /></span>
          <div>
            <span>Agora</span>
            <strong>Ciclo menstrual</strong>
          </div>
        </div>
        <div className="journey-card-progress"><span style={{ width: `${Math.max(4, Math.round(info.progress * 100))}%` }} /></div>
        <div className="journey-card-meta">
          <span>{!info.day ? 'Sem registro' : info.isLate ? `Dia ${info.day} · atrasada` : `Dia ${info.day} de ${info.length}`}</span>
          <span data-sensitive>{discreet ? 'Acompanhamento' : info.phaseName}</span>
        </div>
        <Link to="/app/my-cycle" className="journey-card-link">Ver meu ciclo <Icon name="ArrowUpRight" size={14} /></Link>
      </div>
    </div>
  )
}

function PrivacyMenu({ open, onClose }) {
  const { discreet, setDiscreet, lockApp, privacy } = useApp()
  if (!open) return null
  return (
    <>
      <button className="popover-dismiss" aria-label="Fechar menu de privacidade" onClick={onClose} />
      <div className="privacy-popover">
        <div className="popover-label">Privacidade em um toque</div>
        <button type="button" className="privacy-menu-row" onClick={() => { setDiscreet(!discreet); onClose() }} aria-pressed={discreet}>
          <span className="privacy-menu-icon">{discreet ? <EyeOff size={18} /> : <Eye size={18} />}</span>
          <span><strong>Modo discreto</strong><small>{discreet ? 'Ativo — textos sensíveis aparecem suavizados.' : 'Suaviza informações sensíveis na tela.'}</small></span>
          <span className={`mini-switch ${discreet ? 'on' : ''}`} aria-hidden="true"><i /></span>
        </button>
        {privacy.quickLock !== false && (
          <button type="button" className="privacy-menu-row" onClick={() => { lockApp(); onClose() }}>
            <span className="privacy-menu-icon"><LockKeyhole size={18} /></span>
            <span><strong>Bloquear agora</strong><small>Mostra uma tela neutra imediatamente.</small></span>
            <Icon name="ChevronRight" size={16} />
          </button>
        )}
        <Link to="/app/settings" state={{ tab: 'privacy' }} className="privacy-menu-row" onClick={onClose}>
          <span className="privacy-menu-icon"><Settings2 size={18} /></span>
          <span><strong>Ajustar privacidade</strong><small>PIN, bloqueio automático e dados.</small></span>
          <Icon name="ChevronRight" size={16} />
        </Link>
        <p className="privacy-menu-note"><ShieldCheck size={14} /> Seus dados ficam neste dispositivo.</p>
      </div>
    </>
  )
}

function NotificationPanel({ open, onClose }) {
  const { data, markAllNotificationsRead, markNotificationRead, discreet } = useApp()
  const items = [...(data?.notifications || [])].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)).slice(0, 5)
  const unread = (data?.notifications || []).filter((item) => !item.read).length

  if (!open) return null
  return (
    <>
      <button className="popover-dismiss" aria-label="Fechar notificações" onClick={onClose} />
      <div className="notification-popover">
        <div className="notification-head">
          <div><strong>{discreet ? 'Avisos' : 'Notificações'}</strong><small>{unread} não lidas</small></div>
          <button type="button" className="text-button" onClick={markAllNotificationsRead}>Marcar todas</button>
        </div>
        <div className="notification-list">
          {items.length === 0 && <div className="notification-empty">Tudo tranquilo por aqui.</div>}
          {items.map((item) => (
            <Link to="/app/notifications" key={item.id} className={`notification-item ${item.read ? '' : 'unread'}`} onClick={() => { markNotificationRead(item.id); onClose() }}>
              <span className="notification-dot" />
              <span>
                <strong>{discreet ? 'Você tem um aviso' : item.title}</strong>
                <small>{discreet ? 'Abra quando estiver à vontade.' : item.description}</small>
                <em>{relativeLabel(item.date)} · {item.time}</em>
              </span>
            </Link>
          ))}
        </div>
        <Link to="/app/notifications" className="notification-footer" onClick={onClose}>Ver todas as notificações</Link>
      </div>
    </>
  )
}

function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = (() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return ALL_LINKS.slice(0, 9)
    return ALL_LINKS.filter((link) => `${link.label} ${link.group}`.toLowerCase().includes(needle)).slice(0, 12)
  })()

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const go = (to) => {
    navigate(to)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Buscar no seu ciclo" description="Encontre qualquer área rapidamente. Dica: a tecla Q abre o registro rápido." size="small">
      <div className="search-input-wrap">
        <Search size={18} />
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: calendário, sintomas, relatórios..." />
        <kbd>ESC</kbd>
      </div>
      <div className="search-results">
        {results.length === 0 && <div className="notification-empty">Nenhum resultado encontrado.</div>}
        {results.map((link) => (
          <button type="button" key={link.to} onClick={() => go(link.to)}>
            <AppIcon name={link.icon} size={19} />
            <span><strong>{link.label}</strong><small>{link.group}</small></span>
            <Icon name="ArrowUpRight" size={15} />
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default function AppShell() {
  const {
    data, toast, currentUser, discreet, setDiscreet, dismissToast,
    openQuickActions, quickActionsOpen,
  } = useApp()
  const location = useLocation()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigation = getNavigation()
  const bottomNav = getBottomNav()
  const unread = (data?.notifications || []).filter((item) => !item.read).length
  const currentLink = getLink(location.pathname)
  const info = getCycleInfo(data)

  useReminderAlerts({
    data,
    enabled: data?.settings?.notifications?.browser === true && data?.settings?.notifications?.reminders === true,
    discreet,
    userId: currentUser?.id,
  })

  useEffect(() => {
    setMobileMenuOpen(false)
    setNotificationsOpen(false)
    setPrivacyOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        return
      }
      if (event.key.toLowerCase() === 'q' && !event.ctrlKey && !event.metaKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault()
        openQuickActions()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openQuickActions])

  return (
    <div className={`app-shell ${discreet ? 'discreet-on' : ''} ${quickActionsOpen ? 'quick-open' : ''}`}>
      <a href="#conteudo-principal" className="skip-link">Ir para o conteúdo principal</a>
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <Link to="/app" aria-label="Início"><Logo compact /></Link>
          <button className="icon-button sidebar-close" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu"><X size={19} /></button>
        </div>
        <JourneyCard />
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {navigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/app'} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                  <AppIcon name={item.icon} size={19} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <AppIcon name="heart" size={17} />
          <span>Seu ciclo, no seu ritmo.</span>
        </div>
      </aside>
      {mobileMenuOpen && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-button" onClick={() => setMobileMenuOpen(true)} aria-label="Abrir menu"><Menu size={21} /></button>
            <div className="mobile-logo"><Logo compact subtitle={false} /></div>
            <div className="breadcrumb">
              <span>{ACTIVE_PHASE.short}</span>
              <Icon name="ChevronRight" size={14} />
              <strong>{currentLink.label}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <Search size={17} />
              <span>Buscar...</span>
              <kbd><Command size={11} /> K</kbd>
            </button>
            <div className="topbar-cycle-badge" title="Dia do ciclo">
              <AppIcon name="cycle" size={16} />
              <span>{discreet ? 'Seu ciclo' : info.day ? `Dia ${info.day} · ${info.phaseName}` : 'Sem registro'}</span>
            </div>
            <button type="button" className={`icon-button privacy-trigger ${discreet ? 'is-active' : ''}`} onClick={() => setPrivacyOpen((value) => !value)} aria-label="Privacidade" aria-expanded={privacyOpen}>
              {discreet ? <EyeOff size={19} /> : <ShieldCheck size={19} />}
            </button>
            <button type="button" className={`icon-button notification-trigger ${unread ? 'has-unread' : ''}`} onClick={() => setNotificationsOpen((value) => !value)} aria-label="Notificações">
              <Bell size={19} />
              {unread > 0 && <span>{unread}</span>}
            </button>
            <Link to="/app/profile" className="topbar-avatar" aria-label="Perfil"><Avatar name={currentUser?.name} size={40} /></Link>
          </div>
        </header>

        <main className="content" id="conteudo-principal" tabIndex={-1}>
          {discreet && (
            <div className="discreet-banner" role="status" aria-live="polite">
              <Icon name="EyeOff" size={17} />
              <span><strong>Modo discreto ativo.</strong> Informações sensíveis aparecem suavizadas. Toque e segure para revelar.</span>
              <button type="button" className="text-button" onClick={() => setDiscreet(false)}>Mostrar dados</button>
            </div>
          )}
          <Outlet />
        </main>

        <nav className="bottom-nav" aria-label="Navegação inferior">
          {bottomNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/app'} className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}>
              <AppIcon name={item.icon} size={22} />
              <span>{item.label === 'Registrar menstruação' ? 'Registrar' : item.label.replace('Calendário do ciclo', 'Calendário')}</span>
            </NavLink>
          ))}
          <NavLink to="/app/more" className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}>
            <AppIcon name="LayoutGrid" size={22} />
            <span>Mais</span>
          </NavLink>
        </nav>
      </div>

      <QuickActionFab />
      <QuickActionsPanel />
      <PrivacyMenu open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      {toast && (
        <div className={`toast toast-${toast.tone}`} role="status" aria-live="polite">
          <AppIcon name={toast.tone === 'error' ? 'CircleAlert' : 'CircleCheck'} size={20} />
          <span>{toast.message}</span>
          {toast.action && <button type="button" className="toast-action" onClick={() => { toast.action.onClick(); dismissToast() }}>{toast.action.label}</button>}
          <button type="button" className="toast-close" onClick={dismissToast} aria-label="Fechar aviso"><X size={14} /></button>
        </div>
      )}
    </div>
  )
}
