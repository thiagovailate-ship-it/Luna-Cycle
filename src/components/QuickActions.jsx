import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useQuickLog } from '../hooks/useQuickLog.js'
import { MOODS } from '../lib/date.js'
import { AppIcon } from './AppIcon.jsx'
import { MoodFace } from './MoodFace.jsx'
import { Modal } from './ui.jsx'

export function QuickActionFab() {
  const { openQuickActions, discreet } = useApp()
  return (
    <button
      type="button"
      className="quick-fab"
      onClick={openQuickActions}
      aria-label={discreet ? 'Abrir atalhos' : 'Abrir registro rápido'}
      aria-keyshortcuts="Q"
      title="Registro rápido · tecla Q"
    >
      <AppIcon name="plus" size={28} strokeWidth={1.7} />
      <span>{discreet ? 'Abrir' : 'Registrar'}</span>
    </button>
  )
}

function BreathingModal({ open, onClose }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!open) {
      setElapsed(0)
      return undefined
    }
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [open])

  useEffect(() => {
    if (open && elapsed >= 60) onClose()
  }, [open, elapsed, onClose])

  const cycle = elapsed % 12
  const phase = cycle < 4 ? 'inspire' : cycle < 6 ? 'hold' : 'expire'
  const labels = { inspire: 'Inspire com calma', hold: 'Segure suavemente', expire: 'Solte o ar devagar' }

  return (
    <Modal open={open} onClose={onClose} title="Respiração tranquila" description="Um minuto só para você, sem pressa e sem cobrança." size="small" footer={<button type="button" className="button button-primary" onClick={onClose}>Concluir</button>}>
      <div className="breathing-session">
        <div className={`breath-circle ${phase}`} aria-hidden="true"><span><AppIcon name="heart" size={30} /></span></div>
        <div className="breathing-copy" aria-live="polite">
          <strong>{labels[phase]}</strong>
          <span>{Math.max(0, 60 - elapsed)} segundos restantes</span>
        </div>
        <p className="muted small center">Acompanhe o círculo. Se preferir, feche os olhos e respire no seu ritmo.</p>
      </div>
    </Modal>
  )
}

export function QuickActionsPanel() {
  const { quickActionsOpen, closeQuickActions, discreet, setDiscreet } = useApp()
  const navigate = useNavigate()
  const { saveMood, addSymptom, addWater, startPeriod } = useQuickLog()
  const [breathingOpen, setBreathingOpen] = useState(false)

  useEffect(() => {
    if (!quickActionsOpen) return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      if (breathingOpen) setBreathingOpen(false)
      else closeQuickActions()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [quickActionsOpen, breathingOpen, closeQuickActions])

  const actions = [
    { id: 'period', label: 'Menstruação hoje', neutral: 'Registro do ciclo', icon: 'drop', tone: 'rose', onClick: startPeriod },
    { id: 'cramps', label: 'Cólica', neutral: 'Sintoma', icon: 'cramps', tone: 'peach', onClick: () => addSymptom('cramps') },
    { id: 'headache', label: 'Dor de cabeça', neutral: 'Sintoma', icon: 'headache', tone: 'lavender', onClick: () => addSymptom('headache') },
    { id: 'water', label: 'Bebi água', neutral: 'Hidratação', icon: 'water', tone: 'blue', onClick: addWater },
  ]

  if (!quickActionsOpen) return null

  return (
    <>
      <button type="button" className="quick-backdrop" aria-label="Fechar registro rápido" onClick={closeQuickActions} />
      <div className="quick-panel" role="dialog" aria-modal="true" aria-label="Registro rápido">
        <div className="quick-handle" aria-hidden="true" />
        <div className="quick-header">
          <div>
            <div className="eyebrow">Seu momento</div>
            <h2>{discreet ? 'Como você está?' : 'Registro rápido'}</h2>
            <p>Um toque é suficiente. Nada aqui é obrigatório.</p>
          </div>
          <button type="button" className="icon-button" onClick={closeQuickActions} aria-label="Fechar"><X size={19} /></button>
        </div>

        <div className="quick-section">
          <div className="quick-section-title"><strong>Como você está hoje?</strong><small>Você pode mudar depois</small></div>
          <div className="mood-quick-row">
            {MOODS.map((item) => (
              <button type="button" key={item.value} className={`mood-quick-button mood-tone-${item.tone}`} onClick={() => saveMood(item.value)} aria-label={`Registrar humor: ${item.label}`} title={item.label}>
                <MoodFace value={item.value} size={30} />
                <small>{discreet ? '•' : item.short}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="quick-section">
          <div className="quick-section-title"><strong>Registrar em um toque</strong><small>Com opção de desfazer</small></div>
          <div className="quick-action-grid">
            {actions.map((action) => (
              <button type="button" key={action.id} className="quick-action-tile" onClick={action.onClick}>
                <span className={`icon-circle icon-${action.tone}`}><AppIcon name={action.icon} size={22} /></span>
                <strong>{discreet ? action.neutral : action.label}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="quick-footer-actions">
          <button type="button" className="quick-footer-button" onClick={() => setBreathingOpen(true)}>
            <AppIcon name="wind" size={19} /> Respirar 1 minuto
          </button>
          <button type="button" className={`quick-footer-button ${discreet ? 'active' : ''}`} onClick={() => setDiscreet(!discreet)} aria-pressed={discreet}>
            <AppIcon name={discreet ? 'eyeOff' : 'eye'} size={19} /> {discreet ? 'Desativar modo discreto' : 'Modo discreto'}
          </button>
        </div>
        <button type="button" className="text-button quick-settings-link" onClick={() => { closeQuickActions(); navigate('/app/settings', { state: { tab: 'comfort' } }) }}>Ajustar conforto e privacidade</button>
        <p className="quick-privacy-note"><AppIcon name="shield" size={15} /> Seus dados ficam neste dispositivo. Toque e segure informações sensíveis para revelar no modo discreto.</p>
      </div>
      <BreathingModal open={breathingOpen} onClose={() => setBreathingOpen(false)} />
    </>
  )
}
