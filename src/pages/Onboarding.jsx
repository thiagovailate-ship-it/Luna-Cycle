import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { AppIcon } from '../components/AppIcon.jsx'
import { CycleHeroArt } from '../components/CycleArt.jsx'
import { Field, Logo } from '../components/ui.jsx'
import { addDaysISO, todayISO, uid } from '../lib/date.js'

const CYCLE_LENGTHS = Array.from({ length: 20 }).map((_, index) => index + 21)
const PERIOD_LENGTHS = [2, 3, 4, 5, 6, 7, 8]

export default function Onboarding() {
  const { currentUser, updateData, showToast, logout } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    lastPeriod: addDaysISO(todayISO(), -13),
    cycleLength: '28',
    periodLength: '5',
    regularity: 'regular',
  })
  const [error, setError] = useState('')

  const patch = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const finish = () => {
    updateData((current) => ({
      settings: { ...current.settings, onboardingComplete: true },
    }))
    navigate('/app', { replace: true })
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (!form.lastPeriod) {
      setError('Escolha a data aproximada do primeiro dia da sua última menstruação.')
      return
    }
    if (form.lastPeriod > todayISO()) {
      setError('A data não pode estar no futuro.')
      return
    }
    const duration = Number(form.periodLength)
    const startDate = form.lastPeriod
    updateData((current) => {
      const entry = {
        id: uid('cycle'),
        startDate,
        duration,
        flow: 'Moderado',
        notes: 'Primeiro registro',
      }
      const entries = [
        entry,
        ...current.cycle.entries.filter((item) => item.startDate !== startDate),
      ].sort((a, b) => b.startDate.localeCompare(a.startDate))
      return {
        cycle: { ...current.cycle, entries },
        settings: {
          ...current.settings,
          cycleLength: Number(form.cycleLength),
          periodLength: duration,
          cycleRegularity: form.regularity,
          onboardingComplete: true,
        },
        notifications: [
          {
            id: uid('notif'),
            title: 'Seu acompanhamento começou',
            description: 'Registre seus sinais no seu ritmo. Cada pequeno registro ajuda a personalizar as previsões.',
            date: todayISO(),
            time: '08:00',
            read: false,
            category: 'Bem-estar',
          },
          ...current.notifications,
        ],
      }
    })
    showToast('Tudo pronto! Seu ciclo começa a ser acompanhado.')
    navigate('/app', { replace: true })
  }

  return (
    <div className="public-shell onboarding-shell">
      <section className="public-art">
        <Logo />
        <div className="public-hero">
          <CycleHeroArt className="cycle-hero-art" />
          <div className="public-hero-copy">
            <div className="eyebrow">Primeiros passos</div>
            <h1>Do seu jeito</h1>
            <p>Algumas informações simples deixam as previsões mais próximas do seu corpo. Você pode ajustar tudo depois.</p>
          </div>
        </div>
        <div className="public-footer">
          Seus dados ficam salvos somente neste navegador.<br />Sem envio para servidores.
        </div>
      </section>
      <section className="public-panel">
        <div className="public-card onboarding-card">
          <div className="eyebrow">Olá, {currentUser?.name?.split(' ')[0] || 'que bom ter você'}</div>
          <h2>Vamos personalizar seu ciclo</h2>
          <p>Essas respostas definem o ponto de partida das previsões. Nada é definitivo — você pode mudar quando quiser.</p>

          <form className="stack-tight" onSubmit={submit}>
            <Field label="Primeiro dia da última menstruação" hint="Se não lembrar a data exata, escolha uma aproximada." required>
              <input type="date" max={todayISO()} value={form.lastPeriod} onChange={(event) => patch('lastPeriod', event.target.value)} />
            </Field>
            <div className="form-grid">
              <Field label="Duração de referência do ciclo" hint="Quantos dias costuma passar entre menstruações?">
                <select value={form.cycleLength} onChange={(event) => patch('cycleLength', event.target.value)}>
                  {CYCLE_LENGTHS.map((value) => <option key={value} value={value}>{value} dias</option>)}
                </select>
              </Field>
              <Field label="Dias de menstruação">
                <select value={form.periodLength} onChange={(event) => patch('periodLength', event.target.value)}>
                  {PERIOD_LENGTHS.map((value) => <option key={value} value={value}>{value} dias</option>)}
                </select>
              </Field>
            </div>

            <fieldset className="onboarding-fieldset">
              <legend>Seu ciclo costuma ser regular?</legend>
              <div className="onboarding-options">
                <button
                  type="button"
                  className={`onboarding-option ${form.regularity === 'regular' ? 'active' : ''}`}
                  aria-pressed={form.regularity === 'regular'}
                  onClick={() => patch('regularity', 'regular')}
                >
                  <AppIcon name="cycle" size={19} />
                  <span><strong>Regular</strong><small>Varia pouco entre ciclos</small></span>
                </button>
                <button
                  type="button"
                  className={`onboarding-option ${form.regularity === 'irregular' ? 'active' : ''}`}
                  aria-pressed={form.regularity === 'irregular'}
                  onClick={() => patch('regularity', 'irregular')}
                >
                  <AppIcon name="sparkles" size={19} />
                  <span><strong>Irregular</strong><small>Varia bastante entre ciclos</small></span>
                </button>
              </div>
            </fieldset>

            {error && <div className="error-message">{error}</div>}
            <button className="button button-primary button-block" type="submit">Começar meu acompanhamento</button>
          </form>

          <button type="button" className="onboarding-skip" onClick={finish}>Prefiro explorar primeiro</button>
          <p className="onboarding-note"><AppIcon name="shield" size={14} /> Você pode registrar ou alterar tudo depois. As previsões são estimativas e não substituem um método contraceptivo.</p>
          <button type="button" className="text-button onboarding-logout" onClick={() => { logout(); navigate('/welcome', { replace: true }) }}>Sair desta conta</button>
        </div>
      </section>
    </div>
  )
}
