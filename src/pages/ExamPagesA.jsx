import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarPlus, Check, CloudUpload, MapPin, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { EXAM_TIPS, HEALTH_UNITS } from '../data/seed.js'
import { formatDate, relativeLabel, todayISO, uid } from '../lib/date.js'
import CalendarView from '../components/CalendarView.jsx'
import { Badge, Card, EmptyState, Field, Icon, IconCircle, ListRow, Modal, PageHeader, SectionTitle, StatCard, Tabs } from '../components/ui.jsx'

const emptyExam = {
  title: '', date: todayISO(), time: '08:00', unit: 'UBS Centro', professional: '',
  status: 'Agendado', category: 'Exames', notes: '',
}

function ExamForm({ form, setForm, onSubmit, id = 'exam-form' }) {
  return (
    <form id={id} className="form-grid" onSubmit={onSubmit}>
      <Field label="Exame ou consulta" required className="form-grid-full"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: preventivo, ultrassom, hemograma" /></Field>
      <Field label="Data"><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field>
      <Field label="Horário"><input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></Field>
      <Field label="Unidade"><select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })}>{HEALTH_UNITS.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></Field>
      <Field label="Profissional"><input value={form.professional} onChange={(event) => setForm({ ...form, professional: event.target.value })} placeholder="Opcional" /></Field>
      <Field label="Categoria"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Exames</option><option>Preventivo</option><option>Consultas</option><option>Vacinas</option></select></Field>
      <Field label="Status"><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Agendado</option><option>Realizado</option><option>Cancelado</option></select></Field>
      <Field label="Observações" className="form-grid-full"><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Preparo, orientações ou resultado" /></Field>
    </form>
  )
}

