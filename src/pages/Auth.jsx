import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { AppIcon } from '../components/AppIcon.jsx'
import { CycleHeroArt } from '../components/CycleArt.jsx'
import { Field, Logo } from '../components/ui.jsx'

export default function Auth() {
  const { authenticated, login, register, showToast } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'register'
  const [mode, setMode] = useState(initialMode)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (authenticated) navigate('/app', { replace: true })
  }, [authenticated, navigate])

  const patch = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = (event) => {
    event.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password) {
      setError('Só falta e-mail e senha para entrar.')
      return
    }
    if (mode === 'register') {
      if (!form.name.trim()) {
        setError('Como podemos chamar você?')
        return
      }
      if (form.password.length < 6) {
        setError('Use uma senha com 6 caracteres ou mais, no seu tempo.')
        return
      }
      const result = register(form)
      if (!result.ok) return setError(result.error)
      showToast('Conta criada! Bem-vinda ao Luna Cycle.')
      navigate('/app', { replace: true })
    } else {
      const result = login(form.email, form.password)
      if (!result.ok) return setError(result.error)
      showToast('Bem-vinda de volta!')
      navigate('/app', { replace: true })
    }
  }

  const demoLogin = () => {
    const result = login('demo@lunacycle.app', 'luna123')
    if (!result.ok) return setError(result.error)
    showToast('Você entrou na conta de demonstração.')
    navigate('/app', { replace: true })
  }

  return (
    <div className="public-shell">
      <section className="public-art">
        <Link to="/"><Logo /></Link>
        <div className="public-hero">
          <CycleHeroArt className="cycle-hero-art" />
          <div className="public-hero-copy">
            <div className="eyebrow">{mode === 'login' ? 'Que bom ter você de volta' : 'Seu ciclo começa aqui'}</div>
            <h1>Luna Cycle</h1>
            <p>Registre a menstruação, acompanhe o fluxo e entenda seu corpo com mais leveza.</p>
          </div>
        </div>
        <div className="public-footer">
          Seus dados ficam salvos neste navegador.<br />Uma experiência privada, feita para você.
        </div>
      </section>
      <section className="public-panel">
        <div className="public-card auth-card">
          <Link to="/" className="text-button auth-back"><ArrowLeft size={13} /> Voltar</Link>
          <div className="auth-tabs">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Entrar</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError('') }}>Criar conta</button>
          </div>
          <h2>{mode === 'login' ? 'Olá, bem-vinda!' : 'Vamos começar?'}</h2>
          <p>{mode === 'login' ? 'Entre para acompanhar seu ciclo e sua saúde.' : 'Crie sua conta local e comece a registrar seu ciclo hoje.'}</p>

          <div className="cycle-focus-card">
            <span className="icon-circle icon-rose"><AppIcon name="cycle" size={23} /></span>
            <div><strong>100% ciclo menstrual</strong><small>Calendário, fluxo, sintomas, humor e previsões.</small></div>
          </div>

          <form className="stack-tight" onSubmit={submit}>
            {mode === 'register' && (
              <Field label="Nome completo" required>
                <input value={form.name} onChange={(event) => patch('name', event.target.value)} placeholder="Como podemos chamar você?" />
              </Field>
            )}
            <Field label="E-mail" required>
              <input type="email" value={form.email} onChange={(event) => patch('email', event.target.value)} placeholder="voce@email.com" />
            </Field>
            <Field label="Senha" required hint={mode === 'register' ? 'Mínimo de 6 caracteres.' : undefined}>
              <input type="password" value={form.password} onChange={(event) => patch('password', event.target.value)} placeholder="Sua senha" />
            </Field>
            {error && <div className="error-message">{error}</div>}
            <button className="button button-primary button-block" type="submit">
              {mode === 'login' ? 'Entrar' : 'Criar minha conta'}
            </button>
          </form>

          <div className="auth-divider">ou</div>
          <button className="button button-secondary button-block" type="button" onClick={demoLogin}>
            <AppIcon name="PlayCircle" size={18} /> Explorar conta de demonstração
          </button>
          <div className="demo-note"><strong>Demo:</strong> demo@lunacycle.app · senha luna123</div>
        </div>
      </section>
    </div>
  )
}
