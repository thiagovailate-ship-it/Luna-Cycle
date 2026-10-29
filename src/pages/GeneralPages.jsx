import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Accessibility, BellRing, Check, CircleHelp, CloudDownload, Contrast, Download, EyeOff,
  FileUp, LockKeyhole, LogOut, Pencil, Plus, RefreshCw, Trash2, Type,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { addDaysISO, daysBetween, formatDate, relativeLabel, todayISO, uid } from '../lib/date.js'
import { BACKUP_MIN_PASSPHRASE, decryptBackup, encryptBackup, isEncryptedBackup } from '../lib/backup.js'
import { Avatar, Badge, Card, EmptyState, Field, Icon, IconCircle, ListRow, Modal, PageHeader, SectionTitle, Tabs, Toggle } from '../components/ui.jsx'
import { BrowserAlertsToggle } from '../components/Pwa.jsx'

const emptyReminder = { title: '', description: '', date: addDaysISO(todayISO(), 1), time: '09:00', category: 'Ciclo' }

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function RemindersPage() {
  const { data, updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyReminder)
  const reminders = [...data.reminders].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const filtered = tab === 'all' ? reminders : reminders.filter((item) => item.category === tab)

  const openNew = () => {
    setEditing(null)
    setForm(emptyReminder)
    setOpen(true)
  }
  const openEdit = (item) => {
    setEditing(item.id)
    setForm({ title: item.title, description: item.description || '', date: item.date, time: item.time, category: item.category })
    setOpen(true)
  }
  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const record = { ...form, id: editing || uid('rem'), active: true, done: false }
    updateData((current) => ({ reminders: editing ? current.reminders.map((item) => item.id === editing ? { ...item, ...record } : item) : [...current.reminders, record] }))
    setOpen(false)
    showToast(editing ? 'Lembrete atualizado.' : 'Lembrete criado.')
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
      <PageHeader eyebrow="Rotina de cuidados" title="Lembretes" description="Organize registros do ciclo, sintomas, medicações e hábitos saudáveis." back onBack={() => navigate(-1)} actions={<button className="button button-primary" onClick={openNew}><Plus size={16} /> Adicionar lembrete</button>} />
      <Tabs items={[{ id: 'all', label: 'Todos' }, { id: 'Ciclo', label: 'Ciclo' }, { id: 'Sintomas', label: 'Sintomas' }, { id: 'Medicação', label: 'Medicação' }, { id: 'Bem-estar', label: 'Bem-estar' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />
      <div className="split-layout">
        <Card>
          <SectionTitle title="Seus lembretes" subtitle={`${filtered.length} item(ns)`} />
          <div className="stack-tight">
            {filtered.length === 0 && <EmptyState icon="BellRing" title="Nada pendente por aqui" description="Se precisar, crie um lembrete com calma." action={<button className="button button-primary" onClick={openNew}>Criar lembrete</button>} />}
            {filtered.map((item) => (
              <div className={`reminder-card ${item.done ? 'done' : ''}`} key={item.id}>
                <button className={`icon-button ${item.done ? 'button-primary' : ''}`} onClick={() => toggleDone(item.id)} aria-label="Concluir"><Check size={16} /></button>
                <div className="reminder-content"><strong data-sensitive>{item.title}</strong><small>{formatDate(item.date, 'dd/MM/yyyy')} · {item.time} · {item.description || item.category}</small></div>
                <Badge tone={item.done ? 'green' : item.active ? 'rose' : 'neutral'}>{item.done ? 'Concluído' : item.active ? 'Ativo' : 'Pausado'}</Badge>
                <button className="icon-button" onClick={() => openEdit(item)} aria-label="Editar"><Pencil size={15} /></button>
                <button className="icon-button" onClick={() => toggleActive(item.id)} aria-label="Pausar"><Icon name={item.active ? 'Pause' : 'Play'} size={15} /></button>
                <button className="icon-button" onClick={() => remove(item.id)} aria-label="Excluir"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Card className="card-blush"><SectionTitle title="Hoje" subtitle="Não se esqueça de cuidar de você" /><div className="stack-tight">{reminders.filter((item) => item.date === todayISO()).map((item) => <ListRow key={item.id} icon={item.category === 'Medicação' ? 'Pill' : 'BellRing'} title={item.title} description={item.time} meta={item.done ? 'Feito' : 'Pendente'} />)}</div></Card>
          <Card><SectionTitle title="Resumo" /><div className="stack-tight"><ListRow icon="BellRing" title="Ativos" description="Lembretes em andamento" meta={reminders.filter((item) => item.active && !item.done).length} /><ListRow icon="Check" title="Concluídos" description="Cuidados realizados" meta={reminders.filter((item) => item.done).length} tone="green" /></div></Card>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar lembrete' : 'Novo lembrete'} description="Defina quando você quer ser lembrada." footer={<><button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button><button type="submit" form="reminder-form" className="button button-primary">Salvar</button></>}>
        <form id="reminder-form" className="stack-tight" onSubmit={save}>
          <Field label="Título" required><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: tomar vitamina D" /></Field>
          <Field label="Descrição"><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Detalhes" /></Field>
          <div className="form-grid"><Field label="Data"><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field><Field label="Horário"><input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></Field></div>
          <Field label="Categoria"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Ciclo</option><option>Sintomas</option><option>Medicação</option><option>Bem-estar</option></select></Field>
        </form>
      </Modal>
    </div>
  )
}

export function NotificationsPage() {
  const { data, updateData, markAllNotificationsRead, markNotificationRead, clearNotifications, showToast, discreet } = useApp()
  const navigate = useNavigate()
  const items = [...data.notifications].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
  const unread = items.filter((item) => !item.read).length
  const settings = data.settings.notifications
  const updateSetting = (key, value) => updateData((current) => ({ settings: { ...current.settings, notifications: { ...current.settings.notifications, [key]: value } } }))

  return (
    <div>
      <PageHeader eyebrow="Central de avisos" title="Notificações" description="Acompanhe novidades, lembretes e resultados." back onBack={() => navigate(-1)} actions={<><button className="button button-secondary" onClick={markAllNotificationsRead}><Check size={16} /> Marcar todas</button><button className="button button-danger" onClick={() => { if (window.confirm('Limpar todas as notificações?')) clearNotifications() }}><Trash2 size={16} /> Limpar</button></>} />
      <div className="split-layout">
        <Card>
          <SectionTitle title="Todas as notificações" subtitle={`${unread} não lida(s)`} />
          <div className="stack-tight">
            {items.length === 0 && <EmptyState icon="Bell" title="Tudo em dia por aqui" description="Suas notificações aparecerão neste espaço." />}
            {items.map((item) => (
              <button type="button" className={`list-row clickable ${item.read ? '' : 'card-blush'}`} key={item.id} onClick={() => markNotificationRead(item.id)}>
                <IconCircle icon={item.category === 'Exame' ? 'FlaskConical' : item.category === 'Consulta' ? 'CalendarDays' : 'Bell'} tone={item.read ? 'neutral' : 'rose'} />
                <span className="list-row-text"><strong data-sensitive>{discreet ? 'Você tem um aviso' : item.title}</strong><small>{discreet ? 'Abra quando estiver à vontade.' : item.description}</small></span>
                <span className="list-row-meta">{relativeLabel(item.date)}<br />{item.time}</span>
                {!item.read && <Badge tone="rose">Nova</Badge>}
              </button>
            ))}
          </div>
        </Card>
        <div className="stack">
          <Card className="card-blush"><SectionTitle title="Preferências" subtitle="Escolha o que deseja receber" /><div className="stack-tight">
            <BrowserAlertsToggle />
            <Toggle label="Lembretes" description="Ciclo, sintomas e medicações" checked={settings.reminders} onChange={(value) => updateSetting('reminders', value)} />
            <Toggle label="Registro de sintomas (em breve)" description="Lembrete diário de check-in" checked={Boolean(settings.symptoms)} disabled onChange={() => {}} />
            <Toggle label="Dicas do dia (em breve)" description="Conteúdos de bem-estar" checked={Boolean(settings.tips)} disabled onChange={() => {}} />
            <Toggle label="E-mail (em breve)" description="Ainda não enviamos e-mails nesta versão" checked={Boolean(settings.email)} disabled onChange={() => {}} />
            <Toggle label="Sons (em breve)" description="Alertas sonoros ainda não estão disponíveis" checked={Boolean(settings.sound)} disabled onChange={() => {}} />
          </div></Card>
          <Card><SectionTitle title="Testar notificação" /><p className="muted small">Crie uma notificação local para conferir a central de avisos.</p><button className="button button-primary button-block" style={{ marginTop: 12 }} onClick={() => { updateData((current) => ({ notifications: [{ id: uid('notif'), title: 'Notificação de teste', description: 'Tudo funcionando por aqui!', date: todayISO(), time: new Date().toTimeString().slice(0, 5), read: false, category: 'Teste' }, ...current.notifications] })); showToast('Notificação de teste criada.') }}><BellRing size={16} /> Criar notificação</button></Card>
        </div>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { data, currentUser, updateProfile, updateData, logout, showToast } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...data.profile })
  const profile = data.profile
  const lastBackup = data.settings.lastBackupAt
  const hasRecords = data.cycle.entries.length + data.symptoms.length + data.reminders.length > 0
  const backupDue = hasRecords && (!lastBackup || daysBetween(todayISO(), lastBackup) >= 30)

  const save = (event) => {
    event.preventDefault()
    updateProfile(form)
    setOpen(false)
    showToast('Perfil atualizado.')
  }
  const doLogout = () => {
    logout()
    navigate('/welcome', { replace: true })
  }
  const exportData = () => {
    downloadJson({ version: 1, exportedAt: new Date().toISOString(), data }, `luna-cycle-backup-${todayISO()}.json`)
    updateData((current) => ({ settings: { ...current.settings, lastBackupAt: todayISO() } }))
    showToast('Cópia simples exportada. Para proteger com senha, use Configurações → Dados.')
  }

  return (
    <div>
      <PageHeader eyebrow="Sua conta" title="Perfil" description="Gerencie suas informações e preferências." actions={<button className="button button-secondary" onClick={() => setOpen(true)}><Pencil size={16} /> Editar perfil</button>} />
      <div className="split-layout">
        <div className="stack">
          <div className="profile-hero"><Avatar name={profile.name} size={76} /><div className="grow"><h2 data-sensitive>{profile.name}</h2><p data-sensitive>{profile.email}</p><div className="row wrap" style={{ marginTop: 8 }}><Badge tone="rose">{currentUser?.demo ? 'Conta demonstração' : 'Conta local'}</Badge><Badge tone="neutral">{profile.city || 'Brasil'}</Badge></div></div><IconCircle icon="UserRound" tone="rose" size="large" /></div>
          <Card><SectionTitle title="Minha conta" /><div className="stack-tight">
            <ListRow icon="CalendarDays" title="Meu ciclo" description="Duração, histórico e previsões" meta={<Icon name="ChevronRight" size={16} />} onClick={() => navigate('/app/my-cycle')} />
            <ListRow icon="Bell" title="Notificações" description="Preferências e alertas" meta={<Icon name="ChevronRight" size={16} />} onClick={() => navigate('/app/notifications')} tone="blue" />
            <ListRow icon="Watch" title="Dispositivos conectados" description="Pulseira Luna Cycle" meta={<Icon name="ChevronRight" size={16} />} onClick={() => navigate('/app/devices')} tone="green" />
            <ListRow icon="ShieldCheck" title="Privacidade e segurança" description="Seus dados no navegador" meta={<Icon name="ChevronRight" size={16} />} onClick={() => navigate('/app/settings')} tone="purple" />
            <ListRow icon="Info" title="Sobre o Luna Cycle" description="Versão 2.0.0" meta={<Icon name="ChevronRight" size={16} />} onClick={() => navigate('/app/about')} />
            <ListRow icon="CircleHelp" title="Ajuda e suporte" description="Perguntas frequentes" meta={<Icon name="ChevronRight" size={16} />} onClick={() => navigate('/app/support')} tone="peach" />
          </div></Card>
        </div>
        <div className="stack">
          {backupDue && (
            <Card className="card-blush">
              <SectionTitle title="Proteja sua cópia" subtitle="Seus dados vivem só neste navegador" />
              <p className="muted small" style={{ marginTop: 0 }}>Exporte um backup protegido para não perder seus registros ao limpar o navegador ou trocar de dispositivo.</p>
              <button className="button button-primary button-block" onClick={() => navigate('/app/settings', { state: { tab: 'data' } })}><CloudDownload size={16} /> Ir para backup</button>
            </Card>
          )}
          <Card className="card-blush center"><IconCircle icon="Heart" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, margin: '13px 0 5px' }}>Você está fazendo um ótimo trabalho!</h3><p className="muted small">Cuide de você com amor. Cada pequeno registro conta.</p></Card>
          <Card><SectionTitle title="Seus dados" /><div className="stack-tight"><ListRow icon="Stethoscope" title="Sintomas registrados" description="Histórico de bem-estar" meta={data.symptoms.length} /><ListRow icon="Droplet" title="Registros de menstruação" description="Histórico do ciclo" meta={data.cycle.entries.length} tone="blue" /><ListRow icon="BellRing" title="Lembretes" description="Rotina de cuidados" meta={data.reminders.length} tone="green" /></div></Card>
          <Card><SectionTitle title="Conta" /><button className="button button-secondary button-block" onClick={exportData}><Download size={16} /> Baixar cópia simples (JSON)</button><button className="button button-danger button-block" style={{ marginTop: 9 }} onClick={doLogout}><LogOut size={16} /> Sair</button></Card>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Editar perfil" description="Atualize suas informações pessoais." footer={<><button className="button button-secondary" onClick={() => setOpen(false)}>Cancelar</button><button type="submit" form="profile-form" className="button button-primary">Salvar</button></>}>
        <form id="profile-form" className="form-grid" onSubmit={save}>
          <Field label="Nome" required className="form-grid-full"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
          <Field label="E-mail" required><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
          <Field label="Telefone"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
          <Field label="Data de nascimento"><input type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} /></Field>
          <Field label="Cidade"><input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></Field>
          <Field label="Contato de emergência" className="form-grid-full"><input value={form.emergencyContact} onChange={(event) => setForm({ ...form, emergencyContact: event.target.value })} placeholder="Nome e telefone" /></Field>
          <Field label="Sobre mim" className="form-grid-full"><textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></Field>
        </form>
      </Modal>
    </div>
  )
}

export function SettingsPage() {
  const {
    data, currentUser, updateData, resetData, importData, deleteAccount,
    showToast, setDiscreet, setPrivacySetting, setAccessibilitySetting, lockApp,
    privacy, accessibility, discreet,
  } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState(location.state?.tab || 'notifications')
  const [cycleForm, setCycleForm] = useState({ cycleLength: String(data.settings.cycleLength), periodLength: String(data.settings.periodLength) })
  const [exportOpen, setExportOpen] = useState(false)
  const [exportForm, setExportForm] = useState({ password: '', confirm: '' })
  const [importPayload, setImportPayload] = useState(null)
  const [importPassword, setImportPassword] = useState('')
  const [importBusy, setImportBusy] = useState(false)
  const settings = data.settings

  useEffect(() => {
    if (location.state?.tab) setTab(location.state.tab)
  }, [location.state])

  const updateNotification = (key, value) => updateData((current) => ({ settings: { ...current.settings, notifications: { ...current.settings.notifications, [key]: value } } }))
  const markBackup = () => updateData((current) => ({ settings: { ...current.settings, lastBackupAt: todayISO() } }))
  const saveCycle = (event) => {
    event.preventDefault()
    updateData((current) => ({ settings: { ...current.settings, cycleLength: Number(cycleForm.cycleLength), periodLength: Number(cycleForm.periodLength) } }))
    showToast('Configurações do ciclo salvas.')
  }
  const exportPlain = () => {
    downloadJson({ version: 1, exportedAt: new Date().toISOString(), data }, `luna-cycle-backup-${todayISO()}.json`)
    markBackup()
    showToast('Cópia simples exportada. Ela não tem senha.')
  }
  const exportProtected = async (event) => {
    event.preventDefault()
    if (exportForm.password.length < BACKUP_MIN_PASSPHRASE) {
      showToast(`Use pelo menos ${BACKUP_MIN_PASSPHRASE} caracteres.`, 'error')
      return
    }
    if (exportForm.password !== exportForm.confirm) {
      showToast('As senhas não conferem.', 'error')
      return
    }
    try {
      const payload = await encryptBackup(data, exportForm.password)
      downloadJson(payload, `luna-cycle-backup-protegido-${todayISO()}.json`)
      markBackup()
      setExportOpen(false)
      setExportForm({ password: '', confirm: '' })
      showToast('Backup protegido exportado. Guarde a senha com cuidado.')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }
  const readBackup = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (isEncryptedBackup(parsed)) {
          setImportPassword('')
          setImportPayload(parsed)
          return
        }
        const result = importData(parsed)
        if (result.ok) showToast('Backup importado com sucesso.')
        else showToast(result.error, 'error')
      } catch {
        showToast('Não foi possível ler o arquivo de backup.', 'error')
      }
    }
    reader.readAsText(file)
  }
  const unlockImport = async (event) => {
    event.preventDefault()
    if (!importPayload) return
    setImportBusy(true)
    try {
      const decrypted = await decryptBackup(importPayload, importPassword)
      const result = importData(decrypted)
      if (result.ok) {
        setImportPayload(null)
        setImportPassword('')
        showToast('Backup importado com sucesso.')
      } else {
        showToast(result.error, 'error')
      }
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setImportBusy(false)
    }
  }
  const doDelete = () => {
    if (!window.confirm('Tudo bem excluir sua conta local e os registros deste navegador?')) return
    deleteAccount()
    navigate('/welcome', { replace: true })
  }
  const doReset = () => {
    const message = currentUser?.demo
      ? 'Restaurar os dados de demonstração? Seus registros atuais serão substituídos.'
      : 'Limpar todos os seus registros neste navegador? Esta ação não pode ser desfeita sem um backup.'
    if (!window.confirm(message)) return
    resetData()
    showToast(currentUser?.demo ? 'Dados de demonstração restaurados.' : 'Seus registros foram limpos.')
  }
  const resetComfort = () => {
    setAccessibilitySetting('highContrast', false)
    setAccessibilitySetting('reducedMotion', false)
    setAccessibilitySetting('textScale', 1)
    showToast('Preferências visuais voltaram ao padrão.')
  }

  return (
    <div>
      <PageHeader eyebrow="Preferências" title="Configurações" description="Ajuste seu ciclo, privacidade e conforto visual no seu ritmo." back onBack={() => navigate(-1)} />
      <Tabs items={[{ id: 'notifications', label: 'Notificações' }, { id: 'privacy', label: 'Privacidade' }, { id: 'comfort', label: 'Conforto' }, { id: 'cycle', label: 'Ciclo' }, { id: 'data', label: 'Dados' }]} active={tab} onChange={setTab} />
      <div style={{ height: 16 }} />

      {tab === 'notifications' && <Card><SectionTitle title="Notificações" subtitle="Escolha como o Luna Cycle pode avisar você" />
        <BrowserAlertsToggle />
        <Toggle label="Lembretes" description="Ciclo, sintomas e medicações" checked={settings.notifications.reminders} onChange={(value) => updateNotification('reminders', value)} />
        <Toggle label="Registro de sintomas (em breve)" description="Um lembrete suave para o check-in" checked={Boolean(settings.notifications.symptoms)} disabled onChange={() => {}} />
        <Toggle label="Dicas do dia (em breve)" description="Conteúdos de bem-estar" checked={Boolean(settings.notifications.tips)} disabled onChange={() => {}} />
        <Toggle label="Notificações por e-mail (em breve)" description="Ainda não enviamos e-mails nesta versão" checked={Boolean(settings.notifications.email)} disabled onChange={() => {}} />
        <Toggle label="Sons (em breve)" description="Alertas sonoros ainda não estão disponíveis" checked={Boolean(settings.notifications.sound)} disabled onChange={() => {}} />
      </Card>}

      {tab === 'privacy' && (
        <div className="split-layout">
          <Card>
            <SectionTitle title="Privacidade e discrição" subtitle="Para usar com tranquilidade em qualquer lugar" />
            <Toggle label="Modo discreto" description="Suaviza nomes, títulos e valores sensíveis na tela." checked={discreet} onChange={setDiscreet} />
            <Toggle label="Bloqueio rápido" description="Mostra o botão de bloqueio no menu de privacidade." checked={privacy.quickLock !== false} onChange={(value) => setPrivacySetting('quickLock', value)} />
            <Toggle label="Bloqueio automático" description="Bloqueia após 5 minutos sem uso." checked={Boolean(privacy.autoLock)} onChange={(value) => setPrivacySetting('autoLock', value)} />
            <Field label="PIN de desbloqueio (opcional)" hint="Barreira visual. O PIN não criptografa os dados locais." className="stack-tight">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={privacy.pin || ''}
                onChange={(event) => setPrivacySetting('pin', event.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Deixe em branco se preferir"
              />
            </Field>
            <div className="row wrap" style={{ marginTop: 12 }}>
              <button className="button button-secondary" onClick={() => { lockApp(); showToast('Seu espaço foi bloqueado.') }}><LockKeyhole size={16} /> Bloquear agora</button>
              <button className={`button ${discreet ? 'button-primary' : 'button-secondary'}`} onClick={() => setDiscreet(!discreet)}><EyeOff size={16} /> {discreet ? 'Desativar modo discreto' : 'Testar modo discreto'}</button>
            </div>
            <div className="divider" />
            <SectionTitle title="Seus dados" subtitle="Você continua no controle" />
            <Toggle label="Compartilhar dados de uso (em breve)" description="Nenhum dado sai deste dispositivo nesta versão" checked={Boolean(privacy.usageData)} disabled onChange={() => {}} />
            <Toggle label="Compartilhar com profissional (em breve)" description="Por enquanto, use o relatório em PDF ou CSV" checked={Boolean(privacy.shareWithProfessional)} disabled onChange={() => {}} />
            <Toggle label="Bloqueio por biometria (em breve)" description="Ainda não disponível neste navegador" checked={Boolean(privacy.biometricLock)} disabled onChange={() => {}} />
          </Card>
          <div className="stack">
            <Card className="card-blush center"><IconCircle icon="ShieldCheck" tone="rose" size="large" /><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, margin: '13px 0 5px' }}>Seus dados são locais</h3><p className="muted small">Conta e registros ficam apenas no armazenamento deste navegador.</p><Badge tone="rose">Sem servidor</Badge></Card>
            <Card><SectionTitle title="Importante saber" /><p className="muted small" style={{ lineHeight: 1.7 }}>O PIN e o bloqueio são barreiras visuais para momentos de privacidade. Eles não criptografam o banco local. Para proteção completa, use também senha ou biometria do seu dispositivo.</p></Card>
            <Card className="info-callout"><IconCircle icon="EyeOff" tone="lavender" /><div><h3>Modo discreto</h3><p>Notificações e títulos sensíveis ficam neutros. Toque e segure um dado suavizado para revelar.</p></div></Card>
          </div>
        </div>
      )}

      {tab === 'comfort' && (
        <div className="split-layout">
          <Card>
            <SectionTitle title="Conforto visual" subtitle="Ajuste leitura, contraste e movimento" />
            <div className="comfort-setting-row">
              <span className="icon-circle icon-rose"><Type size={20} /></span>
              <div className="grow"><Field label="Tamanho do texto"><select value={String(accessibility.textScale || 1)} onChange={(event) => setAccessibilitySetting('textScale', Number(event.target.value))}><option value="1">Padrão</option><option value="1.08">Maior</option><option value="1.16">Muito maior</option></select></Field></div>
            </div>
            <Toggle label="Alto contraste" description="Textos mais escuros e bordas mais visíveis." checked={Boolean(accessibility.highContrast)} onChange={(value) => setAccessibilitySetting('highContrast', value)} />
            <Toggle label="Reduzir animações" description="Menos movimento nas transições." checked={Boolean(accessibility.reducedMotion)} onChange={(value) => setAccessibilitySetting('reducedMotion', value)} />
            <button type="button" className="button button-secondary" style={{ marginTop: 14 }} onClick={resetComfort}><RefreshCw size={16} /> Voltar ao padrão</button>
            <div className="divider" />
            <div className="accessibility-preview-row"><span><Contrast size={16} /> Contraste {accessibility.highContrast ? 'alto' : 'suave'}</span><span><Accessibility size={16} /> Toques amplos</span></div>
          </Card>
          <div className="stack">
            <Card className="card-blush"><SectionTitle title="Atalhos para o dia a dia" /><div className="stack-tight"><ListRow icon="Sparkles" title="Tecla Q" description="Abre o registro rápido de qualquer tela." meta="Rápido" /><ListRow icon="Search" title="Ctrl/⌘ + K" description="Abre a busca global." meta="Buscar" tone="blue" /><ListRow icon="ShieldCheck" title="Menu de privacidade" description="Modo discreto e bloqueio em um toque." meta="Escudo" tone="green" /></div></Card>
            <Card><SectionTitle title="Feito para o toque" /><p className="muted small" style={{ lineHeight: 1.7 }}>Botões, abas e ícones agora têm áreas de toque maiores. Você também pode navegar com Tab e ver claramente onde o foco está.</p></Card>
            <Card className="info-callout"><IconCircle icon="Heart" tone="rose" /><div><h3>Sem cobrança</h3><p>Você pode usar apenas o que fizer sentido. O app não exige registros diários.</p></div></Card>
          </div>
        </div>
      )}

      {tab === 'cycle' && <Card><SectionTitle title="Preferências do ciclo" subtitle="Usadas para calcular previsões" /><form className="form-grid" onSubmit={saveCycle}><Field label="Duração de referência" hint="Usada enquanto não houver histórico suficiente."><select value={cycleForm.cycleLength} onChange={(event) => setCycleForm({ ...cycleForm, cycleLength: event.target.value })}>{Array.from({ length: 20 }).map((_, index) => index + 20).map((value) => <option key={value} value={value}>{value} dias</option>)}</select></Field><Field label="Duração da menstruação"><select value={cycleForm.periodLength} onChange={(event) => setCycleForm({ ...cycleForm, periodLength: event.target.value })}>{[2, 3, 4, 5, 6, 7, 8].map((value) => <option key={value} value={value}>{value} dias</option>)}</select></Field><div className="form-grid-full"><button className="button button-primary" type="submit">Salvar preferências</button></div></form></Card>}
      {tab === 'data' && (
        <div className="split-even">
          <Card>
            <SectionTitle title="Backup e restauração" subtitle="Seus dados ficam neste navegador" />
            <p className="muted small" style={{ marginTop: 0, lineHeight: 1.6 }}>Exporte uma cópia antes de limpar o navegador ou trocar de dispositivo. O backup protegido usa uma senha que só você conhece.</p>
            <div className="stack-tight">
              <button className="button button-primary button-block" onClick={() => { setExportForm({ password: '', confirm: '' }); setExportOpen(true) }}><LockKeyhole size={16} /> Exportar backup protegido</button>
              <button className="button button-secondary button-block" onClick={exportPlain}><CloudDownload size={16} /> Exportar cópia simples</button>
              <label className="button button-secondary button-block"><FileUp size={16} /> Importar backup<input type="file" accept="application/json,.json" onChange={readBackup} style={{ display: 'none' }} /></label>
            </div>
            <p className="muted small" style={{ margin: '12px 0 0' }}>{settings.lastBackupAt ? `Último backup exportado em ${formatDate(settings.lastBackupAt, 'dd/MM/yyyy')}.` : 'Nenhum backup exportado ainda.'}</p>
          </Card>
          <div className="stack">
            <Card>
              <SectionTitle title={currentUser?.demo ? 'Restaurar demonstração' : 'Recomeçar'} />
              <p className="muted small">{currentUser?.demo ? 'Volta aos dados de exemplo deste navegador.' : 'Limpa os registros e reabre o onboarding, mantendo sua conta neste navegador.'}</p>
              <button className="button button-danger" onClick={doReset}><RefreshCw size={16} /> {currentUser?.demo ? 'Restaurar dados de demonstração' : 'Limpar meus registros'}</button>
            </Card>
            <Card>
              <SectionTitle title="Excluir conta" />
              <p className="muted small">Remove o usuário atual e todos os registros salvos neste navegador.</p>
              <button className="button button-danger" onClick={doDelete}><Trash2 size={16} /> Excluir minha conta</button>
            </Card>
          </div>
        </div>
      )}

      <Modal open={exportOpen} onClose={() => setExportOpen(false)} title="Exportar backup protegido" description="O arquivo só poderá ser importado com esta senha." footer={<><button className="button button-secondary" onClick={() => setExportOpen(false)}>Cancelar</button><button type="submit" form="backup-export-form" className="button button-primary">Exportar</button></>}>
        <form id="backup-export-form" className="stack-tight" onSubmit={exportProtected}>
          <Field label="Senha do backup" hint={`Mínimo de ${BACKUP_MIN_PASSPHRASE} caracteres.`} required><input type="password" autoComplete="new-password" value={exportForm.password} onChange={(event) => setExportForm({ ...exportForm, password: event.target.value })} /></Field>
          <Field label="Confirme a senha" required><input type="password" autoComplete="new-password" value={exportForm.confirm} onChange={(event) => setExportForm({ ...exportForm, confirm: event.target.value })} /></Field>
          <p className="muted small" style={{ margin: 0 }}>A senha não é salva em lugar nenhum. Anote em um lugar seguro.</p>
        </form>
      </Modal>

      <Modal open={Boolean(importPayload)} onClose={() => setImportPayload(null)} title="Backup protegido" description="Digite a senha usada quando este arquivo foi exportado." footer={<><button className="button button-secondary" onClick={() => setImportPayload(null)}>Cancelar</button><button type="submit" form="backup-import-form" className="button button-primary" disabled={importBusy}>{importBusy ? 'Abrindo…' : 'Restaurar'}</button></>}>
        <form id="backup-import-form" className="stack-tight" onSubmit={unlockImport}>
          <Field label="Senha" required><input type="password" autoFocus value={importPassword} onChange={(event) => setImportPassword(event.target.value)} /></Field>
        </form>
      </Modal>
    </div>
  )
}

