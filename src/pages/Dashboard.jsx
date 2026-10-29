import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { ACTIVE_PHASE } from '../data/seed.js'
import { formatDate, MOODS, relativeLabel, todayISO } from '../lib/date.js'
import { getActivePeriod, getCycleInfo } from '../lib/cycle.js'
import { useQuickLog } from '../hooks/useQuickLog.js'
import { DecorativeLeaf } from '../components/Art.jsx'
import { AppIcon } from '../components/AppIcon.jsx'
import { MoodFace } from '../components/MoodFace.jsx'
import { CycleOrbitArt, PeriodFlowArt } from '../components/CycleArt.jsx'
import { Badge, Card, Icon, ListRow, ProgressRing, SectionTitle, StatCard } from '../components/ui.jsx'

function useUpcoming(data) {
  return useMemo(() => {
    const today = todayISO()
    return [...(data.reminders || [])]
      .filter((item) => item.date >= today && item.active && !item.done)
      .sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`))
      .slice(0, 5)
  }, [data])
}

function EventSidebar({ data }) {
  const upcoming = useUpcoming(data)
  return (
    <Card className="event-sidebar-card">
      <SectionTitle title="Próximos cuidados" subtitle="Sua rotina, sem pressa" action={<Link className="text-button" to="/app/reminders">Ver todos</Link>} />
      <div className="stack-tight">
        {upcoming.length === 0 && <p className="muted small center">Nada pendente por aqui.</p>}
        {upcoming.map((event) => (
          <div className="side-event" key={event.id}>
            <div className="event-date"><strong>{formatDate(event.date, 'dd')}</strong><span>{formatDate(event.date, 'MMM').replace('.', '')}</span></div>
            <div className="side-event-text">
              <strong data-sensitive>{event.title}</strong>
              <small>{event.time} · {event.description || event.category}</small>
            </div>
            <Badge tone={event.category === 'Ciclo' ? 'rose' : 'neutral'}>{relativeLabel(event.date)}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ComfortStrip({ data, discreet }) {
  const { saveMood } = useQuickLog()
  const { openQuickActions } = useApp()
  const today = todayISO()
  const moodRecord = (data.moods || []).find((item) => item.date === today)
  const mood = MOODS.find((item) => item.value === moodRecord?.mood)
  const waterCount = (data.water || []).filter((item) => item.date === today).length

  return (
    <Card className="comfort-strip">
      <div className="comfort-strip-intro">
        <span className="icon-circle icon-rose icon-large"><AppIcon name="heart" size={26} /></span>
        <div>
          <div className="eyebrow">Check-in de hoje</div>
          <h2>Como você está?</h2>
          <p>Um toque já registra. Você escolhe o que compartilhar.</p>
        </div>
      </div>
      <div className="mood-quick-row comfort-moods" role="group" aria-label="Registrar humor de hoje">
        {MOODS.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`mood-quick-button mood-tone-${item.tone} ${moodRecord?.mood === item.value ? 'active' : ''}`}
            onClick={() => saveMood(item.value)}
            aria-label={`Registrar humor: ${item.label}`}
            aria-pressed={moodRecord?.mood === item.value}
            title={item.label}
          >
            <MoodFace value={item.value} size={32} />
            <small>{discreet ? '•' : item.short}</small>
          </button>
        ))}
      </div>
      <div className="comfort-meta">
        <span data-sensitive className="mood-summary">
          {mood ? <><MoodFace value={mood.value} size={20} /> Hoje: {mood.label}</> : 'Humor ainda não registrado'}
        </span>
        <span data-sensitive><AppIcon name="water" size={16} /> {waterCount} {waterCount === 1 ? 'copo' : 'copos'} de água</span>
        <button type="button" className="button button-primary button-small" onClick={openQuickActions}><AppIcon name="plus" size={15} /> Registro rápido</button>
      </div>
      <p className="comfort-note"><AppIcon name="sparkles" size={15} /> Sem cobrança. Registre só o que fizer sentido para você.</p>
    </Card>
  )
}

function PeriodQuickCard({ data }) {
  const { startPeriod } = useQuickLog()
  const active = getActivePeriod(data)
  const today = todayISO()
  const flow = (data.periodDays || []).find((item) => item.date === today)?.flow || active?.flow || 'Moderado'
  const flowLevel = flow === 'Intenso' ? 3 : flow === 'Moderado' ? 2 : 1

  if (active) {
    return (
      <Card className="period-quick-card active">
        <div className="period-quick-icon"><PeriodFlowArt level={flowLevel} /></div>
        <div className="period-quick-copy">
          <div className="eyebrow">Seu período hoje</div>
          <h2>Dia {active.day} da menstruação</h2>
          <p data-sensitive>Fluxo registrado como <strong>{flow.toLowerCase()}</strong>. Você pode ajustar a qualquer momento.</p>
        </div>
        <Link to="/app/menstruation" className="button button-secondary">Ajustar fluxo <Icon name="ArrowUpRight" size={15} /></Link>
      </Card>
    )
  }

  return (
    <Card className="period-quick-card">
      <div className="period-quick-icon"><AppIcon name="drop" size={34} /></div>
      <div className="period-quick-copy">
        <div className="eyebrow">Registro do ciclo</div>
        <h2>A menstruação começou hoje?</h2>
        <p>Comece com um toque. Isso melhora suas previsões e você ainda pode desfazer.</p>
      </div>
      <button type="button" className="button button-primary" onClick={startPeriod}><AppIcon name="check" size={16} /> Sim, começou hoje</button>
    </Card>
  )
}

function CyclePhaseTimeline({ info }) {
  const phases = [
    { key: 'menstruation', label: 'Menstruação', range: `Dias 1–${info.periodLength || 5}`, icon: 'drop' },
    { key: 'folicular', label: 'Folicular', range: `Até o dia ${info.fertileStart - 1}`, icon: 'leaf' },
    { key: 'ovulation', label: 'Ovulação', range: `Dia ${info.ovulationDay}`, icon: 'sparkles' },
    { key: 'luteal', label: 'Lútea', range: `Dias ${info.fertileEnd + 1}–${info.length}`, icon: 'moon' },
  ]
  const current = info.day <= (info.periodLength || 5)
    ? 'menstruation'
    : info.day < info.fertileStart
      ? 'folicular'
      : info.day <= info.fertileEnd
        ? 'ovulation'
        : 'luteal'

  return (
    <Card className="phase-timeline-card">
      <SectionTitle title="As fases do seu ciclo" subtitle="Uma visão simples do momento atual" action={<Link to="/app/my-cycle" className="text-button">Entender meu ciclo</Link>} />
      <div className="phase-timeline">
        {phases.map((phase) => (
          <div className={`phase-timeline-item ${current === phase.key ? 'active' : ''}`} key={phase.key}>
            <span className="phase-timeline-icon"><AppIcon name={phase.icon} size={21} /></span>
            <strong>{phase.label}</strong>
            <small>{phase.range}</small>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CycleDashboard({ data, name, discreet }) {
  const info = getCycleInfo(data)
  const latest = data.vitals[data.vitals.length - 1] || {}
  const nextPeriodDate = formatDate(info.nextPeriod, 'dd/MM')
  const activeReminders = (data.reminders || []).filter((item) => item.active && !item.done).length

  return (
    <div className="split-layout">
      <div className="stack">
        <Card className="hero-card">
          <CycleOrbitArt className="hero-orbit-art" size={310} />
          <div className="hero-copy">
            <div className="eyebrow">Seu ciclo hoje</div>
            <h2>{discreet ? 'Seu acompanhamento de hoje.' : `Você está na ${info.phaseName.toLowerCase()}.`}</h2>
            <p>Seu corpo muda todos os dias. Acompanhe cada sinal com leveza e descubra os padrões que fazem sentido para você.</p>
            <div className="hero-actions">
              <Link to="/app/menstruation" className="button button-primary"><AppIcon name="drop" size={17} /> Registrar menstruação</Link>
              <Link to="/app/cycle-calendar" className="button button-secondary"><AppIcon name="calendar" size={17} /> Ver calendário</Link>
            </div>
          </div>
          <div className="cycle-ring-layout">
            <ProgressRing progress={info.progress} value={info.day} label={`de ${info.length} dias`} sublabel="Dia do ciclo" />
            <div className="cycle-side-stats">
              <div className="cycle-side-stat"><span>Próxima menstruação</span><strong>{info.daysToNext} dias</strong></div>
              <div className="cycle-side-stat"><span>Ovulação estimada</span><strong>Dia {info.ovulationDay}</strong></div>
              <div className="cycle-side-stat"><span>Fase fértil</span><strong>{info.fertileStart}–{info.fertileEnd}</strong></div>
            </div>
          </div>
        </Card>

        <div className="grid grid-3">
          <StatCard icon="Droplet" label="Menstruação" value={`${info.daysToNext} dias`} hint={`Previsão ${nextPeriodDate}`} />
          <StatCard icon="Sparkles" label="Ovulação" value={info.daysToOvulation ? `Em ${info.daysToOvulation} dias` : 'Hoje'} hint={`Dia ${info.ovulationDay} do ciclo`} tone="purple" />
          <StatCard icon="HeartPulse" label="Fase atual" value={info.phaseName} hint="Acompanhe seus sinais" tone="green" />
        </div>

        <CyclePhaseTimeline info={{ ...info, periodLength: data.settings.periodLength }} />

        <Card>
          <SectionTitle title="Seu bem-estar" subtitle="Últimos sinais registrados" action={<Link to="/app/health" className="text-button">Ver saúde</Link>} />
          <div className="wellness-mini-grid">
            <div className="wellness-mini"><AppIcon name="thermometer" size={21} /><span>Temperatura da pele</span><strong>{latest.temperature || '36,4'} °C</strong></div>
            <div className="wellness-mini"><AppIcon name="health" size={21} /><span>Frequência cardíaca</span><strong>{latest.heartRate || 72} bpm</strong></div>
            <div className="wellness-mini"><AppIcon name="moon" size={21} /><span>Sono</span><strong>{String(latest.sleep || 7.3).replace('.', ',')} h</strong></div>
          </div>
        </Card>

        <div className="tip-card">
          <span className="icon-circle icon-peach"><AppIcon name="lightbulb" size={22} /></span>
          <div><h3>Dica do dia</h3><p>Manter água por perto ajuda na hidratação e pode trazer mais conforto em dias de inchaço. Pequenos goles, sem cobrança.</p></div>
        </div>
      </div>
      <div className="stack">
        <EventSidebar data={data} />
        <Card className="card-blush">
          <SectionTitle title="Resumo de hoje" />
          <div className="stack-tight">
            <ListRow icon="Activity" title={`Dia ${info.day} do ciclo`} description="Acompanhe sintomas e humor" meta="Hoje" />
            <ListRow icon="CalendarDays" title="Próxima menstruação" description={`Previsão ${nextPeriodDate}`} meta={`${info.daysToNext} dias`} tone="rose" />
            <ListRow icon="BellRing" title="Lembretes ativos" description={`${activeReminders} cuidados programados`} meta="Ver" tone="green" onClick={undefined} />
          </div>
        </Card>
        <Card className="info-callout">
          <span className="icon-circle icon-lavender"><AppIcon name="sparkles" size={22} /></span>
          <div><h3>Você está indo muito bem, {name.split(' ')[0]}!</h3><p>Registrar pequenos sinais ajuda a criar um histórico mais completo do seu ciclo.</p></div>
        </Card>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, currentUser, discreet } = useApp()
  const name = currentUser?.name || data.profile.name
  const today = formatDate(todayISO(), "EEEE, d 'de' MMMM 'de' yyyy")
  return (
    <div>
      <div className="dashboard-greeting">
        <div>
          <div className="eyebrow">{discreet ? 'Seu espaço' : ACTIVE_PHASE.label}</div>
          <h1>{discreet ? 'Olá!' : `Olá, ${name.split(' ')[0]}!`}</h1>
          <p>{discreet ? 'Seu acompanhamento está aqui, com discrição e no seu tempo.' : `${ACTIVE_PHASE.subtitle} — acompanhe seu ciclo e bem-estar hoje.`}</p>
        </div>
        <div className="dashboard-date"><AppIcon name="calendar" size={17} />{today}</div>
      </div>
      <ComfortStrip data={data} discreet={discreet} />
      <div style={{ height: 14 }} />
      <PeriodQuickCard data={data} />
      <div className="section-spacer" />
      <CycleDashboard data={data} name={name} discreet={discreet} />
      <DecorativeLeaf className="decorative-leaf" />
    </div>
  )
}
