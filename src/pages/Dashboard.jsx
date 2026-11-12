import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { PHASE_MAP } from '../data/seed.js'
import { formatDate, MOODS, relativeLabel, todayISO } from '../lib/date.js'
import { getActivePeriod, getCurrentPhaseKey, getCycleInfo, getPhaseDefinitions, getPregnancyInfo } from '../lib/cycle.js'
import { useQuickLog } from '../hooks/useQuickLog.js'
import { BabyArt, DecorativeLeaf } from '../components/Art.jsx'
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

const PHASE_ICONS = {
  menstruation: 'drop',
  follicular: 'leaf',
  ovulation: 'sparkles',
  luteal: 'moon',
}

function CyclePhaseTimeline({ info }) {
  const phases = getPhaseDefinitions(info).map((phase) => {
    const short = phase.label.replace('Fase ', '')
    return {
      ...phase,
      display: short.charAt(0).toUpperCase() + short.slice(1),
      icon: PHASE_ICONS[phase.key],
    }
  })
  const current = getCurrentPhaseKey(info)

  return (
    <Card className="phase-timeline-card">
      <SectionTitle title="As fases do seu ciclo" subtitle="Uma visão simples do momento atual" action={<Link to="/app/my-cycle" className="text-button">Entender meu ciclo</Link>} />
      <div className="phase-timeline">
        {phases.map((phase) => (
          <div className={`phase-timeline-item ${current === phase.key ? 'active' : ''}`} key={phase.key}>
            <span className="phase-timeline-icon"><AppIcon name={phase.icon} size={21} /></span>
            <strong>{phase.display}</strong>
            <small>{phase.range}</small>
          </div>
        ))}
      </div>
    </Card>
  )
}

function countDays(value) {
  return `${value} ${value === 1 ? 'dia' : 'dias'}`
}

function nextPeriodLabel(info) {
  if (!info.day) return 'Sem registro'
  if (info.isLate) return `Atrasada há ${countDays(info.daysLate)}`
  if (info.daysToNext === 0) return 'Prevista hoje'
  return countDays(info.daysToNext)
}

function periodHint(info) {
  if (!info.day) return 'Registre sua menstruação'
  if (info.isLate) return `Previsão era ${formatDate(info.nextPeriod, 'dd/MM')}`
  if (info.stats.rangeDays > 0) {
    return `Previsão ${formatDate(info.nextPeriod, 'dd/MM')} · ±${info.stats.rangeDays} dias`
  }
  return `Previsão ${formatDate(info.nextPeriod, 'dd/MM')}`
}

