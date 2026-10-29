import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarPlus, Heart, Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { WELLNESS_ARTICLES } from '../data/seed.js'
import { formatDate, MOODS, relativeLabel, todayISO, uid } from '../lib/date.js'
import { getPregnancyInfo } from '../lib/cycle.js'
import CalendarView from '../components/CalendarView.jsx'
import { BabyArt, DecorativeLeaf } from '../components/Art.jsx'
import { AppIcon } from '../components/AppIcon.jsx'
import { Card, EmptyState, Field, Icon, IconCircle, ListRow, Modal, PageHeader, Pill, SectionTitle, StatCard } from '../components/ui.jsx'
import { ALL_LINKS } from '../data/navigation.js'

const categories = ['Todos', 'Alimentação', 'Exercício', 'Sono', 'Saúde mental', 'Ciclo']

function ArticleLibrary({ title, eyebrow, description, hero }) {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [category, setCategory] = useState('Todos')
  const [activeArticle, setActiveArticle] = useState(null)
  const articles = category === 'Todos' ? WELLNESS_ARTICLES : WELLNESS_ARTICLES.filter((article) => article.category === category)
  const favorites = data.favorites || []

  const toggleFavorite = (id) => {
    updateData((current) => ({ favorites: current.favorites.includes(id) ? current.favorites.filter((item) => item !== id) : [...current.favorites, id] }))
    showToast(favorites.includes(id) ? 'Removido dos favoritos.' : 'Salvo nos favoritos.')
  }

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} back onBack={() => navigate(-1)} />
      {hero && (
        <Card className="page-banner" style={{ marginBottom: 18 }}>
          <div><div className="eyebrow">Bem-estar</div><h2>Pequenos hábitos, grandes mudanças.</h2><p>Cuide do seu corpo e da sua mente. Você merece se sentir bem!</p></div>
          <DecorativeLeaf className="page-banner-art" />
        </Card>
      )}
      <div className="row wrap" style={{ marginBottom: 18 }}>
        {categories.map((item) => <Pill key={item} active={category === item} onClick={() => setCategory(item)}>{item}</Pill>)}
      </div>
      <div className="grid grid-3">
        {articles.map((article) => (
          <button type="button" className="article-card" key={article.id} onClick={() => setActiveArticle(article)}>
            <IconCircle icon={article.icon} tone={article.color} />
            <span className="article-card-text"><strong>{article.title}</strong><small>{article.description}</small></span>
            <Icon name="ChevronRight" size={17} />
          </button>
        ))}
      </div>
      {articles.length === 0 && <Card><EmptyState icon="Search" title="Nenhuma dica nesta categoria" description="Escolha outra categoria para continuar explorando." /></Card>}

      <Modal open={Boolean(activeArticle)} onClose={() => setActiveArticle(null)} title={activeArticle?.title || ''} description={activeArticle?.category} footer={<>
        {activeArticle && <button className={`button ${favorites.includes(activeArticle.id) ? 'button-danger' : 'button-secondary'}`} onClick={() => toggleFavorite(activeArticle.id)}><Heart size={16} fill={favorites.includes(activeArticle.id) ? 'currentColor' : 'none'} />{favorites.includes(activeArticle.id) ? 'Remover dos favoritos' : 'Salvar dica'}</button>}
        <button className="button button-primary" onClick={() => setActiveArticle(null)}>Concluir</button>
      </>}>
        {activeArticle && (
          <div className="stack">
            <div className="article-hero"><AppIcon name={activeArticle.icon} size={76} strokeWidth={1.5} /></div>
            <p style={{ color: 'var(--text-soft)', fontSize: 13, lineHeight: 1.7 }}>{activeArticle.body}</p>
            <div className="info-callout"><IconCircle icon="Info" tone="blue" /><div><h3>Lembre-se</h3><p>Este conteúdo é informativo e não substitui acompanhamento profissional individualizado.</p></div></div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export function WellnessPage() {
  return <ArticleLibrary eyebrow="Ciclo menstrual · Bem-estar" title="Bem-estar" description="Crie hábitos simples para cuidar do corpo e da mente em cada fase do ciclo." hero />
}

export function TipsPage() {
  return <ArticleLibrary eyebrow="Dicas e orientações" title="Dicas para você" description="Conteúdos práticos para entender e acolher seu ciclo menstrual." />
}

export function DiaryPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ date: todayISO(), mood: 4, title: '', text: '', tags: '' })
  const entries = [...data.diary].sort((a, b) => b.date.localeCompare(a.date))

  const openNew = () => {
    setEditing(null)
    setForm({ date: todayISO(), mood: 4, title: '', text: '', tags: '' })
    setOpen(true)
  }

  const openEdit = (entry) => {
    setEditing(entry.id)
    setForm({ date: entry.date, mood: entry.mood, title: entry.title, text: entry.text, tags: (entry.tags || []).join(', ') })
    setOpen(true)
  }

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const record = {
      id: editing || uid('diary'),
      date: form.date,
      mood: Number(form.mood),
      title: form.title.trim(),
      text: form.text.trim(),
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
    }
    updateData((current) => ({ diary: editing ? current.diary.map((item) => item.id === editing ? record : item) : [record, ...current.diary] }))
    setOpen(false)
    showToast(editing ? 'Registro atualizado.' : 'Momento registrado no diário.')
  }

  const remove = (id) => {
    if (!window.confirm('Excluir este registro do diário?')) return
    updateData((current) => ({ diary: current.diary.filter((item) => item.id !== id) }))
    showToast('Registro excluído.')
  }

  return (
    <div>
      <PageHeader eyebrow="Memórias da gestação" title="Diário" description="Registre emoções, descobertas e momentos especiais." back onBack={() => navigate(-1)} actions={<button className="button button-primary" onClick={openNew}><Plus size={16} /> Novo registro</button>} />
      <div className="split-layout">
        <Card>
          <SectionTitle title="Registre aqui seus pensamentos" subtitle="Seu espaço pessoal de memórias" />
          <div className="stack" style={{ marginTop: 22 }}>
            {entries.length === 0 && <EmptyState icon="BookHeart" title="Seu diário está em branco" description="Comece registrando um momento especial da sua jornada." action={<button className="button button-primary" onClick={openNew}>Criar primeiro registro</button>} />}
            {entries.map((entry) => (
              <article className="diary-entry" key={entry.id}>
                <div className="diary-meta">
                  <span>{formatDate(entry.date, "d 'de' MMMM 'de' yyyy")}</span>
                  <span>·</span>
                  <span>{MOODS.find((item) => item.value === entry.mood)?.emoji} {MOODS.find((item) => item.value === entry.mood)?.label}</span>
                </div>
                <div className="row-between"><h3 data-sensitive>{entry.title}</h3><div className="row" style={{ gap: 2 }}>
                  <button className="icon-button" onClick={() => openEdit(entry)} aria-label="Editar"><Pencil size={15} /></button>
                  <button className="icon-button" onClick={() => remove(entry.id)} aria-label="Excluir"><Trash2 size={15} /></button>
                </div></div>
                <p>{entry.text}</p>
                {entry.tags?.length > 0 && <div className="tag-cloud" style={{ marginTop: 10 }}>{entry.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
              </article>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Card className="card-blush center"><IconCircle icon="Heart" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, margin: '13px 0 5px' }}>Cada momento importa</h3><p className="muted small">Escrever sobre suas emoções pode ajudar a viver essa fase com mais leveza.</p></Card>
          <Card><SectionTitle title="Seu diário em números" /><div className="stack-tight"><ListRow icon="BookHeart" title="Registros" description="Momentos guardados" meta={entries.length} /><ListRow icon="CalendarDays" title="Último registro" description={entries[0] ? formatDate(entries[0].date, 'dd/MM/yyyy') : '—'} meta={entries[0] ? relativeLabel(entries[0].date) : ''} tone="green" /><ListRow icon="Smile" title="Humor médio" description=" Entre 1 e 5" meta={entries.length ? (entries.reduce((sum, item) => sum + item.mood, 0) / entries.length).toFixed(1) : '—'} tone="purple" /></div></Card>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar registro' : 'Novo registro'} description="Um espaço só seu, sem julgamentos." footer={<>
        <button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button>
        <button type="submit" form="diary-form" className="button button-primary">Salvar registro</button>
      </>}>
        <form id="diary-form" className="stack-tight" onSubmit={save}>
          <div className="form-grid">
            <Field label="Data"><input type="date" value={form.date} max={todayISO()} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field>
            <Field label="Humor"><select value={form.mood} onChange={(event) => setForm({ ...form, mood: event.target.value })}>{MOODS.map((item) => <option key={item.value} value={item.value}>{item.emoji} {item.label}</option>)}</select></Field>
          </div>
          <Field label="Título" required><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Um dia especial" /></Field>
          <Field label="Como foi esse momento?" required><textarea value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} placeholder="Escreva livremente..." /></Field>
          <Field label="Tags" hint="Separe por vírgulas"><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="Gratidão, consulta, marco" /></Field>
        </form>
      </Modal>
    </div>
  )
}

