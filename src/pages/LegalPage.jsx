import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LAST_UPDATED, LEGAL_SUMMARY, PRIVACY_CONTACT_EMAIL, PRIVACY_SECTIONS, PRIVACY_VERSION, TERMS_SECTIONS } from '../data/legal.js'
import { AppIcon } from '../components/AppIcon.jsx'
import { Badge, Card, IconCircle, Logo, PageHeader, SectionTitle, Tabs } from '../components/ui.jsx'

function LegalSections({ sections }) {
  return (
    <div className="stack">
      {sections.map((section) => (
        <section className="legal-section" key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  )
}

export function LegalContent({ initialTab = 'privacy', compact = false }) {
  const [tab, setTab] = useState(initialTab)
  return (
    <div className={compact ? 'legal-content' : 'legal-content'}>
      <div className="legal-meta">
        <Badge tone="rose">Versão {PRIVACY_VERSION}</Badge>
        <span className="muted small">Atualizado em {LAST_UPDATED}</span>
      </div>
      <Card className="card-blush legal-summary">
        <SectionTitle title="Resumo" subtitle="O essencial sobre privacidade no Luna Cycle" />
        <ul className="legal-summary-list">
          {LEGAL_SUMMARY.map((item) => (
            <li key={item}><span className="icon-circle icon-rose"><AppIcon name="check" size={16} /></span><span>{item}</span></li>
          ))}
        </ul>
      </Card>
      <div style={{ height: 14 }} />
      <Tabs
        items={[
          { id: 'privacy', label: 'Privacidade' },
          { id: 'terms', label: 'Termos de uso' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div style={{ height: 14 }} />
      <Card>
        {tab === 'privacy' ? (
          <>
            <SectionTitle
              title="Política de Privacidade"
              subtitle="Como tratamos seus dados, com foco em privacidade e LGPD"
            />
            <LegalSections sections={PRIVACY_SECTIONS} />
          </>
        ) : (
          <>
            <SectionTitle
              title="Termos de Uso"
              subtitle="Condições para usar o Luna Cycle com segurança e clareza"
            />
            <LegalSections sections={TERMS_SECTIONS} />
          </>
        )}
      </Card>
      <Card className="info-callout legal-contact">
        <IconCircle icon="ShieldCheck" tone="rose" />
        <div>
          <h3>Contato de privacidade</h3>
          <p>Dúvidas ou solicitações sobre seus dados: <strong>{PRIVACY_CONTACT_EMAIL}</strong>.</p>
        </div>
      </Card>
    </div>
  )
}

export default function LegalPage({ initialTab = 'privacy' }) {
  const navigate = useNavigate()
  return (
    <div>
      <PageHeader
        eyebrow="Transparência"
        title="Privacidade e Termos"
        description="Entenda como o Luna Cycle cuida dos seus dados e como usar o app."
        back
        onBack={() => navigate(-1)}
      />
      <LegalContent initialTab={initialTab} />
    </div>
  )
}

export function PublicLegalPage({ initialTab = 'privacy' }) {
  const navigate = useNavigate()
  return (
    <div className="public-shell legal-public">
      <section className="public-art legal-public-art">
        <Link to="/" aria-label="Início"><Logo /></Link>
        <div className="public-hero" style={{ minHeight: 0, paddingTop: 24 }}>
          <div className="public-hero-copy" style={{ marginTop: 0 }}>
            <div className="eyebrow">Transparência</div>
            <h1>Privacidade e Termos</h1>
            <p>O Luna Cycle foi pensado para funcionar no seu dispositivo, com controle e clareza sobre seus dados.</p>
          </div>
        </div>
        <div className="public-footer">Seus dados ficam neste dispositivo.<br />Você decide o que registrar, exportar e excluir.</div>
      </section>
      <section className="public-panel legal-public-panel">
        <div className="legal-public-inner">
          <button type="button" className="text-button auth-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={13} /> Voltar
          </button>
          <LegalContent initialTab={initialTab} />
        </div>
      </section>
    </div>
  )
}
