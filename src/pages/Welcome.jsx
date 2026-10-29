import { Link } from 'react-router-dom'
import { AppIcon } from '../components/AppIcon.jsx'
import { CycleHeroArt } from '../components/CycleArt.jsx'
import { Logo } from '../components/ui.jsx'

const features = [
  { icon: 'calendar', title: 'Calendário vivo', text: 'Menstruação, fertilidade e ovulação em um só lugar.' },
  { icon: 'drop', title: 'Fluxo dia a dia', text: 'Registre o início e acompanhe cada dia do período.' },
  { icon: 'symptoms', title: 'Sintomas e humor', text: 'Entenda padrões sem cobrança, no seu tempo.' },
]

export default function Welcome() {
  return (
    <div className="public-shell">
      <section className="public-art">
        <Logo />
        <div className="public-hero">
          <CycleHeroArt className="cycle-hero-art" />
          <div className="public-hero-copy">
            <div className="eyebrow">Bem-vinda ao Luna Cycle</div>
            <h1>Seu ciclo, <br />no seu ritmo.</h1>
            <p>Um app feito para acompanhar a menstruação, acolher sintomas e transformar registros em autoconhecimento.</p>
          </div>
        </div>
        <div className="public-footer">
          Seus dados ficam neste navegador.<br />Privacidade e cuidado em primeiro lugar.
        </div>
      </section>
      <section className="public-panel">
        <div className="public-card welcome-card">
          <span className="welcome-badge"><AppIcon name="cycle" size={17} /> Foco total no ciclo menstrual</span>
          <h2>Cada dia do seu ciclo importa.</h2>
          <p>Registre a menstruação em um toque, acompanhe o fluxo, entenda sintomas e receba previsões personalizadas.</p>
          <div className="welcome-features">
            {features.map((feature) => (
              <div className="welcome-feature" key={feature.title}>
                <span className="icon-circle icon-rose"><AppIcon name={feature.icon} size={22} /></span>
                <div><strong>{feature.title}</strong><small>{feature.text}</small></div>
              </div>
            ))}
          </div>
          <Link className="button button-primary button-block" to="/auth?mode=register">Começar agora</Link>
          <Link className="button button-ghost button-block" to="/auth?mode=login">Já tem uma conta? Entrar</Link>
          <div className="demo-note"><strong>Conta de demonstração:</strong> demo@lunacycle.app · senha luna123</div>
        </div>
      </section>
    </div>
  )
}