export function BabyPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const info = getPregnancyInfo(data)
  const [dueDate, setDueDate] = useState(data.pregnancy.dueDate)
  const milestones = [
    { icon: 'Activity', title: 'Movimentos mais frequentes', description: 'O bebê se movimenta com mais força.' },
    { icon: 'Brain', title: 'Desenvolvimento do cérebro', description: 'As conexões neurológicas avançam.' },
    { icon: 'Ear', title: 'Formação dos primeiros sons', description: 'O bebê começa a reconhecer sons.' },
  ]

  const saveDate = () => {
    updateData((current) => ({ pregnancy: { ...current.pregnancy, dueDate } }))
    showToast('Data prevista do parto atualizada.')
  }

  const toggleFavorite = () => {
    updateData((current) => ({ pregnancy: { ...current.pregnancy, favorite: !current.pregnancy.favorite } }))
  }

  return (
    <div>
      <PageHeader eyebrow="Gravidez" title="Meu bebê" description={`Semana ${info.week} da gestação`} back onBack={() => navigate(-1)} actions={<button className={`button ${data.pregnancy.favorite ? 'button-primary' : 'button-secondary'}`} onClick={toggleFavorite}><Heart size={16} fill={data.pregnancy.favorite ? 'currentColor' : 'none'} /> {data.pregnancy.favorite ? 'Favorito' : 'Favoritar'}</button>} />
      <div className="split-layout">
        <div className="stack">
          <Card className="baby-hero">
            <div>
              <div className="baby-week"><span>{info.week}</span> Semana {info.week} ({info.week}+{info.days})</div>
              <h2>Conheça seu bebê</h2>
              <p className="muted small">Nesta fase, os ossos continuam se fortalecendo, os sentidos se desenvolvem e o bebê já movimenta bastante!</p>
              <div className="baby-progress"><span style={{ width: `${info.progress}%` }} /></div>
              <div className="row-between small muted"><span>{formatDate(data.pregnancy.startDate, 'dd/MM/yyyy')}</span><strong>{info.progress}% concluído</strong></div>
              <div className="baby-measures">
                <div className="baby-measure"><span>Comprimento</span><strong>{info.sizeCm.toFixed(0)} cm</strong><small className="muted">cerca de um abacate</small></div>
                <div className="baby-measure"><span>Peso</span><strong>{info.weightG} g</strong><small className="muted">cerca de uma maçã</small></div>
              </div>
            </div>
            <BabyArt className="baby-art" />
          </Card>
          <Card>
            <SectionTitle title="O que esperar" subtitle={`Marcos da semana ${info.week}`} />
            <div className="stack-tight">{milestones.map((item) => <ListRow key={item.title} icon={item.icon} title={item.title} description={item.description} meta={<Icon name="ChevronRight" size={16} />} />)}</div>
          </Card>
        </div>
        <div className="stack">
          <Card className="card-blush">
            <SectionTitle title="Minha gestação" subtitle="Informações importantes" />
            <div className="stack-tight">
              <StatCard icon="CalendarDays" label="Trimestre" value={`${info.trimester}º`} hint="Em andamento" />
              <StatCard icon="Baby" label="Semana" value={info.week} hint={`${info.days} dias completos`} tone="rose" />
              <StatCard icon="Sparkles" label="Dias de jornada" value={info.day} hint="Desde o início" tone="green" />
            </div>
          </Card>
          <Card>
            <SectionTitle title="Data prevista do parto" />
            <Field label="Atualize sua previsão"><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></Field>
            <button className="button button-primary button-block" style={{ marginTop: 12 }} onClick={saveDate}>Salvar data</button>
          </Card>
          <Card className="info-callout"><IconCircle icon="Info" tone="blue" /><div><h3>Estimativas</h3><p>Tamanho e peso são aproximados. O acompanhamento pré-natal é a fonte mais confiável de informação.</p></div></Card>
        </div>
      </div>
    </div>
  )
}