function ovulationLabel(info) {
  if (!info.day) return '—'
  if (info.daysToOvulation === 0) return 'Hoje'
  if (info.daysToOvulation > 0) return `Em ${countDays(info.daysToOvulation)}`
  return 'Já passou'
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
            <h2>{discreet ? 'Seu acompanhamento de hoje.' : info.day ? `Você está na ${info.phaseName.toLowerCase()}.` : 'Vamos começar pelo seu primeiro registro.'}</h2>
            <p>Seu corpo muda todos os dias. Acompanhe cada sinal com leveza e descubra os padrões que fazem sentido para você.</p>
            <div className="hero-actions">
              <Link to="/app/menstruation" className="button button-primary"><AppIcon name="drop" size={17} /> Registrar menstruação</Link>
              <Link to="/app/cycle-calendar" className="button button-secondary"><AppIcon name="calendar" size={17} /> Ver calendário</Link>
            </div>
          </div>
          <div className="cycle-ring-layout">
            <ProgressRing
              progress={info.progress}
              value={info.day || '—'}
              label={info.day ? (info.isLate ? `previsão era dia ${info.length}` : `de ${info.length} dias`) : 'sem registro'}
              sublabel="Dia do ciclo"
            />
            <div className="cycle-side-stats">
              <div className="cycle-side-stat"><span>Próxima menstruação</span><strong>{nextPeriodLabel(info)}</strong></div>
              <div className="cycle-side-stat"><span>Ovulação estimada</span><strong>Dia {info.ovulationDay}</strong></div>
              <div className="cycle-side-stat"><span>Fase fértil</span><strong>{info.fertileStart}–{info.fertileEnd}</strong></div>
            </div>
          </div>
        </Card>

        <div className="grid grid-3">
          <StatCard icon="Droplet" label="Menstruação" value={nextPeriodLabel(info)} hint={periodHint(info)} />
          <StatCard icon="Sparkles" label="Ovulação" value={ovulationLabel(info)} hint={`Dia ${info.ovulationDay} do ciclo`} tone="purple" />
          <StatCard icon="HeartPulse" label="Fase atual" value={info.phaseName} hint={info.isLate ? 'Previsão ultrapassada' : info.day ? `Dia ${info.day} do ciclo` : 'Sem registro'} tone="green" />
        </div>

        <CyclePhaseTimeline info={{ ...info, periodLength: data.settings.periodLength }} />

        <Card>
          <SectionTitle title="Seu bem-estar" subtitle="Últimos sinais registrados" action={<Link to="/app/health" className="text-button">Ver saúde</Link>} />
          <div className="wellness-mini-grid">
            <div className="wellness-mini"><AppIcon name="thermometer" size={21} /><span>Temperatura da pele</span><strong>{latest.temperature ? `${String(latest.temperature).replace('.', ',')} °C` : '—'}</strong></div>
            <div className="wellness-mini"><AppIcon name="health" size={21} /><span>Frequência cardíaca</span><strong>{latest.heartRate ? `${latest.heartRate} bpm` : '—'}</strong></div>
            <div className="wellness-mini"><AppIcon name="moon" size={21} /><span>Sono</span><strong>{latest.sleep ? `${String(latest.sleep).replace('.', ',')} h` : '—'}</strong></div>
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
            <ListRow icon="Activity" title={info.day ? `Dia ${info.day} do ciclo` : 'Ciclo sem registro'} description="Acompanhe sintomas e humor" meta="Hoje" />
            <ListRow icon="CalendarDays" title="Próxima menstruação" description={`Previsão ${nextPeriodDate}`} meta={nextPeriodLabel(info)} tone="rose" />
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

function useUpcomingAppointments(data) {
  return useMemo(() => {
    const today = todayISO()
    return [...(data.appointments || [])]
      .filter((item) => item.date >= today && item.status !== 'Cancelado')
      .sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`))
      .slice(0, 3)
  }, [data])
}

function PregnancyDashboard({ data, discreet }) {
  const info = getPregnancyInfo(data)
  const upcoming = useUpcomingAppointments(data)
  const weeksLeft = Math.max(0, 40 - info.week)

  return (
    <div className="pregnancy-dashboard">
      <div className="stack">
        <Card className="pregnancy-hero">
          <div className="pregnancy-hero-top">
            <div className="pregnancy-embryo"><BabyArt className="pregnancy-embryo-art" /></div>
            <div className="pregnancy-hero-copy">
              <div className="pregnancy-week-badge">
                <strong>{discreet ? '•' : info.week}</strong>
                <span>Semanas</span>
              </div>
              <span className="pregnancy-trimester">{info.trimesterLabel}</span>
              <span className="pregnancy-range">
                {formatDate(info.trimesterStart, 'dd/MM/yyyy')} – {formatDate(info.trimesterEnd, 'dd/MM/yyyy')}
              </span>
              <div className="pregnancy-progress-row">
                <div
                  className="pregnancy-progress"
                  role="progressbar"
                  aria-label="Progresso da gestação"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={info.progress}
                >
                  <span style={{ width: `${info.progress}%` }} />
                </div>
                <strong>{info.progress}%</strong>
              </div>
            </div>
          </div>
          <p className="pregnancy-hero-summary" data-sensitive>
            {discreet
              ? 'Seu bebê segue crescendo. Abra quando estiver à vontade.'
              : <>Seu bebê tem aproximadamente <strong>{info.sizeCm.toFixed(0)} cm</strong> e pesa <strong>{info.weightG} g</strong>. <AppIcon name="heart" size={14} /></>}
          </p>
        </Card>

        <div className="pregnancy-actions">
          <Link className="pregnancy-action" to="/app/baby">
            <span className="pregnancy-action-icon"><AppIcon name="Baby" size={23} /></span>
            <span>Bebê da semana</span>
          </Link>
          <Link className="pregnancy-action" to="/app/health">
            <span className="pregnancy-action-icon"><AppIcon name="heart" size={23} /></span>
            <span>Minha saúde</span>
          </Link>
          <Link className="pregnancy-action" to="/app/symptoms">
            <span className="pregnancy-action-icon"><AppIcon name="symptoms" size={23} /></span>
            <span>Sintomas</span>
          </Link>
          <Link className="pregnancy-action" to="/app/calendar">
            <span className="pregnancy-action-icon"><AppIcon name="calendar" size={23} /></span>
            <span>Exames e consultas</span>
          </Link>
        </div>

        <div className="tip-card pregnancy-tip">
          <span className="icon-circle icon-rose"><AppIcon name="drop" size={23} /></span>
          <div>
            <h3>Dica do dia</h3>
            <p>Hidrate-se! A água ajuda na circulação e no bem-estar da mãe e do bebê. Tenha uma garrafa por perto e beba em pequenos goles ao longo do dia.</p>
          </div>
        </div>

        <Card className="pregnancy-consult-card">
          <SectionTitle
            title="Próximas consultas"
            subtitle="Sua agenda de acompanhamento"
            action={<Link className="text-button" to="/app/calendar">Ver agenda</Link>}
          />
          {upcoming.length === 0 ? (
            <div className="pregnancy-empty">
              <span className="icon-circle icon-rose"><AppIcon name="calendar" size={22} /></span>
              <div>
                <strong>Nenhuma consulta agendada</strong>
                <p>Adicione consultas e exames pelo calendário para acompanhar cada etapa.</p>
              </div>
              <Link className="button button-secondary button-small" to="/app/calendar">Agendar</Link>
            </div>
          ) : (
            <div className="consult-list">
              {upcoming.map((item) => (
                <Link className="consult-row" to="/app/calendar" key={item.id}>
                  <span className="consult-icon"><AppIcon name="calendar" size={21} /></span>
                  <span className="consult-copy">
                    <strong>{item.title}</strong>
                    <small>{formatDate(item.date, "d 'de' MMMM 'de' yyyy")} • {item.time || 'Sem horário'}</small>
                  </span>
                  <Icon name="ChevronRight" size={16} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="stack">
        <Card className="card-blush pregnancy-week-card">
          <SectionTitle title="Sua semana" subtitle={`Semana ${info.week} · ${info.trimesterLabel}`} />
          <div className="pregnancy-week-stats">
            <div><span>Semana</span><strong>{info.week}</strong><small>{info.weekLabel}</small></div>
            <div><span>Faltam</span><strong>{weeksLeft}</strong><small>{weeksLeft === 1 ? 'semana' : 'semanas'}</small></div>
            <div><span>DPP</span><strong>{formatDate(info.dueDate, 'dd/MM')}</strong><small>{formatDate(info.dueDate, 'yyyy')}</small></div>
          </div>
          <Link to="/app/baby" className="button button-primary button-block">
            Ver meu bebê <Icon name="ArrowUpRight" size={15} />
          </Link>
        </Card>
        <Card className="info-callout">
          <span className="icon-circle icon-lavender"><AppIcon name="sparkles" size={22} /></span>
          <div>
            <h3>Um dia de cada vez</h3>
            <p>O pré-natal é a melhor fonte de informação sobre a sua gestação. Tamanho e peso são estimativas.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, currentUser, discreet, phase } = useApp()
  const name = currentUser?.name || data.profile.name
  const activePhase = PHASE_MAP[phase] || PHASE_MAP.cycle
  const today = formatDate(todayISO(), "EEEE, d 'de' MMMM 'de' yyyy")
  const pregnant = phase === 'pregnancy'
  return (
    <div>
      <div className="dashboard-greeting">
        <div>
          <div className="eyebrow">{discreet ? 'Seu espaço' : activePhase.label}</div>
          <h1>{discreet ? 'Olá!' : `Olá, ${name.split(' ')[0]}!`}</h1>
          <p>
            {discreet
              ? 'Seu acompanhamento está aqui, com discrição e no seu tempo.'
              : pregnant
                ? <>Sua jornada de gestação está indo muito bem. <span className="pregnancy-heart"><AppIcon name="heart" size={14} /></span></>
                : `${activePhase.subtitle} — acompanhe seu ciclo e bem-estar hoje.`}
          </p>
        </div>
        {!pregnant && <div className="dashboard-date"><AppIcon name="calendar" size={17} />{today}</div>}
      </div>
      {pregnant ? (
        <PregnancyDashboard data={data} discreet={discreet} />
      ) : (
        <>
          <ComfortStrip data={data} discreet={discreet} />
          <div style={{ height: 14 }} />
          <PeriodQuickCard data={data} />
          <div className="section-spacer" />
          <CycleDashboard data={data} name={name} discreet={discreet} />
        </>
      )}
      <DecorativeLeaf className="decorative-leaf" />
    </div>
  )
}
