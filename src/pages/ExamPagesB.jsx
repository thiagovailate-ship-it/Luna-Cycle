import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Check, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { HEALTH_UNITS } from '../data/seed.js'
import { addDaysISO, formatDate, relativeLabel, todayISO, uid } from '../lib/date.js'
import { Badge, Card, EmptyState, Field, Icon, IconCircle, ListRow, Modal, PageHeader, SectionTitle, StatCard, Tabs } from '../components/ui.jsx'

export function ScheduleExamPage() {
  const { updateData, showToast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const initialUnit = HEALTH_UNITS.find((unit) => unit.id === location.state?.unitId) || HEALTH_UNITS[0]
  const [step, setStep] = useState(location.state?.unitId ? 2 : 1)
  const [unit, setUnit] = useState(initialUnit)
  const [form, setForm] = useState({ title: 'Preventivo (Papanicolau)', date: addDaysISO(todayISO(), 7), time: '08:00', professional: 'Dra. Mariana Souza', category: 'Preventivo' })

  const save = () => {
    updateData((current) => ({
      exams: [...current.exams, {
        id: uid('exam'), title: form.title, date: form.date, time: form.time,
        unit: unit.name, professional: form.professional, status: 'Agendado', category: form.category, notes: 'Agendado pelo aplicativo.',
      }],
      reminders: [...current.reminders, {
        id: uid('rem'), title: form.title, description: unit.name, date: form.date,
        time: form.time, category: 'Exames', active: true, done: false,
      }],
    }))
    showToast('Exame agendado com sucesso!')
    navigate('/app/exams')
  }

  return (
    <div>
      <PageHeader eyebrow="Exames" title="Agendar preventivo" description="Escolha unidade, data e confirme seu agendamento." back onBack={() => navigate(-1)} />
      <Card>
        <div className="wizard-steps">
          {['Unidade', 'Data', 'Confirmação'].map((label, index) => {
            const number = index + 1
            return <div className={`wizard-step ${step === number ? 'active' : ''} ${step > number ? 'done' : ''}`} key={label}><span>{step > number ? <Check size={14} /> : number}</span>{label}</div>
          })}
        </div>
        {step === 1 && (
          <div className="stack">
            <SectionTitle title="Escolha uma unidade de saúde" subtitle="Unidades disponíveis próximas a você" />
            <div className="stack-tight">
              {HEALTH_UNITS.map((item) => (
                <button type="button" className={`unit-option ${unit.id === item.id ? 'active' : ''}`} key={item.id} onClick={() => setUnit(item)}>
                  <IconCircle icon="MapPin" tone="rose" />
                  <div><strong>{item.name}</strong><small>{item.address}</small></div>
                  <Badge tone="green">Disponível</Badge>
                </button>
              ))}
            </div>
            <div className="row" style={{ justifyContent: 'flex-end' }}><button className="button button-primary" onClick={() => setStep(2)}>Continuar</button></div>
          </div>
        )}
        {step === 2 && (
          <div className="stack">
            <SectionTitle title="Escolha data e horário" subtitle={unit.name} />
            <div className="form-grid">
              <Field label="Tipo de exame"><select value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, category: event.target.value.includes('Preventivo') ? 'Preventivo' : 'Exames' })}><option>Preventivo (Papanicolau)</option><option>Mamografia</option><option>Exames de sangue</option><option>Densitometria óssea</option><option>Consulta ginecológica</option></select></Field>
              <Field label="Profissional"><input value={form.professional} onChange={(event) => setForm({ ...form, professional: event.target.value })} /></Field>
              <Field label="Data"><input type="date" min={todayISO()} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field>
              <Field label="Horário"><input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></Field>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}><button className="button button-secondary" onClick={() => setStep(1)}>Voltar</button><button className="button button-primary" onClick={() => setStep(3)}>Continuar</button></div>
          </div>
        )}
        {step === 3 && (
          <div className="stack">
            <SectionTitle title="Confirme seu agendamento" subtitle="Revise os dados antes de confirmar" />
            <div className="grid grid-2">
              <Card className="card-soft"><div className="stack-tight"><ListRow icon="FlaskConical" title={form.title} description="Exame selecionado" /><ListRow icon="CalendarDays" title={formatDate(form.date, "dd 'de' MMMM 'de' yyyy")} description={`Horário: ${form.time}`} tone="blue" /><ListRow icon="MapPin" title={unit.name} description={unit.address} tone="green" /><ListRow icon="UserRound" title={form.professional || 'Profissional a definir'} description="Equipe de saúde" tone="purple" /></div></Card>
              <Card className="card-blush center"><IconCircle icon="ShieldCheck" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, margin: '14px 0 6px' }}>Tudo pronto!</h3><p className="muted small">Ao confirmar, criaremos também um lembrete automático para você não esquecer.</p><Badge tone="rose">{relativeLabel(form.date)}</Badge></Card>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}><button className="button button-secondary" onClick={() => setStep(2)}>Voltar</button><button className="button button-primary" onClick={save}><Check size={16} /> Confirmar agendamento</button></div>
          </div>
        )}
      </Card>
    </div>
  )
}