export function PregnancyCalendarPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', time: '10:00', professional: '', location: '' })
  const selectedEvents = useMemo(() => [
    ...data.appointments.filter((item) => item.date === selectedDate),
    ...data.exams.filter((item) => item.date === selectedDate),
    ...data.reminders.filter((item) => item.date === selectedDate),
  ], [data, selectedDate])

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    updateData((current) => ({
      appointments: [...current.appointments, {
        id: uid('app'), title: form.title.trim(), date: selectedDate, time: form.time,
        professional: form.professional, location: form.location, status: 'Agendado',
      }],
    }))
    setOpen(false)
    setForm({ title: '', time: '10:00', professional: '', location: '' })
    showToast('Compromisso adicionado ao calendário.')
  }

  return (
    <div>
      <PageHeader eyebrow="Gravidez" title="Calendário" description="Consultas, exames, tarefas e momentos especiais." back onBack={() => navigate(-1)} actions={<button className="button button-primary" onClick={() => setOpen(true)}><CalendarPlus size={16} /> Novo compromisso</button>} />
      <div className="split-layout">
        <Card><CalendarView data={data} selectedDate={selectedDate} onSelectDate={setSelectedDate} mode="events" /></Card>
        <div className="stack">
          <Card className="card-blush">
            <SectionTitle title={formatDate(selectedDate, "d 'de' MMMM")} subtitle={`${selectedEvents.length} compromisso(s)`} />
            <div className="stack-tight">
              {selectedEvents.length === 0 && <p className="muted small center">Nenhum compromisso para este dia.</p>}
              {selectedEvents.map((event) => <div className="day-detail-item" key={event.id}><IconCircle icon="CalendarDays" tone="rose" /><div><strong>{event.title}</strong><small>{event.time || 'Sem horário'} · {event.location || event.unit || event.description || event.category}</small></div></div>)}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Próximas consultas" action={<Link className="text-button" to="/app/exams">Ver exames</Link>} />
            <div className="stack-tight">{[...data.appointments].filter((item) => item.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map((item) => <ListRow key={item.id} icon="Stethoscope" title={item.title} description={`${item.time} · ${item.professional}`} meta={relativeLabel(item.date)} />)}</div>
          </Card>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Novo compromisso" description={`Para ${formatDate(selectedDate, 'dd/MM/yyyy')}`} footer={<><button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button><button type="submit" form="appointment-form" className="button button-primary">Salvar</button></>}>
        <form id="appointment-form" className="stack-tight" onSubmit={save}>
          <Field label="Título" required><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: consulta pré-natal" /></Field>
          <div className="form-grid"><Field label="Horário"><input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></Field><Field label="Profissional"><input value={form.professional} onChange={(event) => setForm({ ...form, professional: event.target.value })} placeholder="Dra. Mariana" /></Field></div>
          <Field label="Local"><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Clínica ou hospital" /></Field>
        </form>
      </Modal>
    </div>
  )
}

export function MoreMenuPage() {
  const navigate = useNavigate()
  const groups = useMemo(() => {
    const map = new Map()
    ALL_LINKS.forEach((link) => {
      if (!map.has(link.group)) map.set(link.group, [])
      map.get(link.group).push(link)
    })
    return [...map.entries()]
  }, [])
  return (
    <div>
      <PageHeader eyebrow="Navegação" title="Mais" description="Todas as áreas do seu ciclo em um só lugar." back onBack={() => navigate(-1)} />
      <div className="stack">
        {groups.map(([group, links]) => (
          <Card key={group}>
            <SectionTitle title={group} />
            <div className="more-grid">
              {links.map((link) => <Link className="more-link" key={link.to} to={link.to}><AppIcon name={link.icon} size={23} /><span>{link.label}</span></Link>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
