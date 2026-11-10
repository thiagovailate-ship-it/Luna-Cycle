import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core'
import { App } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'

/**
 * `true` quando o app está rodando dentro do shell nativo (Capacitor).
 * No navegador/PWA permanece `false` e nada do código nativo é executado.
 */
export const isNativeApp = Capacitor.isNativePlatform()

const ROOT_HASHES = new Set(['', '#', '#/', '#/app', '#/welcome'])

function dismissTopLayer() {
  // Modais e painéis escutam Escape.
  if (document.querySelector('.modal-backdrop')) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    return true
  }
  // Menu lateral, registro rápido e popovers fecham pelo botão de descarte.
  const dismiss = document.querySelector('.sidebar-overlay, .quick-backdrop, .popover-dismiss')
  if (dismiss) {
    dismiss.click()
    return true
  }
  return false
}

/**
 * Ajustes exclusivos do app Android: barras do sistema, botão físico de
 * voltar e esconder a splash depois do primeiro frame útil.
 */
export async function initNativeApp() {
  if (!isNativeApp) return

  document.documentElement.classList.add('native-app')

  SystemBars.setStyle({ style: SystemBarsStyle.Light }).catch(() => {
    // Sem suporte à API nativa, o app segue com o tema do sistema.
  })

  App.addListener('backButton', () => {
    if (dismissTopLayer()) return
    if (!ROOT_HASHES.has(window.location.hash)) {
      window.history.back()
      return
    }
    App.minimizeApp().catch(() => App.exitApp().catch(() => {}))
  })

  // A splash nativa cobre o boot; some só depois da primeira pintura.
  requestAnimationFrame(() => {
    window.setTimeout(() => {
      SplashScreen.hide().catch(() => {})
    }, 250)
  })
}