export function UnitDetailsPage() {
  const { showToast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedId, setSelectedId] = useState(location.state?.unitId || HEALTH_UNITS[0].id)
  const unit = HEALTH_UNITS.find((item) => item.id === selectedId) || HEALTH_UNITS[0]
  return (
    <div>
      <PageHeader eyebrow="Rede de saúde" title="Detalhes da unidade" description="Encontre horários, serviços e localização." back onBack={() => navigate(-1)} />
      <div className="split-layout">
        <Card>
          <SectionTitle title="Unidades disponíveis" subtitle="Selecione para ver os detalhes" />
          <div className="stack-tight" style={{ marginBottom: 18 }}>
            {HEALTH_UNITS.map((item) => <button type="button" className={`unit-option ${unit.id === item.id ? 'active' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)}><IconCircle icon="MapPin" tone="rose" /><div><strong>{item.name}</strong><small>{item.address}</small></div><Badge tone="green">Disponível</Badge></button>)}
          </div>
          <div className="map-mock"><div className="map-pin"><Icon name="MapPin" size={18} /></div></div>
          <div className="row wrap" style={{ marginTop: 14 }}><button className="button button-secondary" onClick={() => showToast(`Mapa ilustrativo de ${unit.name}.`)}><Icon name="Navigation" size={16} /> Ver no mapa</button><button className="button button-primary" onClick={() => navigate('/app/schedule-exam', { state: { unitId: unit.id } })}>Agendar nesta unidade</button></div>
        </Card>
        <div className="stack">
          <Card className="card-blush">
            <SectionTitle title={unit.name} subtitle={unit.address} />
            <div className="stack-tight">
              <ListRow icon="MapPin" title="Endereço" description={unit.address} />
              <ListRow icon="Phone" title="Telefone" description={unit.phone} tone="green" />
              <ListRow icon="Clock3" title="Horário de atendimento" description={unit.hours} tone="blue" />
            </div>
          </Card>
          <Card>
            <SectionTitle title="Serviços disponíveis" />
            <div className="check-list">{unit.services.map((service) => <div className="check-item" key={service}><Check size={16} color="var(--green)" /><span>{service}</span><Badge tone="green">Sim</Badge></div>)}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ESUSPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const historyCount = data.exams.length + data.appointments.length

  const sync = () => {
    updateData((current) => ({
      notifications: [{ id: uid('notif'), title: 'Integração e-SUS atualizada', description: 'Seus registros locais foram reorganizados.', date: todayISO(), time: '09:00', read: false, category: 'e-SUS' }, ...current.notifications],
    }))
    showToast('Dados e-SUS sincronizado nesta demonstração.')
  }

  return (
    <div>
      <PageHeader eyebrow="Sistema Único de Saúde" title="e-SUS" description="Entenda como seus atendimentos podem ser integrados." back onBack={() => navigate(-1)} />
      <div className="split-layout">
        <div className="stack">
          <Card className="card-blush"><div className="row" style={{ alignItems: 'flex-start' }}><IconCircle icon="CloudUpload" tone="blue" size="large" /><div><h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 29, margin: '0 0 6px' }}>Sistema Único de Saúde</h2><p className="muted small" style={{ lineHeight: 1.6 }}>Seus atendimentos e exames são registrados no e-SUS, garantindo o acompanhamento completo da sua saúde na rede pública.</p></div></div></Card>
          <Card>
            <SectionTitle title="O que é o e-SUS?" />
            <p className="muted small" style={{ lineHeight: 1.7 }}>É o sistema do Ministério da Saúde que integra informações da sua saúde na rede pública, como consultas, exames, vacinas e atendimentos.</p>
            <div className="divider" />
            <SectionTitle title="Você pode" />
            <div className="stack-tight">
              <ListRow icon="History" title="Acessar seu histórico de exames" description="Exames realizados na unidade" />
              <ListRow icon="Stethoscope" title="Ver os atendimentos realizados" description="Consultas e procedimentos" tone="green" />
              <ListRow icon="RefreshCw" title="Manter seus dados sempre atualizados" description="Sincronização de registros" tone="blue" />
            </div>
          </Card>
        </div>
        <div className="stack">
          <Card className="center"><IconCircle icon="CloudUpload" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, margin: '13px 0 5px' }}>Seus dados integrados</h3><p className="muted small">Nesta versão local, a integração é demonstrativa.</p><button className="button button-primary button-block" style={{ marginTop: 12 }} onClick={sync}>Sincronizar agora</button></Card>
          <Card>
            <SectionTitle title="Resumo" />
            <div className="grid grid-2" style={{ gap: 9 }}><StatCard icon="FlaskConical" label="Exames" value={data.exams.length} /><StatCard icon="Stethoscope" label="Consultas" value={data.appointments.length} tone="green" /></div>
            <Link to="/app/history" className="button button-secondary button-block" style={{ marginTop: 12 }}>Ver histórico completo ({historyCount})</Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function AlertsPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', date: addDaysISO(todayISO(), 1), time: '09:00', category: 'Consultas' })
  const reminders = [...data.reminders].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const filtered = tab === 'all' ? reminders : reminders.filter((item) => item.category === tab)
  const upcomingExams = [...data.exams].filter((item) => item.date >= todayISO() && item.status !== 'Realizado').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5)

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    updateData((current) => ({ reminders: [...current.reminders, { ...form, id: uid('rem'), active: true, done: false }] }))
    setOpen(false)
    setForm({ title: '', description: '', date: addDaysISO(todayISO(), 1), time: '09:00', category: 'Consultas' })
    showToast('Lembrete criado.')
  }

  const toggleDone = (id) => updateData((current) => ({ reminders: current.reminders.map((item) => item.id === id ? { ...item, done: !item.done } : item) }))
  const toggleActive = (id) => updateData((current) => ({ reminders: current.reminders.map((item) => item.id === id ? { ...item, active: !item.active } : item) }))
  const remove = (id) => {
    if (!window.confirm('Excluir este lembrete?')) return
    updateData((current) => ({ reminders: current.reminders.filter((item) => item.id !== id) }))
    showToast('Lembrete excluído.')
  }

  return (
    <div>
      <PageHeader eyebrow="Exames" title="Alertas e lembretes" description="Não deixe nenhum cuidado importante passar." back onBack={() => navigate(-1)} actions={<button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16} /> Novo lembrete</button>} />
      <Tabs items={[{ id: 'all', label: 'Todos' }, { id: 'Consultas', label: 'Consultas' }, { id: 'Exames', label: 'Exames' }, { id: 'Medicação', label: 'Medicação' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      <div className="split-layout">
        <Card>
          <SectionTitle title="Seus lembretes" subtitle={`${filtered.length} item(ns)`} />
          <div className="stack-tight">
            {filtered.length === 0 && <EmptyState icon="BellRing" title="Nenhum lembrete" description="Crie um lembrete para organizar sua rotina." />}
            {filtered.map((item) => (
              <div className={`reminder-card ${item.done ? 'done' : ''}`} key={item.id}>
                <button className={`icon-button ${item.done ? 'button-primary' : ''}`} onClick={() => toggleDone(item.id)} aria-label="Concluir"><Check size={16} /></button>
                <div className="reminder-content"><strong data-sensitive>{item.title}</strong><small>{formatDate(item.date, 'dd/MM/yyyy')} · {item.time} · {item.description || item.category}</small></div>
                <Badge tone={item.done ? 'green' : item.active ? 'rose' : 'neutral'}>{item.done ? 'Concluído' : item.active ? 'Ativo' : 'Pausado'}</Badge>
                <button className="icon-button" onClick={() => toggleActive(item.id)} aria-label="Ativar ou pausar"><Icon name={item.active ? 'Pause' : 'Play'} size={15} /></button>
                <button className="icon-button" onClick={() => remove(item.id)} aria-label="Excluir"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Card className="card-blush"><SectionTitle title="Próximos exames" /><div className="stack-tight">{upcomingExams.map((item) => <ListRow key={item.id} icon="FlaskConical" title={item.title} description={`${formatDate(item.date, 'dd/MM')} · ${item.unit}`} meta={relativeLabel(item.date)} tone="blue" />)}</div></Card>
          <Card className="info-callout"><IconCircle icon="BellRing" tone="peach" /><div><h3>Dica</h3><p>Ative notificações no seu perfil para receber lembretes de consultas, exames e medicações.</p><Link to="/app/notifications" className="text-button" style={{ display: 'inline-block', marginTop: 8 }}>Configurar notificações</Link></div></Card>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Novo lembrete" description="Crie um alerta para um cuidado importante." footer={<><button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button><button type="submit" form="alert-form" className="button button-primary">Salvar</button></>}>
        <form id="alert-form" className="stack-tight" onSubmit={save}>
          <Field label="Título" required><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: consulta médica" /></Field>
          <Field label="Descrição"><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Detalhes do lembrete" /></Field>
          <div className="form-grid"><Field label="Data"><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field><Field label="Horário"><input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></Field></div>
          <Field label="Categoria"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Consultas</option><option>Exames</option><option>Medicação</option><option>Bem-estar</option></select></Field>
        </form>
      </Modal>
    </div>
  )
}
