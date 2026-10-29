import { useEffect, useState } from 'react'

function isStandalone() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

function isIosDevice() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function usePwaInstall() {
  const [promptEvent, setPromptEvent] = useState(null)
  const [installed, setInstalled] = useState(isStandalone)
  const [isIos] = useState(isIosDevice)

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault()
      setPromptEvent(event)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplayChange = () => setInstalled(isStandalone())
    if (media.addEventListener) media.addEventListener('change', onDisplayChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      if (media.removeEventListener) media.removeEventListener('change', onDisplayChange)
    }
  }, [])

  const install = async () => {
    if (!promptEvent) return { ok: false, reason: 'unavailable' }
    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      setPromptEvent(null)
      if (choice?.outcome === 'accepted') {
        setInstalled(true)
        return { ok: true }
      }
      return { ok: false, reason: 'dismissed' }
    } catch {
      return { ok: false, reason: 'error' }
    }
  }

  return { canInstall: Boolean(promptEvent), installed, isIos, install }
}
