import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BatteryFull, Download, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { SYMPTOM_OPTIONS } from '../data/seed.js'
import { formatDate, MOODS, todayISO, uid } from '../lib/date.js'
import { getHormoneSeries, getSymptomStats } from '../lib/cycle.js'
import { BraceletArt } from '../components/Art.jsx'
import { AppIcon } from '../components/AppIcon.jsx'
import { Badge, BarChart, Card, Field, Icon, IconCircle, LineChart, ListRow, Modal, PageHeader, SectionTitle, StatCard, Tabs } from '../components/ui.jsx'

export function DevicesPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const connected = data.settings.deviceConnected && data.devices.connected
  const latest = data.vitals[data.vitals.length - 1] || {}

  const toggle = () => {
    updateData((current) => ({
      settings: { ...current.settings, deviceConnected: !connected },
      devices: { ...current.devices, connected: !connected, lastSync: todayISO() },
    }))
    showToast(connected ? 'Pulseira desconectada.' : 'Pulseira conectada com sucesso.')
  }

  return (
    <div>
      <PageHeader eyebrow="Dispositivos" title="Dispositivos" description="Conecte sua pulseira Luna Cycle para acompanhar seus sinais." back onBack={() => navigate(-1)} />
      <div className="split-even">
        <Card className="center">
          <div className="eyebrow">Luna Cycle wearable</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, marginBottom: 5 }}>Conecte sua pulseira</h2>
          <p className="muted small">A pulseira coleta dados importantes como temperatura da pele, frequência cardíaca, sono e muito mais.</p>
          <div className="device-visual"><BraceletArt /></div>
          <div className="device-status">
            <span className="status-dot" style={{ background: connected ? '#65b184' : '#c98b91' }} />
            <strong>{connected ? 'Conectado' : 'Desconectado'}</strong>
            <span>Bateria: {data.devices.battery}%</span>
            <BatteryFull size={17} color={connected ? '#65b184' : '#c98b91'} />
          </div>
          <div className="row wrap" style={{ justifyContent: 'center', marginTop: 16 }}>
            <button className={`button ${connected ? 'button-secondary' : 'button-primary'}`} onClick={toggle}>{connected ? 'Desconectar' : 'Conectar pulseira'}</button>
            <button className="button button-secondary" onClick={() => navigate('/app/health')}>Ver dados da pulseira</button>
          </div>
        </Card>
        <div className="stack">
          <Card>
            <SectionTitle title="Dados sincronizados" subtitle={`Última sincronização: ${formatDate(data.devices.lastSync, 'dd/MM/yyyy')}`} />
            <div className="grid grid-2">
              <StatCard icon="Thermometer" label="Temperatura" value={`${String(latest.temperature || '—').replace('.', ',')} °C`} />
              <StatCard icon="HeartPulse" label="Frequência" value={`${latest.heartRate || '—'} bpm`} tone="rose" />
              <StatCard icon="MoonStar" label="Sono" value={`${String(latest.sleep || '—').replace('.', ',')} h`} tone="purple" />
              <StatCard icon="Activity" label="Registros" value={data.vitals.length} hint="Coletados" tone="green" />
            </div>
          </Card>
          <Card className="info-callout"><IconCircle icon="Lightbulb" tone="peach" /><div><h3>Dica</h3><p>Use a pulseira ao longo do dia para acompanhar temperatura, sono e frequência cardíaca em cada fase do seu ciclo.</p></div></Card>
          <Card className="card-blush center"><IconCircle icon="Watch" tone="rose" size="large" /><h3 style={{ margin: '12px 0 5px' }}>Sincronização automática</h3><p className="muted small">Nesta versão, os dados são simulados e ficam salvos localmente no seu navegador.</p></Card>
        </div>
      </div>
    </div>
  )
}