export function AboutPage() {
  const navigate = useNavigate()
  return (
    <div>
      <PageHeader eyebrow="Luna Cycle" title="Sobre o aplicativo" description="Um companheiro para entender e acolher seu ciclo menstrual." back onBack={() => navigate(-1)} />
      <div className="split-layout">
        <div className="stack">
          <Card className="card-blush center" style={{ padding: 36 }}><IconCircle icon="MoonStar" tone="rose" size="large" /><h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 44, margin: '15px 0 6px' }}>Luna Cycle</h2><p className="muted small">Seu ciclo, no seu ritmo.</p><Badge tone="rose">Versão 2.0.0 · Ciclo menstrual</Badge></Card>
          <Card><SectionTitle title="O que você encontra aqui" /><div className="grid grid-2">{[
            ['CalendarDays', 'Calendário do ciclo', 'Menstruação, fertilidade e ovulação'],
            ['Stethoscope', 'Sintomas e fluxo', 'Humor, intensidade e dia a dia'],
            ['HeartPulse', 'Bem-estar', 'Sono, temperatura e sinais vitais'],
            ['ChartColumn', 'Relatórios', 'Padrões, tendências e histórico'],
          ].map(([icon, title, description]) => <ListRow key={title} icon={icon} title={title} description={description} />)}</div></Card>
        </div>
        <div className="stack">
          <Card><SectionTitle title="Feito para você" /><p className="muted small" style={{ lineHeight: 1.7 }}>O Luna Cycle é focado no ciclo menstrual: registre a menstruação, acompanhe o fluxo dia a dia, entenda sintomas e humor, descubra padrões e mantenha sua rotina de cuidados organizada. Tudo salvo localmente, no seu ritmo.</p></Card>
          <Card className="info-callout"><IconCircle icon="Info" tone="blue" /><div><h3>Aviso importante</h3><p>Este aplicativo é informativo e não substitui diagnóstico, tratamento ou acompanhamento de profissionais de saúde.</p></div></Card>
        </div>
      </div>
    </div>
  )
}

