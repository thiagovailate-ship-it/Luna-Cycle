import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useQuickLog } from '../hooks/useQuickLog.js'
import { addDaysISO, daysBetween, formatDate, relativeLabel, todayISO, uid } from '../lib/date.js'
import {
  CYCLE_LENGTH_LIMITS, PERIOD_LENGTH_LIMITS, getActivePeriod, getCurrentPhaseKey, getCycleInfo,
  getCycleIntervalPoints, getDayMeta, getPhaseDefinitions, getPredictedPeriodStarts, parseCycleSettings,
} from '../lib/cycle.js'
import CalendarView from '../components/CalendarView.jsx'
import { AppIcon } from '../components/AppIcon.jsx'
import { PeriodFlowArt } from '../components/CycleArt.jsx'
import {
  Badge, BarChart, Card, DurationInput, EmptyState, Field, Icon, IconCircle, LineChart, ListRow, Modal,
  PageHeader, SectionTitle, StatCard, Tabs,
} from '../components/ui.jsx'

const pageActions = (navigate) => ({
  onBack: () => navigate(-1),
})

export function CycleCalendarPage() {
  const { data, updateData, showToast, discreet } = useApp()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [reminderOpen, setReminderOpen] = useState(false)
  const [reminder, setReminder] = useState({ title: '', time: '09:00', category: 'Bem-estar' })

  const meta = getDayMeta(data, selectedDate)
  const dayEvents = useMemo(() => [
    ...(data.periodDays || []).filter((item) => item.date === selectedDate).map((item) => ({ id: item.id, type: 'Menstruação', title: `Fluxo ${item.flow.toLowerCase()}`, description: 'Registro do período', icon: 'Droplet', tone: 'rose' })),
    ...data.symptoms.filter((item) => item.date === selectedDate).map((item) => ({ id: item.id, type: 'Sintoma', title: item.label || item.type, description: `Intensidade ${item.intensity}/5`, icon: 'Stethoscope', tone: 'rose' })),
    ...data.reminders.filter((item) => item.date === selectedDate).map((item) => ({ id: item.id, type: 'Lembrete', title: item.title, description: `${item.time} · ${item.description || item.category}`, icon: 'BellRing', tone: 'green' })),
  ], [data, selectedDate])

  const upcoming = useMemo(() => [...data.reminders]
    .filter((item) => item.date >= todayISO() && item.active && !item.done)
    .sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`))
    .slice(0, 5), [data])

  const saveReminder = (event) => {
    event.preventDefault()
    if (!reminder.title.trim()) return
    updateData((current) => ({
      reminders: [...current.reminders, {
        id: uid('rem'), title: reminder.title.trim(), description: reminder.category, date: selectedDate,
        time: reminder.time, category: reminder.category, active: true, done: false,
      }],
    }))
    setReminder({ title: '', time: '09:00', category: 'Bem-estar' })
    setReminderOpen(false)
    showToast('Lembrete adicionado ao calendário.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Ciclo menstrual"
        title="Calendário do ciclo"
        description="Visualize menstruação, período fértil, ovulação e seus cuidados."
        back
        onBack={pageActions(navigate).onBack}
        actions={<>
          <button className="button button-secondary" onClick={() => setSelectedDate(todayISO())}><CalendarDays size={16} /> Hoje</button>
          <button className="button button-primary" onClick={() => setReminderOpen(true)}><Plus size={16} /> Adicionar lembrete</button>
        </>}
      />
      <div className="split-layout">
        <Card>
          <CalendarView data={data} selectedDate={selectedDate} onSelectDate={setSelectedDate} mode="cycle" />
        </Card>
        <div className="stack">
          <Card className="card-blush">
            <div className="row-between" style={{ marginBottom: 10 }}>
              <div><div className="eyebrow">Dia selecionado</div><h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 26 }}>{formatDate(selectedDate, "d 'de' MMMM")}</h2></div>
              <Badge tone={meta.isPeriod ? 'rose' : meta.isFertile ? 'green' : 'neutral'}>{discreet ? `Dia ${meta.cycleDay}` : meta.isPeriod ? 'Menstruação' : meta.isOvulation ? 'Ovulação' : meta.isFertile ? 'Fase fértil' : `Dia ${meta.cycleDay}`}</Badge>
            </div>
            <div className="day-detail-list">
              {dayEvents.length === 0 && <div className="info-callout"><IconCircle icon="Sparkles" tone="rose" /><div><h3>Tudo tranquilo por aqui</h3><p>Se quiser, registre um sintoma ou crie um lembrete. Sem obrigação.</p></div></div>}
              {dayEvents.map((event) => (
                <div className="day-detail-item" key={`${event.type}-${event.id}`}>
                  <IconCircle icon={event.icon} tone={event.tone} />
                  <div><strong>{event.title}</strong><small>{event.type} · {event.description}</small></div>
                </div>
              ))}
            </div>
            <div className="grid grid-2" style={{ gap: 8, marginTop: 12 }}>
              <Link to="/app/menstruation" className="button button-secondary button-small">Registrar menstruação</Link>
              <Link to="/app/symptoms" className="button button-secondary button-small">Registrar sintoma</Link>
            </div>
          </Card>
          <Card>
            <SectionTitle title="Próximos cuidados" action={<Link className="text-button" to="/app/reminders">Ver agenda</Link>} />
            <div className="stack-tight">
              {upcoming.map((event) => <ListRow key={event.id} icon="CalendarDays" title={event.title} description={`${formatDate(event.date, 'dd/MM')} · ${event.time || ''}`} meta={relativeLabel(event.date)} />)}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={reminderOpen} onClose={() => setReminderOpen(false)} title="Novo lembrete" description={`Para ${formatDate(selectedDate, 'dd/MM/yyyy')}`} footer={<>
        <button type="button" className="button button-secondary" onClick={() => setReminderOpen(false)}>Cancelar</button>
        <button type="submit" form="reminder-form" className="button button-primary">Salvar lembrete</button>
      </>}>
        <form id="reminder-form" className="stack-tight" onSubmit={saveReminder}>
          <Field label="Título" required><input value={reminder.title} onChange={(event) => setReminder({ ...reminder, title: event.target.value })} placeholder="Ex.: beber água, consulta, medicação" /></Field>
          <div className="form-grid">
            <Field label="Horário"><input type="time" value={reminder.time} onChange={(event) => setReminder({ ...reminder, time: event.target.value })} /></Field>
            <Field label="Categoria"><select value={reminder.category} onChange={(event) => setReminder({ ...reminder, category: event.target.value })}><option>Bem-estar</option><option>Ciclo</option><option>Sintomas</option><option>Medicação</option></select></Field>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function flowLevel(flow) {
  if (flow === 'Intenso') return 3
  if (flow === 'Moderado') return 2
  return 1
}

function PeriodFlowTracker({ data }) {
  const { savePeriodFlow } = useQuickLog()
  const active = getActivePeriod(data)
  if (!active) return null

  const totalDays = Math.max(active.duration || 5, data.settings.periodLength || 5)
  const days = Array.from({ length: totalDays }).map((_, index) => addDaysISO(active.startDate, index))
  const options = [
    { value: 'Leve', level: 1 },
    { value: 'Moderado', level: 2 },
    { value: 'Intenso', level: 3 },
  ]

  return (
    <Card className="flow-tracker-card">
      <SectionTitle title="Fluxo dia a dia" subtitle="Registre como foi cada dia do seu período" />
      <div className="flow-day-grid">
        {days.map((date, index) => {
          const record = (data.periodDays || []).find((item) => item.date === date)
          const flow = record?.flow || null
          const isFuture = date > todayISO()
          return (
            <div className={`flow-day ${isFuture ? 'is-future' : ''}`} key={date}>
              <div className="flow-day-head">
                <span>Dia {index + 1}</span>
                <small>{isFuture ? 'Em breve' : formatDate(date, 'dd/MM')}</small>
              </div>
              <PeriodFlowArt level={flow ? flowLevel(flow) : 2} />
              <div className="flow-options" role="group" aria-label={`Fluxo do dia ${index + 1}`}>
                {options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`flow-option ${flow === option.value ? 'active' : ''}`}
                    onClick={() => savePeriodFlow(date, option.value)}
                    aria-label={`${option.value} no dia ${index + 1}`}
                    title={option.value}
                    disabled={isFuture}
                  >
                    <PeriodFlowArt level={option.level} />
                    <small>{option.value}</small>
                  </button>
                ))}
              </div>
              {!flow && !isFuture && <small className="flow-empty-label">Toque para registrar</small>}
            </div>
          )
        })}
      </div>
      <p className="muted small flow-tracker-note"><AppIcon name="info" size={15} /> Cada registro pode ser desfeito. Use como apoio para conversar com sua profissional de saúde.</p>
    </Card>
  )
}

export function MenstruationPage() {
  const { data, updateData, showToast } = useApp()
  const { startPeriod } = useQuickLog()
  const navigate = useNavigate()
  const info = getCycleInfo(data)
  const active = getActivePeriod(data)
  const todayFlow = (data.periodDays || []).find((item) => item.date === todayISO())?.flow || active?.flow || 'Moderado'
  const [form, setForm] = useState({
    startDate: todayISO(),
    duration: String(data.settings.periodLength || 5),
    flow: 'Moderado',
    notes: '',
  })
  const history = [...data.cycle.entries].sort((a, b) => b.startDate.localeCompare(a.startDate))

  const save = (event) => {
    event.preventDefault()
    const entry = { id: uid('cycle'), startDate: form.startDate, duration: Number(form.duration), flow: form.flow, notes: form.notes }
    updateData((current) => {
      const exists = current.cycle.entries.some((item) => item.startDate === form.startDate)
      const existingFlow = (current.periodDays || []).find((item) => item.date === form.startDate)
      return {
        cycle: {
          ...current.cycle,
          entries: exists
            ? current.cycle.entries.map((item) => (item.startDate === form.startDate ? { ...entry, id: item.id } : item))
            : [entry, ...current.cycle.entries],
        },
        periodDays: [
          ...(current.periodDays || []).filter((item) => item.date !== form.startDate),
          { id: existingFlow?.id || uid('flow'), date: form.startDate, flow: form.flow },
        ],
        settings: { ...current.settings, periodLength: Number(form.duration) },
      }
    })
    showToast('Registro da menstruação salvo.')
  }

  const remove = (id) => {
    if (!window.confirm('Excluir este registro de menstruação?')) return
    const entry = data.cycle.entries.find((item) => item.id === id)
    if (!entry) return
    const duration = entry.duration || data.settings.periodLength || 5
    const entryDates = new Set(Array.from({ length: duration }).map((_, index) => addDaysISO(entry.startDate, index)))
    updateData((current) => ({
      cycle: { ...current.cycle, entries: current.cycle.entries.filter((item) => item.id !== id) },
      periodDays: (current.periodDays || []).filter((item) => !entryDates.has(item.date)),
    }))
    showToast('Registro excluído.')
  }

  const nextPeriodCopy = !info.day
    ? 'Registre o primeiro dia da sua menstruação para começar as previsões.'
    : info.isLate
      ? `A previsão era para ${formatDate(info.nextPeriod, "d 'de' MMMM")} — ${info.daysLate === 1 ? '1 dia atrás' : `${info.daysLate} dias atrás`}. Se ela chegou, registre para atualizar seu ciclo.`
      : `Faltam ${info.daysToNext} ${info.daysToNext === 1 ? 'dia' : 'dias'} para a próxima previsão. Se ela chegou antes, comece com um toque — você pode desfazer.`

  return (
    <div>
      <PageHeader eyebrow="Ciclo menstrual" title="Menstruação" description="Registre o início, acompanhe o fluxo dia a dia e melhore suas previsões." back onBack={() => navigate(-1)} />

      {active ? (
        <Card className="period-status-hero">
          <div className="period-status-art"><PeriodFlowArt level={flowLevel(todayFlow)} /></div>
          <div>
            <div className="eyebrow">Seu período está em andamento</div>
            <h2>Dia {active.day} da menstruação</h2>
            <p>Começou em {formatDate(active.startDate, "d 'de' MMMM")}. Fluxo de hoje: <strong data-sensitive>{todayFlow.toLowerCase()}</strong>. Registre cada dia para entender melhor seu corpo.</p>
          </div>
          <Badge tone="rose">Acompanhando</Badge>
        </Card>
      ) : (
        <Card className="period-start-hero">
          <span className="icon-circle icon-rose icon-large"><AppIcon name="drop" size={30} /></span>
          <div>
            <div className="eyebrow">Registro rápido</div>
            <h2>A menstruação começou hoje?</h2>
            <p>{nextPeriodCopy}</p>
          </div>
          <button type="button" className="button button-primary" onClick={startPeriod}><AppIcon name="check" size={17} /> Sim, começou hoje</button>
        </Card>
      )}

      <div style={{ height: 16 }} />
      <div className="split-layout">
        <div className="stack">
          <PeriodFlowTracker data={data} />
          <Card>
            <SectionTitle title="Registro da menstruação" subtitle="Os dados ajudam a melhorar suas previsões" />
            <form className="stack-tight" onSubmit={save}>
              <div className="form-grid">
                <Field label="Data de início" required><input type="date" value={form.startDate} max={todayISO()} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></Field>
                <Field label="Duração média"><select value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })}>{[2, 3, 4, 5, 6, 7, 8].map((value) => <option key={value} value={value}>{value} dias</option>)}</select></Field>
                <Field label="Fluxo"><select value={form.flow} onChange={(event) => setForm({ ...form, flow: event.target.value })}><option>Leve</option><option>Moderado</option><option>Intenso</option></select></Field>
                <Field label="Próxima previsão"><input value={formatDate(addDaysISO(form.startDate, info.length), 'dd/MM/yyyy')} readOnly /></Field>
              </div>
              <Field label="Observações"><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Como você se sentiu neste ciclo?" /></Field>
              <div className="row wrap">
                <button type="submit" className="button button-primary">Salvar registro</button>
                <button type="button" className="button button-secondary" onClick={startPeriod}>Registrar menstruação agora</button>
              </div>
            </form>
          </Card>
        </div>
        <div className="stack">
          <Card>
            <SectionTitle title="Histórico" subtitle={`${history.length} ${history.length === 1 ? 'ciclo registrado' : 'ciclos registrados'}`} />
            <div className="stack-tight">
              {history.length === 0 && (
                <EmptyState icon="drop" title="Seu histórico começa aqui" description="Registre o primeiro dia da menstruação para acompanhar a duração dos seus ciclos." />
              )}
              {history.map((entry) => (
                <div className="list-row" key={entry.id}>
                  <span className="icon-circle icon-rose"><AppIcon name="drop" size={20} /></span>
                  <span className="list-row-text"><strong>{formatDate(entry.startDate, "d 'de' MMMM 'de' yyyy")}</strong><small>{entry.duration} dias · Fluxo {entry.flow}</small></span>
                  <button className="icon-button" onClick={() => remove(entry.id)} aria-label="Excluir"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="info-callout"><span className="icon-circle icon-lavender"><AppIcon name="sparkles" size={20} /></span><div><h3>Você sabia?</h3><p>Registrar o primeiro dia da menstruação por alguns meses ajuda o Luna Cycle a identificar seu padrão pessoal.</p></div></Card>
        </div>
      </div>
    </div>
  )
}

const phaseDetails = {
  menstruation: {
    icon: 'drop',
    tone: 'rose',
    description: 'O endométrio se desprende e o ciclo recomeça. Cólicas, cansaço e fluxo variável são comuns — vale pegar mais leve.',
  },
  follicular: {
    icon: 'leaf',
    tone: 'green',
    description: 'Os folículos amadurecem e o estrogênio aumenta. A energia costuma subir e o corpo se prepara para ovular.',
  },
  ovulation: {
    icon: 'sparkles',
    tone: 'purple',
    description: 'Um óvulo é liberado e fica viável por cerca de 24 horas. É o pico da fase fértil — uma estimativa do seu ciclo.',
  },
  luteal: {
    icon: 'moon',
    tone: 'peach',
    description: 'A progesterona predomina e o corpo se prepara para uma nova menstruação. Inchaço, seios sensíveis e humor variável podem aparecer.',
  },
}

function CyclePhasesGuide({ info }) {
  const phases = getPhaseDefinitions(info).map((phase) => ({ ...phase, ...phaseDetails[phase.key] }))
  const current = getCurrentPhaseKey(info)
  const badge = !info.day
    ? 'Sem registro'
    : info.isLate
      ? `Dia ${info.day} · ${info.daysLate} ${info.daysLate === 1 ? 'dia' : 'dias'} de atraso`
      : `Dia ${info.day} de ${info.length}`
  const sourceNote = info.stats.source === 'history'
    ? `As fases usam a mediana dos seus últimos ${info.cycleCount} ${info.cycleCount === 1 ? 'ciclo' : 'ciclos'} (${info.length} dias) e podem variar a cada mês.`
    : `As fases usam a duração de referência de ${info.length} dias. Registre mais ciclos para personalizar a estimativa.`

  return (
    <Card className="cycle-phases-card">
      <SectionTitle
        title="Entenda as fases do seu ciclo"
        subtitle="O que acontece no corpo em cada etapa"
        action={<Badge tone="neutral">{badge}</Badge>}
      />
      <div className="cycle-phase-list">
        {phases.map((phase) => (
          <div className={`cycle-phase-row ${current === phase.key ? 'is-current' : ''}`} key={phase.key}>
            <IconCircle icon={phase.icon} tone={phase.tone} />
            <div className="cycle-phase-copy">
              <div className="cycle-phase-head">
                <strong>{phase.label}</strong>
                <span className="cycle-phase-range">{phase.range}</span>
                {current === phase.key && <Badge tone="rose">Você está aqui</Badge>}
              </div>
              <p>{phase.description}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="cycle-phase-note"><AppIcon name="info" size={14} /> {sourceNote} As previsões não substituem um método contraceptivo.</p>
    </Card>
  )
}

export function MyCyclePage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('summary')
  const [settings, setSettings] = useState({ cycleLength: String(data.settings.cycleLength), periodLength: String(data.settings.periodLength) })
  const [settingsError, setSettingsError] = useState(null)
  const history = [...data.cycle.entries].sort((a, b) => b.startDate.localeCompare(a.startDate))
  const info = getCycleInfo(data)
  const intervalPoints = useMemo(() => getCycleIntervalPoints(data), [data])
  const futureStarts = useMemo(
    () => getPredictedPeriodStarts(data, todayISO(), 8).filter((date) => date > todayISO()).slice(0, 3),
    [data],
  )
  const confidenceTone = info.confidence === 'alta' ? 'green' : info.confidence === 'média' ? 'yellow' : 'neutral'

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSettingsError(null)
  }

  const saveSettings = (event) => {
    event.preventDefault()
    const parsed = parseCycleSettings(settings)
    if (!parsed.ok) {
      setSettingsError(parsed)
      return
    }
    setSettings({ cycleLength: String(parsed.cycleLength), periodLength: String(parsed.periodLength) })
    updateData((current) => ({ settings: { ...current.settings, cycleLength: parsed.cycleLength, periodLength: parsed.periodLength } }))
    showToast('Preferências do ciclo atualizadas.')
  }

  return (
    <div>
      <PageHeader eyebrow="Ciclo menstrual" title="Meu ciclo" description="Entenda seu histórico, padrões e previsões." back onBack={() => navigate(-1)} actions={<Link to="/app/reports" className="button button-secondary"><Icon name="ChartColumn" size={16} /> Relatórios</Link>} />
      <Tabs items={[{ id: 'summary', label: 'Resumo' }, { id: 'history', label: 'Histórico' }, { id: 'forecast', label: 'Previsões' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      {tab === 'summary' && (
        <div className="stack">
          <div className="grid grid-4">
            <StatCard icon="CalendarDays" label="Duração do ciclo" value={`${info.length} dias`} hint={info.stats.source === 'history' ? `Mediana dos últimos ${info.cycleCount} ciclos` : 'Duração de referência'} />
            <StatCard icon="Droplet" label="Duração da menstruação" value={`${info.periodLength} dias`} hint="Duração média" tone="rose" />
            <StatCard icon="Heart" label="Fase fértil" value={`${info.fertileStart} ao ${info.fertileEnd}`} hint="Dias do ciclo" tone="green" />
            <StatCard icon="Sparkles" label="Ovulação estimada" value={`Dia ${info.ovulationDay}`} hint={`Confiança ${info.confidence}`} tone="purple" />
          </div>
          <CyclePhasesGuide info={info} />
          <div className="split-even">
            <Card>
              <SectionTitle
                title="Seu ciclo em números"
                subtitle={intervalPoints.length ? 'Intervalos entre os últimos registros' : 'Baseado nos seus registros'}
                action={<Badge tone={confidenceTone}>Confiança {info.confidence}</Badge>}
              />
              {intervalPoints.length > 0 ? (
                <BarChart
                  data={intervalPoints.map((point) => ({ label: formatDate(point.date, 'MMM').replace('.', ''), value: point.days }))}
                  suffix="d"
                />
              ) : (
                <EmptyState icon="chart" title="Ainda faltam registros" description="Com pelo menos dois inícios de menstruação, mostramos aqui a duração real dos seus ciclos." />
              )}
            </Card>
            <Card>
              <SectionTitle title="Ajustar meu ciclo" subtitle="Personalize as previsões" />
              <form className="stack-tight" onSubmit={saveSettings}>
                <div className="form-grid">
                  <Field label="Duração de referência" hint={`Entre ${CYCLE_LENGTH_LIMITS.min} e ${CYCLE_LENGTH_LIMITS.max} dias. Usada quando ainda não há histórico suficiente.`}>
                    <DurationInput value={settings.cycleLength} max={CYCLE_LENGTH_LIMITS.max} invalid={settingsError?.field === 'cycleLength'} onChange={(value) => updateSetting('cycleLength', value)} />
                  </Field>
                  <Field label="Duração da menstruação" hint={`Entre ${PERIOD_LENGTH_LIMITS.min} e ${PERIOD_LENGTH_LIMITS.max} dias.`}>
                    <DurationInput value={settings.periodLength} max={PERIOD_LENGTH_LIMITS.max} invalid={settingsError?.field === 'periodLength'} onChange={(value) => updateSetting('periodLength', value)} />
                  </Field>
                </div>
                {settingsError && <div className="error-message" role="alert">{settingsError.error}</div>}
                <button className="button button-primary" type="submit">Salvar preferências</button>
              </form>
            </Card>
          </div>
        </div>
      )}
      {tab === 'history' && (
        <Card>
          <SectionTitle title="Histórico de ciclos" subtitle="Cada intervalo mostra a duração real entre dois inícios" />
          <div className="stack-tight">
            {history.length === 0 && (
              <EmptyState icon="drop" title="Nenhum ciclo registrado" description="Comece registrando o primeiro dia da sua menstruação." action={<Link to="/app/menstruation" className="button button-primary">Registrar menstruação</Link>} />
            )}
            {history.map((entry, index) => {
              const previous = history[index + 1]
              const gap = previous ? daysBetween(entry.startDate, previous.startDate) : null
              return <ListRow key={entry.id} icon="CalendarDays" title={formatDate(entry.startDate, "MMMM 'de' yyyy")} description={`Iniciado em ${formatDate(entry.startDate, 'dd/MM')} · ${entry.duration} dias · fluxo ${entry.flow}`} meta={gap ? `${Math.round(gap)} dias de ciclo` : 'Registro inicial'} />
            })}
          </div>
        </Card>
      )}
      {tab === 'forecast' && (
        <div className="split-even">
          <Card className="center">
            <IconCircle icon="Sparkles" tone="lavender" size="large" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, margin: '14px 0 5px' }}>Próxima menstruação</h2>
            {!info.day ? (
              <EmptyState icon="calendar" title="Ainda sem previsão" description="Registre o primeiro dia da menstruação para começar a estimar os próximos ciclos." action={<Link to="/app/menstruation" className="button button-primary">Registrar agora</Link>} />
            ) : (
              <>
                <p className="muted small">Previsão para {formatDate(info.nextPeriod, "d 'de' MMMM 'de' yyyy")}</p>
                {info.stats.rangeDays > 0 && (
                  <p className="muted small">Janela provável: {formatDate(info.predictionStart, 'dd/MM')} a {formatDate(info.predictionEnd, 'dd/MM')}.</p>
                )}
                <Badge tone="rose">{info.isLate ? `Atrasada há ${info.daysLate} ${info.daysLate === 1 ? 'dia' : 'dias'}` : info.daysToNext === 0 ? 'Prevista hoje' : `Em ${info.daysToNext} ${info.daysToNext === 1 ? 'dia' : 'dias'}`}</Badge>
                {info.isLate && <p className="muted small" style={{ marginTop: 12 }}>Se a menstruação já chegou, registre para atualizar seu ciclo. Se o atraso continuar, vale conversar com uma profissional de saúde.</p>}
              </>
            )}
          </Card>
          <Card>
            <SectionTitle title="Próximas previsões" subtitle="Estimativas baseadas no seu padrão" />
            <div className="stack-tight">
              {futureStarts.length === 0 && (
                <EmptyState icon="calendar" title="Nada para prever ainda" description="As próximas datas aparecem depois do primeiro registro." />
              )}
              {futureStarts.map((date, index) => (
                <ListRow key={date} icon="Droplet" title={`Ciclo ${index + 1}`} description={`${formatDate(date, 'dd/MM/yyyy')} a ${formatDate(addDaysISO(date, info.periodLength - 1), 'dd/MM/yyyy')}`} meta={relativeLabel(date)} />
              ))}
              <div className="info-callout"><IconCircle icon="Info" tone="blue" /><div><h3>Previsões são estimativas</h3><p>Ciclos podem variar com estresse, sono, saúde e outros fatores. Use as previsões como apoio, não como método contraceptivo.</p></div></div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export function HealthPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('temperature')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ date: todayISO(), temperature: '36.5', heartRate: '72', sleep: '7.5', weight: '62.5', bloodPressure: '110/70' })
  const metrics = {
    temperature: { label: 'Temperatura da pele', key: 'temperature', unit: '°C', color: '#c7758a', icon: 'Thermometer' },
    heartRate: { label: 'Frequência cardíaca', key: 'heartRate', unit: 'bpm', color: '#d18a9a', icon: 'HeartPulse' },
    sleep: { label: 'Sono', key: 'sleep', unit: 'h', color: '#a897cf', icon: 'MoonStar' },
    weight: { label: 'Peso', key: 'weight', unit: 'kg', color: '#72aebf', icon: 'Scale' },
  }
  const metric = metrics[tab]
  const vitals = [...data.vitals].sort((a, b) => a.date.localeCompare(b.date))
  const latest = vitals[vitals.length - 1] || {}

  const saveVital = (event) => {
    event.preventDefault()
    const record = {
      id: uid('vital'), date: form.date, temperature: Number(form.temperature), heartRate: Number(form.heartRate),
      sleep: Number(form.sleep), weight: Number(form.weight), bloodPressure: form.bloodPressure,
    }
    updateData((current) => ({ vitals: [...current.vitals.filter((item) => item.date !== form.date), record].sort((a, b) => a.date.localeCompare(b.date)) }))
    setOpen(false)
    showToast('Dados de saúde registrados.')
  }

  return (
    <div>
      <PageHeader eyebrow="Bem-estar" title="Saúde" description="Acompanhe os sinais do seu corpo ao longo dos dias." back onBack={() => navigate(-1)} actions={<button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16} /> Registrar dados</button>} />
      <Tabs items={[{ id: 'temperature', label: 'Temperatura' }, { id: 'heartRate', label: 'Frequência cardíaca' }, { id: 'sleep', label: 'Sono' }, { id: 'weight', label: 'Peso' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      <div className="split-layout">
        <div className="stack">
          <Card>
            <div className="row-between"><div><div className="eyebrow">Últimos 12 registros</div><h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 27 }}>{metric.label}</h2></div><IconCircle icon={metric.icon} tone="rose" size="large" /></div>
            <div className="vital-display"><strong>{String(latest[metric.key] ?? '—').replace('.', ',')} <span style={{ fontFamily: 'var(--font-sans)', fontSize: 18 }}>{metric.unit}</span></strong><span>Último registro: {formatDate(latest.date || form.date, 'dd/MM/yyyy')}</span></div>
            <LineChart data={vitals} lines={[{ key: metric.key, label: metric.label, color: metric.color }]} unit={metric.unit} />
          </Card>
          <Card className="info-callout"><IconCircle icon="Lightbulb" tone="peach" /><div><h3>Você sabia?</h3><p>{tab === 'temperature' ? 'A temperatura da pele tende a aumentar após a ovulação e continua elevada durante a fase lútea.' : tab === 'sleep' ? 'Manter horários regulares de sono ajuda no equilíbrio hormonal.' : 'Pequenas variações são normais. Observe tendências, não apenas um único registro.'}</p></div></Card>
        </div>
        <div className="stack">
          <Card className="card-blush">
            <SectionTitle title="Resumo atual" />
            <div className="grid grid-2" style={{ gap: 9 }}>
              <StatCard icon="Thermometer" label="Temperatura" value={`${String(latest.temperature || '—').replace('.', ',')} °C`} />
              <StatCard icon="HeartPulse" label="Cardíaca" value={`${latest.heartRate || '—'} bpm`} tone="rose" />
              <StatCard icon="MoonStar" label="Sono" value={`${String(latest.sleep || '—').replace('.', ',')} h`} tone="purple" />
              <StatCard icon="Scale" label="Peso" value={`${String(latest.weight || '—').replace('.', ',')} kg`} tone="green" />
            </div>
          </Card>
          <Card>
            <SectionTitle title="Últimos registros" />
            <div className="stack-tight">
              {[...vitals].reverse().slice(0, 6).map((item) => <ListRow key={item.id} icon="Activity" title={formatDate(item.date, 'dd/MM/yyyy')} description={`${item.temperature} °C · ${item.heartRate} bpm · ${item.sleep} h de sono`} meta={`${item.weight} kg`} />)}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Registrar dados de saúde" description="Você pode editar um dia existente usando a mesma data." footer={<>
        <button type="button" className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button>
        <button type="submit" form="vital-form" className="button button-primary">Salvar dados</button>
      </>}>
        <form id="vital-form" className="form-grid" onSubmit={saveVital}>
          <Field label="Data" className="form-grid-full"><input type="date" value={form.date} max={todayISO()} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field>
          <Field label="Temperatura da pele (°C)"><input type="number" step="0.1" value={form.temperature} onChange={(event) => setForm({ ...form, temperature: event.target.value })} /></Field>
          <Field label="Frequência cardíaca (bpm)"><input type="number" value={form.heartRate} onChange={(event) => setForm({ ...form, heartRate: event.target.value })} /></Field>
          <Field label="Sono (horas)"><input type="number" step="0.1" value={form.sleep} onChange={(event) => setForm({ ...form, sleep: event.target.value })} /></Field>
          <Field label="Peso (kg)"><input type="number" step="0.1" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} /></Field>
          <Field label="Pressão arterial" className="form-grid-full"><input value={form.bloodPressure} onChange={(event) => setForm({ ...form, bloodPressure: event.target.value })} placeholder="110/70" /></Field>
        </form>
      </Modal>
    </div>
  )
}