export function SymptomsPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('today')
  const [selected, setSelected] = useState(['cramps'])
  const [intensity, setIntensity] = useState(3)
  const [mood, setMood] = useState(3)
  const [notes, setNotes] = useState('')
  const stats = getSymptomStats(data)
  const sorted = [...data.symptoms].sort((a, b) => b.date.localeCompare(a.date))
  const filtered = tab === 'today' ? sorted.filter((item) => item.date === todayISO()) : tab === 'history' ? sorted.filter((item) => item.date < todayISO()).slice(0, 12) : sorted

  const toggleSymptom = (id) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const save = () => {
    if (!selected.length) return showToast('Selecione ao menos um sintoma.', 'error')
    const records = selected.map((type, index) => ({
      id: `${uid('symptom')}-${index}`,
      date: todayISO(),
      type,
      label: SYMPTOM_OPTIONS.find((option) => option.id === type)?.label || type,
      intensity,
      mood,
      notes,
    }))
    updateData((current) => ({ symptoms: [...records, ...current.symptoms] }))
    setSelected([])
    setNotes('')
    showToast(`${records.length} sintoma(s) registrado(s) hoje.`)
  }

  const remove = (id) => {
    if (!window.confirm('Excluir este registro de sintoma?')) return
    updateData((current) => ({ symptoms: current.symptoms.filter((item) => item.id !== id) }))
    showToast('Registro excluído.')
  }

  const intensitySeries = [...data.symptoms].sort((a, b) => a.date.localeCompare(b.date)).slice(-12).map((item) => ({ intensity: item.intensity }))

  return (
    <div>
      <PageHeader eyebrow="Acompanhamento" title="Sintomas" description="Escolha o que faz sentido para você hoje. Não precisa registrar tudo." back onBack={() => navigate(-1)} actions={<Link to="/app/reports" className="button button-secondary"><Icon name="ChartColumn" size={16} /> Ver relatórios</Link>} />
      <Tabs items={[{ id: 'today', label: 'Hoje' }, { id: 'history', label: 'Histórico' }, { id: 'all', label: 'Todos' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      <div className="split-layout">
        <div className="stack">
          <Card>
            <SectionTitle title="Como você está se sentindo hoje?" subtitle="Selecione os sintomas que estiverem presentes" />
            <div className="symptom-grid">
              {SYMPTOM_OPTIONS.map((option) => (
                <button type="button" key={option.id} className={`symptom-option tone-${option.tone} ${selected.includes(option.id) ? 'active' : ''}`} onClick={() => toggleSymptom(option.id)}>
                  <span className="symptom-option-icon"><AppIcon name={option.icon} size={22} /></span><span>{option.label}</span>
                </button>
              ))}
            </div>
            <div className="divider" />
            <div className="form-grid">
              <Field label="Humor">
                <select value={mood} onChange={(event) => setMood(Number(event.target.value))}>{MOODS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
              </Field>
              <Field label={`Intensidade: ${intensity}/5`}>
                <input type="range" min="1" max="5" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
                <div className="slider-labels"><span>Leve</span><span>Moderado</span><span>Intenso</span></div>
              </Field>
            </div>
            <Field label="Observações" className="stack-tight" hint="Opcional"><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Descreva como você se sentiu..." /></Field>
            <button type="button" className="button button-primary" style={{ marginTop: 14 }} onClick={save}><Icon name="Check" size={16} /> Salvar registro de hoje</button>
          </Card>
          <Card>
            <SectionTitle title="Histórico de sintomas" subtitle={`${filtered.length} registros`} />
            <div className="stack-tight">
              {filtered.length === 0 && <p className="muted small center">Nenhum sintoma neste período.</p>}
              {filtered.map((item) => (
                <div className="list-row" key={item.id}>
                  <IconCircle icon="Stethoscope" tone={item.intensity >= 4 ? 'rose' : 'neutral'} />
                  <span className="list-row-text"><strong>{item.label || item.type}</strong><small>{formatDate(item.date, 'dd/MM/yyyy')} · intensidade {item.intensity}/5 · humor {item.mood}/5</small></span>
                  <Badge tone={item.intensity >= 4 ? 'danger' : item.intensity >= 3 ? 'yellow' : 'green'}>{item.intensity >= 4 ? 'Forte' : item.intensity >= 3 ? 'Médio' : 'Leve'}</Badge>
                  <button className="icon-button" onClick={() => remove(item.id)} aria-label="Excluir"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="stack">
          <Card>
            <SectionTitle title="Intensidade dos sintomas" subtitle="Últimos registros" />
            <LineChart data={intensitySeries} lines={[{ key: 'intensity', label: 'Intensidade', color: '#c7758a' }]} minValue={0} maxValue={5} labels={5} />
          </Card>
          <Card className="card-blush">
            <SectionTitle title="Sintomas frequentes" />
            <div className="stack-tight">
              {stats.slice(0, 6).map((item) => (
                <div className="row-between" key={item.label}><span className="small">{item.label}</span><Badge tone="rose">{item.count} registros</Badge></div>
              ))}
            </div>
          </Card>
          <Card className="info-callout"><IconCircle icon="Info" tone="blue" /><div><h3>Acompanhe os padrões</h3><p>Registros frequentes ajudam você e sua equipe de saúde a identificar gatilhos e avaliar tratamentos.</p></div></Card>
        </div>
      </div>
    </div>
  )
}

export function HormonesPage() {
  const { data } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('hormones')
  const [aboutOpen, setAboutOpen] = useState(false)
  const series = getHormoneSeries('cycle')
  const latest = data.vitals[data.vitals.length - 1] || {}
  const weight = Number(latest.weight || 62.5)
  const bmi = (weight / (1.62 * 1.62)).toFixed(1)

  return (
    <div>
      <PageHeader eyebrow="Saúde hormonal" title="Saúde hormonal" description="Entenda as mudanças hormonais ao longo do seu ciclo." back onBack={() => navigate(-1)} />
      <Tabs items={[{ id: 'hormones', label: 'Hormônios' }, { id: 'body', label: 'Composição corporal' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      {tab === 'hormones' ? (
        <div className="split-layout">
          <Card>
            <SectionTitle title="Seus hormônios" subtitle="Estimativa baseada na fase atual" action={<Badge tone="rose">Ciclo menstrual</Badge>} />
            <div className="chart-wrap" style={{ paddingTop: 10 }}>
              <LineChart data={series} lines={[{ key: 'estrogen', label: 'Estrogênio', color: '#c7758a' }, { key: 'progesterone', label: 'Progesterona', color: '#a897cf' }, { key: 'fsh', label: 'FSH', color: '#72aebf' }]} height={230} labels={4} />
              <div className="row-between small muted" style={{ marginTop: 12 }}><span>Menstruação</span><span>Folicular</span><span>Ovulação</span><span>Lútea</span></div>
            </div>
          </Card>
          <div className="stack">
            <Card className="card-blush">
              <SectionTitle title="Entenda sua fase" />
              <p className="small muted" style={{ lineHeight: 1.6 }}>Ao longo do ciclo, estrogênio e progesterona se alternam para preparar o corpo para uma possível gestação. Essas variações podem influenciar energia, humor, sono e temperatura.</p>
              <button className="button button-secondary button-block" style={{ marginTop: 12 }} onClick={() => setAboutOpen(true)}>Ver mais sobre hormônios</button>
            </Card>
            <Card className="info-callout"><IconCircle icon="Info" tone="rose" /><div><h3>Importante</h3><p>Os gráficos são apenas educativos e não substituem exames laboratoriais nem orientação médica.</p></div></Card>
          </div>
        </div>
      ) : (
        <div className="stack">
          <div className="grid grid-4">
            <StatCard icon="Scale" label="Peso atual" value={`${String(weight).replace('.', ',')} kg`} hint="Último registro" />
            <StatCard icon="Activity" label="IMC estimado" value={bmi} hint="Para 1,62 m" tone="rose" />
            <StatCard icon="Droplets" label="Água corporal" value="52%" hint="Estimativa" tone="blue" />
            <StatCard icon="HeartPulse" label="Massa magra" value="42%" hint="Estimativa" tone="green" />
          </div>
          <Card>
            <SectionTitle title="Evolução do peso" subtitle="Últimos registros" />
            <LineChart data={[...data.vitals].sort((a, b) => a.date.localeCompare(b.date))} lines={[{ key: 'weight', label: 'Peso (kg)', color: '#72aebf' }]} height={200} unit="kg" />
          </Card>
        </div>
      )}
      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="Como os hormônios mudam" description="Uma visão simples e educativa" footer={<button className="button button-primary" onClick={() => setAboutOpen(false)}>Entendi</button>}>
        <div className="stack-tight">
          <div className="info-callout"><IconCircle icon="Sparkles" tone="rose" /><div><h3>Estrogênio</h3><p>Participa do ciclo menstrual, da saúde óssea, da temperatura corporal e do humor.</p></div></div>
          <div className="info-callout"><IconCircle icon="MoonStar" tone="lavender" /><div><h3>Progesterona</h3><p>Prepara o útero para uma possível gestação e influencia sono, relaxamento e temperatura.</p></div></div>
          <div className="info-callout"><IconCircle icon="Activity" tone="blue" /><div><h3>FSH</h3><p>Hormônio folículo-estimulante. Costuma aumentar quando a função ovariana diminui.</p></div></div>
        </div>
      </Modal>
    </div>
  )
}

export function ReportsPage() {
  const { data, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('symptoms')
  const stats = getSymptomStats(data)
  const hormone = getHormoneSeries('cycle')
  const vitals = useMemo(() => [...data.vitals].sort((a, b) => a.date.localeCompare(b.date)), [data.vitals])
  const monthlySymptoms = useMemo(() => {
    const months = Array.from({ length: 3 }).map((_, index) => {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - (2 - index))
      return { key: formatDate(d, 'yyyy-MM'), label: formatDate(d, 'MMM').replace('.', '') }
    })
    return months.map((month) => ({
      label: month.label[0].toUpperCase() + month.label.slice(1),
      value: data.symptoms.filter((item) => item.date.startsWith(month.key)).length,
    }))
  }, [data.symptoms])

  const exportCsv = () => {
    const rows = [
      ['tipo', 'data', 'titulo', 'detalhes'],
      ...data.symptoms.map((item) => ['sintoma', item.date, item.label || item.type, `intensidade ${item.intensity}; humor ${item.mood}`]),
      ...data.cycle.entries.map((item) => ['ciclo', item.startDate, 'Menstruação', `${item.duration} dias; fluxo ${item.flow}`]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n')
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `luna-cycle-relatorio-${todayISO()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Relatório CSV exportado.')
  }

  return (
    <div>
      <PageHeader eyebrow="Análises" title="Relatórios" description="Visualize tendências do seu ciclo, sintomas e bem-estar." back onBack={() => navigate(-1)} actions={<button className="button button-secondary" onClick={exportCsv}><Download size={16} /> Exportar CSV</button>} />
      <Tabs items={[{ id: 'symptoms', label: 'Sintomas' }, { id: 'hormones', label: 'Hormônios' }, { id: 'weight', label: 'Peso' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      {tab === 'symptoms' && (
        <div className="split-layout">
          <div className="stack">
            <Card>
              <SectionTitle title="Resumo dos últimos 3 meses" subtitle="Frequência de sintomas registrados" />
              <BarChart data={monthlySymptoms} color="var(--rose)" height={210} />
            </Card>
            <Card className="card-blush"><SectionTitle title="Principais sintomas" /><div className="stack-tight">{stats.slice(0, 7).map((item) => <div className="row-between" key={item.label}><span className="small">{item.label}</span><div className="row"><div style={{ width: `${Math.min(160, item.count * 14)}px`, height: 8, borderRadius: 99, background: 'var(--rose)' }} /><small className="muted">{item.count}</small></div></div>)}</div></Card>
          </div>
          <Card>
            <SectionTitle title="Leitura dos dados" />
            <div className="stack-tight">
              <ListRow icon="ChartColumn" title={`${data.symptoms.length} registros`} description="Sintomas no histórico" />
              <ListRow icon="Stethoscope" title={stats[0]?.label || 'Sem dados'} description="Sintoma mais frequente" meta={`${stats[0]?.count || 0}x`} tone="rose" />
              <ListRow icon="CalendarDays" title="3 meses" description="Período analisado" tone="green" />
            </div>
            <div className="info-callout" style={{ marginTop: 16 }}><IconCircle icon="Lightbulb" tone="peach" /><div><h3>Dica</h3><p>Leve este relatório às suas consultas. Ele ajuda a mostrar padrões que nem sempre lembramos.</p></div></div>
          </Card>
        </div>
      )}
      {tab === 'hormones' && (
        <Card>
          <SectionTitle title="Tendência hormonal estimada" subtitle="Gráfico educativo da fase atual" />
          <LineChart data={hormone} lines={[{ key: 'estrogen', label: 'Estrogênio', color: '#c7758a' }, { key: 'progesterone', label: 'Progesterona', color: '#a897cf' }, { key: 'fsh', label: 'FSH', color: '#72aebf' }]} height={240} />
        </Card>
      )}
      {tab === 'weight' && (
        <div className="split-even">
          <Card><SectionTitle title="Evolução do peso" subtitle="Últimos registros" /><LineChart data={vitals} lines={[{ key: 'weight', label: 'Peso (kg)', color: '#72aebf' }]} height={220} unit="kg" /></Card>
          <Card className="card-blush center"><IconCircle icon="Scale" tone="blue" size="large" /><h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '12px 0 4px' }}>{String(vitals[vitals.length - 1]?.weight || '—').replace('.', ',')} kg</h2><p className="muted small">Peso atual registrado</p><Badge tone="green">Acompanhamento ativo</Badge></Card>
        </div>
      )}
    </div>
  )
}