export function SupportPage() {
  const { updateData, showToast } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ subject: '', message: '' })
  const faqs = [
    ['Meus dados ficam na nuvem?', 'Não nesta versão. As informações são salvas somente no armazenamento local do seu navegador.'],
    ['Posso registrar só o meu ciclo?', 'Sim. O app é dedicado ao ciclo menstrual: calendário, menstruação, fluxo, sintomas, humor e bem-estar.'],
    ['Como faço backup?', 'Acesse Perfil ou Configurações → Dados e exporte um arquivo JSON. Você pode importá-lo depois.'],
    ['As previsões são médicas?', 'Não. São estimativas baseadas nos seus registros e não devem ser usadas como método contraceptivo ou diagnóstico.'],
  ]
  const send = (event) => {
    event.preventDefault()
    if (!form.subject.trim()) return
    updateData((current) => ({ notifications: [{ id: uid('notif'), title: 'Mensagem de suporte registrada', description: form.subject, date: todayISO(), time: new Date().toTimeString().slice(0, 5), read: false, category: 'Suporte' }, ...current.notifications] }))
    setForm({ subject: '', message: '' })
    showToast('Mensagem registrada localmente.')
  }
  return (
    <div>
      <PageHeader eyebrow="Central de ajuda" title="Ajuda e suporte" description="Tire dúvidas e conheça melhor o Luna Cycle." back onBack={() => navigate(-1)} />
      <div className="split-even">
        <Card><SectionTitle title="Perguntas frequentes" /><div className="stack-tight">{faqs.map(([question, answer]) => <details className="support-faq" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></Card>
        <Card className="card-blush"><SectionTitle title="Envie uma mensagem" subtitle="Nesta demonstração, sua mensagem fica salva localmente" /><form className="stack-tight" onSubmit={send}><Field label="Assunto" required><input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Como podemos ajudar?" /></Field><Field label="Mensagem"><textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Descreva sua dúvida..." /></Field><button className="button button-primary" type="submit"><CircleHelp size={16} /> Enviar mensagem</button></form></Card>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  const navigate = useNavigate()
  return <div className="center" style={{ padding: '80px 20px' }}><IconCircle icon="Search" tone="rose" size="large" /><h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 46, margin: '16px 0 4px' }}>Página não encontrada</h1><p className="muted">O endereço que você tentou acessar não existe.</p><button className="button button-primary" onClick={() => navigate('/app')}>Voltar ao início</button></div>
}
