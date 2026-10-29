import { useState } from 'react'
import { Download, Share, Smartphone } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { usePwaInstall } from '../hooks/usePwaInstall.js'
import { Card, SectionTitle, Toggle } from './ui.jsx'

export function InstallAppCard() {
  const { showToast } = useApp()
  const { canInstall, installed, isIos, install } = usePwaInstall()

  if (installed) return null

  if (!canInstall && !isIos) {
    return (
      <Card className="card-blush">
        <SectionTitle title="Instalar o Luna Cycle" subtitle="Acesso rápido na tela inicial" />
        <p className="muted small" style={{ margin: 0 }}>
          Este navegador não oferece a instalação automática. No Chrome, Edge ou Safari você pode usar o menu do navegador e escolher “Instalar app” ou “Adicionar à Tela de Início”.
        </p>
      </Card>
    )
  }

  const doInstall = async () => {
    const result = await install()
    if (result.ok) showToast('App instalado. Abra pelo ícone na tela inicial.')
    else if (result.reason === 'error') showToast('Não foi possível iniciar a instalação. Tente pelo menu do navegador.', 'error')
  }

  return (
    <Card className="card-blush">
      <SectionTitle title="Instalar o Luna Cycle" subtitle="Tela cheia e acesso mais rápido" />
      <div className="install-card">
        <span className="icon-circle icon-rose"><Smartphone size={20} /></span>
        <div className="install-card-text">
          {isIos && !canInstall
            ? <p>No Safari, toque em <Share size={14} aria-hidden="true" /> <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.</p>
            : <p>Adicione o app à tela inicial para abrir sem a barra do navegador. Seus dados continuam neste dispositivo.</p>}
        </div>
        {canInstall && <button type="button" className="button button-primary" onClick={doInstall}><Download size={16} /> Instalar</button>}
      </div>
    </Card>
  )
}

export function BrowserAlertsToggle() {
  const { data, updateData, showToast } = useApp()
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState(supported ? Notification.permission : 'unsupported')
  const enabled = supported && data.settings.notifications.browser === true && permission === 'granted'

  const change = async (value) => {
    if (!supported) {
      showToast('Este navegador não oferece avisos do sistema.', 'error')
      return
    }
    if (!value) {
      updateData((current) => ({ settings: { ...current.settings, notifications: { ...current.settings.notifications, browser: false } } }))
      showToast('Avisos do navegador desativados.')
      return
    }
    const result = permission === 'granted' ? 'granted' : await Notification.requestPermission()
    setPermission(result)
    if (result !== 'granted') {
      showToast('Permissão não concedida. Você pode liberar os avisos nas configurações do navegador.', 'error')
      return
    }
    updateData((current) => ({ settings: { ...current.settings, notifications: { ...current.settings.notifications, browser: true } } }))
    showToast('Avisos ativados. Eles são enviados enquanto o app estiver aberto.')
  }

  const description = !supported
    ? 'Indisponível neste navegador'
    : permission === 'denied'
      ? 'Permissão bloqueada nas configurações do navegador'
      : 'Lembretes do dia enquanto o app está aberto'

  return <Toggle label="Avisos do navegador" description={description} checked={enabled} onChange={change} />
}