export function ExamsPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('ongoing')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyExam)
  const sorted = [...data.exams].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const filtered = tab === 'ongoing' ? sorted.filter((item) => item.status === 'Agendado') : tab === 'history' ? sorted.filter((item) => item.status === 'Realizado') : sorted

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    updateData((current) => ({ exams: [...current.exams, { ...form, id: uid('exam') }] }))
    setForm(emptyExam)
    setOpen(false)
    showToast('Exame adicionado à sua agenda.')
  }

  const markDone = (id) => {
    updateData((current) => ({ exams: current.exams.map((item) => item.id === id ? { ...item, status: 'Realizado' } : item) }))
    showToast('Exame marcado como realizado.')
  }

  const remove = (id) => {
    if (!window.confirm('Excluir este exame?')) return
    updateData((current) => ({ exams: current.exams.filter((item) => item.id !== id) }))
    showToast('Exame excluído.')
  }

  return (
    <div>
      <PageHeader eyebrow="Exames e preventivo" title="Exames e consultas" description="Mantenha seus exames em dia e receba lembretes pelo aplicativo." back onBack={() => navigate(-1)} actions={<>
        <Link to="/app/schedule-exam" className="button button-secondary"><CalendarPlus size={16} /> Agendar</Link>
        <button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16} /> Adicionar</button>
      </>} />
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <StatCard icon="CalendarClock" label="Próximos exames" value={data.exams.filter((item) => item.status === 'Agendado').length} hint="Agendados" />
        <StatCard icon="CircleCheck" label="Realizados" value={data.exams.filter((item) => item.status === 'Realizado').length} hint="No histórico" tone="green" />
        <StatCard icon="BellRing" label="Lembretes" value={data.reminders.filter((item) => item.category === 'Exames').length} hint="Ativos" tone="blue" />
      </div>
      <Tabs items={[{ id: 'ongoing', label: 'Em andamento' }, { id: 'history', label: 'Histórico' }, { id: 'all', label: 'Todos' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      <Card>
        <SectionTitle title={tab === 'history' ? 'Exames realizados' : 'Sua agenda de exames'} subtitle="Toque em um item para ver os detalhes." />
        <div className="stack-tight">
          {filtered.length === 0 && <EmptyState icon="ClipboardList" title="Nada agendado por aqui" description="Quando quiser, adicione um exame ou agende pela sua unidade de saúde." action={<button className="button button-primary" onClick={() => setOpen(true)}>Adicionar exame</button>} />}
          {filtered.map((item) => (
            <div className="list-row clickable" key={item.id}>
              <IconCircle icon="FlaskConical" tone={item.status === 'Realizado' ? 'green' : 'blue'} />
              <span className="list-row-text"><strong data-sensitive>{item.title}</strong><small>{formatDate(item.date, 'dd/MM/yyyy')} · {item.time} · {item.unit}</small></span>
              <Badge tone={item.status === 'Realizado' ? 'green' : item.status === 'Cancelado' ? 'danger' : 'rose'}>{item.status}</Badge>
              <span className="list-row-meta">{relativeLabel(item.date)}</span>
              <div className="row" style={{ gap: 3 }}>
                {item.status !== 'Realizado' && <button className="icon-button" onClick={() => markDone(item.id)} aria-label="Marcar realizado"><Check size={16} /></button>}
                <button className="icon-button" onClick={() => remove(item.id)} aria-label="Excluir"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Adicionar exame ou consulta" description="Organize sua rotina de prevenção." footer={<><button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button><button type="submit" form="exam-form" className="button button-primary">Salvar</button></>}>
        <ExamForm form={form} setForm={setForm} onSubmit={save} />
      </Modal>
    </div>
  )
}

export function ExamCalendarPage() {
  const { data } = useApp()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const events = [
    ...data.exams.filter((item) => item.date === selectedDate).map((item) => ({ ...item, kind: 'Exame' })),
    ...data.appointments.filter((item) => item.date === selectedDate).map((item) => ({ ...item, kind: 'Consulta' })),
    ...data.reminders.filter((item) => item.date === selectedDate).map((item) => ({ ...item, kind: item.category })),
  ]
  const upcoming = [...data.exams, ...data.appointments].filter((item) => item.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6)
  return (
    <div>
      <PageHeader eyebrow="Exames" title="Calendário de exames" description="Todos os seus exames, consultas e tarefas organizados." back onBack={() => navigate(-1)} actions={<Link to="/app/schedule-exam" className="button button-primary"><CalendarPlus size={16} /> Agendar exame</Link>} />
      <div className="split-layout">
        <Card><CalendarView data={data} selectedDate={selectedDate} onSelectDate={setSelectedDate} mode="events" /></Card>
        <div className="stack">
          <Card className="card-blush">
            <SectionTitle title={formatDate(selectedDate, "d 'de' MMMM")} subtitle={`${events.length} evento(s)`} />
            <div className="stack-tight">{events.length === 0 && <p className="muted small center">Nenhum evento nesta data.</p>}{events.map((event) => <div className="day-detail-item" key={`${event.kind}-${event.id}`}><IconCircle icon={event.kind === 'Consulta' ? 'Stethoscope' : 'FlaskConical'} tone={event.kind === 'Consulta' ? 'purple' : 'blue'} /><div><strong>{event.title}</strong><small>{event.kind} · {event.time || ''} {event.unit || event.location || ''}</small></div></div>)}</div>
          </Card>
          <Card>
            <SectionTitle title="Próximos agendamentos" />
            <div className="stack-tight">{upcoming.map((item) => <ListRow key={item.id} icon="CalendarDays" title={item.title} description={`${formatDate(item.date, 'dd/MM')} · ${item.time}`} meta={relativeLabel(item.date)} />)}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function PreventivePage() {
  const navigate = useNavigate()
  const preparation = [
    'Evite relações sexuais 48h antes do exame.',
    'Não use duchas, cremes ou medicamentos vaginais.',
    'O ideal é fazer entre o 1º e o 5º dia após o fim da menstruação.',
  ]
  return (
    <div>
      <PageHeader eyebrow="Prevenção" title="Preventivo (Papanicolau)" description="O exame que previne o câncer do colo do útero." back onBack={() => navigate(-1)} />
      <div className="split-layout">
        <div className="stack">
          <Card className="card-blush">
            <div className="row" style={{ alignItems: 'flex-start' }}><IconCircle icon="ShieldCheck" tone="rose" size="large" /><div><h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 29, margin: '0 0 6px' }}>Cuide de você hoje.</h2><p className="muted small" style={{ lineHeight: 1.6 }}>O exame preventivo identifica alterações antes mesmo de surgirem sintomas. É rápido, simples e pode salvar vidas.</p></div></div>
          </Card>
          <Card>
            <SectionTitle title="Como preparar?" subtitle="Siga estas orientações antes do exame" />
            <div className="check-list">{preparation.map((item, index) => <label className="check-item" key={item}><input type="checkbox" defaultChecked={index === 0} /><span>{item}</span><Badge tone={index === 0 ? 'green' : 'neutral'}>{index === 0 ? 'Pronto' : 'Pendente'}</Badge></label>)}</div>
          </Card>
          <Card>
            <SectionTitle title="Onde fazer o preventivo?" />
            <p className="muted small">Seu exame pode ser realizado na unidade básica de saúde do seu município. Escolha uma unidade e agende pelo aplicativo.</p>
            <div className="row wrap" style={{ marginTop: 14 }}><Link to="/app/units" className="button button-secondary"><MapPin size={16} /> Ver unidades</Link><Link to="/app/schedule-exam" className="button button-primary"><CalendarPlus size={16} /> Agendar preventivo</Link></div>
          </Card>
        </div>
        <div className="stack">
          <Card className="center"><IconCircle icon="Info" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, margin: '13px 0 5px' }}>Você sabia?</h3><p className="muted small">O preventivo é recomendado para mulheres com vida sexual ativa, conforme orientação do Ministério da Saúde.</p><Badge tone="rose">Prevenção é cuidado</Badge></Card>
          <Card>
            <SectionTitle title="Unidades próximas" />
            <div className="stack-tight">{HEALTH_UNITS.map((unit) => <ListRow key={unit.id} icon="MapPin" title={unit.name} description={unit.address} meta={<Badge tone="green">Disponível</Badge>} />)}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ExamHistoryPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('exams')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyExam)
  const vaccines = data.vaccines || [
    { id: 'vac-1', name: 'Influenza', date: '2025-04-10', unit: 'UBS Centro', dose: 'Dose anual' },
    { id: 'vac-2', name: 'HPV', date: '2024-08-20', unit: 'UBS Centro', dose: '2ª dose' },
  ]

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const record = { ...form, id: uid('record') }
    updateData((current) => {
      if (tab === 'vaccines') return { vaccines: [...vaccines, { id: record.id, name: record.title, date: record.date, unit: record.unit, dose: record.category }] }
      if (tab === 'consultations') return { appointments: [...current.appointments, { id: record.id, title: record.title, date: record.date, time: record.time, professional: record.professional, location: record.unit, status: record.status }] }
      return { exams: [...current.exams, record] }
    })
    setOpen(false)
    setForm(emptyExam)
    showToast('Registro adicionado ao histórico.')
  }

  return (
    <div>
      <PageHeader eyebrow="e-SUS" title="Meu histórico" description="Exames, consultas e vacinas em um só lugar." back onBack={() => navigate(-1)} actions={<><Link to="/app/e-sus" className="button button-secondary"><CloudUpload size={16} /> e-SUS</Link><button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16} /> Adicionar</button></>} />
      <Card className="info-callout" style={{ marginBottom: 18 }}><IconCircle icon="CloudUpload" tone="blue" /><div><h3>Seus exames integrados ao e-SUS</h3><p>Você encontra o histórico dos seus exames, consultas e vacinas registrados na unidade de saúde. Nesta versão, os registros são locais e editáveis.</p></div></Card>
      <Tabs items={[{ id: 'exams', label: 'Exames' }, { id: 'consultations', label: 'Consultas' }, { id: 'vaccines', label: 'Vacinas' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      <Card>
        <SectionTitle title={tab === 'exams' ? 'Histórico de exames' : tab === 'consultations' ? 'Histórico de consultas' : 'Carteira de vacinação'} />
        <div className="stack-tight">
          {tab === 'exams' && [...data.exams].sort((a, b) => b.date.localeCompare(a.date)).map((item) => <ListRow key={item.id} icon="FlaskConical" title={item.title} description={`${formatDate(item.date, 'dd/MM/yyyy')} · ${item.unit}`} meta={<Badge tone={item.status === 'Realizado' ? 'green' : 'rose'}>{item.status}</Badge>} />)}
          {tab === 'consultations' && [...data.appointments].sort((a, b) => b.date.localeCompare(a.date)).map((item) => <ListRow key={item.id} icon="Stethoscope" title={item.title} description={`${formatDate(item.date, 'dd/MM/yyyy')} · ${item.professional}`} meta={<Badge tone={item.status === 'Realizado' ? 'green' : 'rose'}>{item.status}</Badge>} tone="purple" />)}
          {tab === 'vaccines' && vaccines.map((item) => <ListRow key={item.id} icon="Syringe" title={item.name} description={`${formatDate(item.date, 'dd/MM/yyyy')} · ${item.unit}`} meta={item.dose} tone="green" />)}
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Adicionar registro" description="Inclua um atendimento ao seu histórico." footer={<><button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button><button type="submit" form="exam-form" className="button button-primary">Salvar</button></>}>
        <ExamForm form={form} setForm={setForm} onSubmit={save} />
      </Modal>
    </div>
  )
}

export function ExamTipsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  const details = {
    pap: 'O Papanicolau coleta células do colo do útero para identificar alterações precoces. É indolor, rápido e um dos principais exames de prevenção.',
    mammogram: 'A mamografia é uma radiografia das mamas capaz de encontrar alterações antes que sejam palpáveis. A frequência deve ser definida com sua equipe de saúde.',
    blood: 'Exames de sangue avaliam diferentes marcadores do organismo, como hemograma, glicemia, colesterol e hormônios. O preparo varia conforme o exame.',
    bone: 'A densitometria óssea mede a densidade mineral dos ossos e auxilia no diagnóstico precoce de osteopenia e osteoporose.',
    breast: 'Conhecer o próprio corpo ajuda a perceber mudanças. Ao notar nódulos, dor persistente ou alterações na pele, procure uma unidade de saúde.',
  }
  return (
    <div>
      <PageHeader eyebrow="Educação em saúde" title="Dicas de exames" description="Entenda para que serve cada exame e como se preparar." back onBack={() => navigate(-1)} />
      <div className="split-layout">
        <Card>
          <SectionTitle title="Exames importantes" subtitle="Toque para saber mais" />
          <div className="stack-tight">{EXAM_TIPS.map((tip) => <ListRow key={tip.id} icon={tip.icon} title={tip.title} description={tip.description} meta={<Icon name="ChevronRight" size={16} />} onClick={() => setActive(tip)} />)}</div>
        </Card>
        <div className="stack">
          <Card className="card-blush center"><IconCircle icon="HeartHandshake" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, margin: '13px 0 5px' }}>Prevenção é autocuidado</h3><p className="muted small">Cuide hoje de si mesma. Seu futuro agradece.</p></Card>
          <Card className="info-callout"><IconCircle icon="Info" tone="blue" /><div><h3>Fique atenta</h3><p>A periodicidade dos exames varia conforme idade, histórico familiar e condições de saúde. Converse com um profissional.</p></div></Card>
        </div>
      </div>
      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.title || ''} description="Entenda este exame" footer={<button className="button button-primary" onClick={() => setActive(null)}>Entendi</button>}>
        <div className="stack"><div className="article-hero"><Icon name={active?.icon || 'Stethoscope'} size={70} strokeWidth={1.4} /></div><p style={{ color: 'var(--text-soft)', fontSize: 13, lineHeight: 1.7 }}>{details[active?.id]}</p></div>
      </Modal>
    </div>
  )
}
