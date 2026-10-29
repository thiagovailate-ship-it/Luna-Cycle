// Dashboards das jornadas antigas, preservados para eventual reativação.
// Este arquivo não é importado pela aplicação ativa (foco: ciclo menstrual).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { formatDate, MOODS, relativeLabel, todayISO, uid } from '../lib/date.js'
import { getHormoneSeries, getPregnancyInfo } from '../lib/cycle.js'
import { BabyArt } from '../components/Art.jsx'
import {
  Badge, Card, Field, Icon, IconCircle, LineChart, ListRow, SectionTitle, StatCard,
} from '../components/ui.jsx'

function useUpcoming(data) {
  const today = todayISO()
  return [...(data.reminders || [])]
    .filter((item) => item.date >= today && item.active && !item.done)
    .sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`))
    .slice(0, 5)
}

function EventSidebar({ data }) {
  const upcoming = useUpcoming(data)
  return (
    <Card>
      <SectionTitle title="Próximos cuidados" subtitle="Sua agenda de bem-estar" action={<Link className="text-button" to="/app/reminders">Ver todos</Link>} />
      <div className="stack-tight">
        {upcoming.length === 0 && <p className="muted small center">Nenhum cuidado próximo.</p>}
        {upcoming.map((event) => (
          <div className="side-event" key={event.id}>
            <div className="event-date"><strong>{formatDate(event.date, 'dd')}</strong><span>{formatDate(event.date, 'MMM').replace('.', '')}</span></div>
            <div className="side-event-text"><strong>{event.title}</strong><small>{event.time} · {event.description || event.category}</small></div>
            <Badge tone="rose">{relativeLabel(event.date)}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

function QuickActions({ items }) {
  return (
    <div className="quick-actions-grid">
      {items.map((item) => (
        <Link className="quick-action" key={item.label} to={item.to}>
          <Icon name={item.icon} size={23} />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  )
}

export function PregnancyDashboard({ data, name, discreet }) {
  const pregnancy = getPregnancyInfo(data)
  const nextAppointment = [...(data.appointments || [])].filter((item) => item.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date))[0]
  const actions = [
    { label: 'Meu bebê', to: '/app/baby', icon: 'Baby' },
    { label: 'Minha saúde', to: '/app/health', icon: 'HeartPulse' },
    { label: 'Sintomas', to: '/app/symptoms', icon: 'Stethoscope' },
    { label: 'Exames e consultas', to: '/app/exams', icon: 'CalendarDays' },
  ]
  return (
    <div className="split-layout">
      <div className="stack">
        <Card className="baby-hero">
          <div>
            <div className="baby-week"><span>{pregnancy.week}</span> Semana {pregnancy.week} · {pregnancy.days}º dia</div>
            <h2>{discreet ? 'Seu acompanhamento de hoje!' : 'Seu bebê está crescendo!'}</h2>
            <p className="muted small">{pregnancy.trimester}º trimestre · Parto previsto para {formatDate(pregnancy.dueDate, 'dd/MM/yyyy')}</p>
            <div className="baby-progress"><span style={{ width: `${pregnancy.progress}%` }} /></div>
            <div className="row-between small muted"><span>Início da gestação</span><strong>{pregnancy.progress}% da jornada</strong></div>
            <div className="baby-measures">
              <div className="baby-measure"><span>Comprimento aproximado</span><strong>{pregnancy.sizeCm.toFixed(0)} cm</strong></div>
              <div className="baby-measure"><span>Peso aproximado</span><strong>{pregnancy.weightG} g</strong></div>
            </div>
          </div>
          <BabyArt className="baby-art" />
        </Card>
        <Card><SectionTitle title="Acesso rápido" subtitle="Tudo para acompanhar sua gestação" /><QuickActions items={actions} /></Card>
      </div>
      <div className="stack">
        <EventSidebar data={data} />
        <Card className="info-callout"><IconCircle icon="Heart" tone="rose" /><div><h3>Você não está sozinha, {name.split(' ')[0]}.</h3><p>Seu próximo encontro: {nextAppointment ? `${nextAppointment.title} · ${relativeLabel(nextAppointment.date)}` : 'sem consultas próximas'}.</p></div></Card>
      </div>
    </div>
  )
}

export function MenopauseDashboard({ data, name, discreet }) {
  const [mood, setMood] = useState(4)
  const [intensity, setIntensity] = useState(3)
  const [symptom, setSymptom] = useState('heat')
  const { updateData, showToast } = useApp()
  const hormoneData = getHormoneSeries('menopause')
  const symptomLabels = { heat: 'Ondas de calor', insomnia: 'Insônia', mood: 'Alterações de humor', fatigue: 'Cansaço' }
  const actions = [
    { label: 'Sintomas', to: '/app/symptoms', icon: 'Stethoscope' },
    { label: 'Bem-estar', to: '/app/wellness', icon: 'Flower2' },
    { label: 'Saúde hormonal', to: '/app/hormones', icon: 'Activity' },
    { label: 'Dicas', to: '/app/tips', icon: 'Lightbulb' },
  ]

  const saveCheckin = () => {
    const label = symptomLabels[symptom]
    updateData((current) => ({
      symptoms: [{ id: uid('symptom'), date: todayISO(), type: symptom, label, intensity, mood, notes: 'Registro rápido do início.' }, ...current.symptoms],
    }))
    showToast('Seu check-in de hoje foi registrado.')
  }

  return (
    <div className="split-layout">
      <div className="stack">
        <div className="phase-status-card">
          <div className="phase-status-icon"><Icon name="Flower2" /></div>
          <div className="grow"><h3>{discreet ? 'Seu acompanhamento pessoal' : `Sua fase atual: ${data.menopause.stage}`}</h3><p>Iniciada estimadamente aos {data.menopause.startAge} anos · Você está em transição.</p></div>
          <Badge tone="rose">Acompanhando</Badge>
        </div>
        <Card>
          <SectionTitle title="Como você está hoje?" subtitle="Seu check-in diário leva menos de um minuto" />
          <div className="grid grid-2">
            <div>
              <div className="field-label" style={{ marginBottom: 9 }}>Humor</div>
              <div className="checkin-faces">{MOODS.map((item) => <button type="button" key={item.value} className={`checkin-face ${mood === item.value ? 'active' : ''}`} onClick={() => setMood(item.value)} title={item.label}>{item.emoji}</button>)}</div>
            </div>
            <Field label="Sintoma principal"><select value={symptom} onChange={(event) => setSymptom(event.target.value)}>{Object.entries(symptomLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
          </div>
          <div className="intensity-slider-wrap">
            <div className="row-between"><span className="field-label">Intensidade do sintoma</span><strong className="small">{['', 'Leve', 'Leve', 'Moderado', 'Forte', 'Intenso'][intensity]}</strong></div>
            <input type="range" min="1" max="5" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
            <div className="slider-labels"><span>Leve</span><span>Moderado</span><span>Intenso</span></div>
          </div>
          <button type="button" className="button button-primary" onClick={saveCheckin}><Icon name="Check" size={16} /> Salvar check-in</button>
        </Card>
        <Card><SectionTitle title="Acesso rápido" /><QuickActions items={actions} /></Card>
      </div>
      <div className="stack">
        <Card><SectionTitle title="Seus hormônios" subtitle="Estimativa desta fase" /><LineChart data={hormoneData} lines={[{ key: 'estrogen', label: 'Estrogênio', color: '#c7758a' }, { key: 'progesterone', label: 'Progesterona', color: '#a897cf' }, { key: 'fsh', label: 'FSH', color: '#72aebf' }]} height={120} labels={3} /></Card>
        <EventSidebar data={data} />
        <Card className="info-callout"><IconCircle icon="Heart" tone="rose" /><div><h3>Você está indo muito bem, {name.split(' ')[0]}!</h3><p>Cuidar de você é um ato de amor.</p></div></Card>
      </div>
    </div>
  )
}

export function PreventiveDashboard({ data, name, discreet }) {
  const nextExam = [...(data.exams || [])].filter((item) => item.date >= todayISO() && item.status !== 'Realizado').sort((a, b) => a.date.localeCompare(b.date))[0]
  const done = (data.exams || []).filter((item) => item.status === 'Realizado').length
  const actions = [
    { label: 'Exames', to: '/app/exams', icon: 'ClipboardList' },
    { label: 'Agenda', to: '/app/exam-calendar', icon: 'CalendarDays' },
    { label: 'Preventivo', to: '/app/preventive', icon: 'ShieldCheck' },
    { label: 'Histórico', to: '/app/history', icon: 'History' },
  ]
  return (
    <div className="split-layout">
      <div className="stack">
        <Card className="page-banner"><div><div className="eyebrow">Prevenção é cuidado</div><h2>{discreet ? 'Bom ter você aqui!' : `Olá, ${name.split(' ')[0]}!`}</h2><p>Cuide de você também é prevenção.</p></div><Icon name="ShieldCheck" className="page-banner-art" size={92} strokeWidth={1.2} /></Card>
        <Card><SectionTitle title="Acesso rápido" /><QuickActions items={actions} /></Card>
      </div>
      <div className="stack">
        <Card className="card-blush"><SectionTitle title="Sua prevenção" subtitle="Visão geral" /><div className="grid grid-2" style={{ gap: 10 }}><StatCard icon="CircleCheck" label="Realizados" value={done} tone="green" /><StatCard icon="CalendarClock" label="Próximo" value={nextExam ? formatDate(nextExam.date, 'dd/MM') : '—'} tone="blue" /></div></Card>
        <EventSidebar data={data} />
        <Card><SectionTitle title="Resumo" /><ListRow icon="ClipboardList" title="Histórico" description={`${data.exams?.length || 0} registros`} /></Card>
      </div>
    </div>
  )
}
