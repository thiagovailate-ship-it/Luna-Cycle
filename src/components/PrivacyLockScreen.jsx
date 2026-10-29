import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, EyeOff, LockKeyhole, LogOut, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { Logo } from './ui.jsx'

export default function PrivacyLockScreen() {
  const { privacy, discreet, unlockApp, logout } = useApp()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const hasPin = Boolean(privacy.pin)

  const unlock = (event) => {
    event.preventDefault()
    if (!unlockApp(pin)) {
      setError('Esse PIN não deu certo. Tente novamente com calma.')
      return
    }
    setError('')
    setPin('')
  }

  const leave = () => {
    logout()
    navigate('/welcome', { replace: true })
  }

  return (
    <div className="privacy-lock" role="dialog" aria-modal="true" aria-label="Aplicativo bloqueado">
      <div className="privacy-lock-card">
        <div className="privacy-lock-brand"><Logo compact /></div>
        <div className="privacy-lock-icon"><LockKeyhole size={34} strokeWidth={1.6} /></div>
        <div className="eyebrow">Seu espaço, no seu tempo</div>
        <h1>{discreet ? 'Tudo protegido por aqui.' : 'Seu espaço está protegido.'}</h1>
        <p>Respire com tranquilidade. Seus dados continuam apenas neste dispositivo.</p>

        {hasPin ? (
          <form className="privacy-pin-form" onSubmit={unlock}>
            <label htmlFor="privacy-pin">Digite seu PIN de 4 dígitos</label>
            <input
              id="privacy-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={(event) => { setPin(event.target.value.replace(/\D/g, '')); setError('') }}
              placeholder="••••"
              aria-describedby={error ? 'privacy-pin-error' : undefined}
            />
            {error && <small id="privacy-pin-error" className="privacy-pin-error" role="alert">{error}</small>}
            <button type="submit" className="button button-primary button-block">Desbloquear <ArrowRight size={16} /></button>
          </form>
        ) : (
          <button type="button" className="button button-primary button-block" onClick={() => unlockApp()}>Desbloquear com um toque</button>
        )}

        <div className="privacy-lock-actions">
          <span><EyeOff size={15} /> {discreet ? 'Modo discreto ativo' : 'Nada sensível aparece nesta tela'}</span>
          <button type="button" className="text-button" onClick={leave}><LogOut size={14} /> Sair desta conta</button>
        </div>
        <div className="privacy-lock-note"><ShieldCheck size={15} /> O bloqueio é visual e local. Para proteção real dos dados, use também a senha do seu dispositivo.</div>
      </div>
    </div>
  )
}
