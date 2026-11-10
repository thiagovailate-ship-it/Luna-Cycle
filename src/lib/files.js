import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { isNativeApp } from './native.js'

function browserDownload(filename, text, mimeType) {
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Exporta um arquivo de texto.
 * - Web/PWA: download normal pelo navegador.
 * - Android: grava no cache do app e abre a folha de compartilhamento
 *   (salvar em Arquivos, enviar por e-mail/WhatsApp etc.).
 */
export async function exportTextFile({ filename, text, mimeType = 'application/octet-stream', title = filename }) {
  if (!isNativeApp) {
    browserDownload(filename, text, mimeType)
    return
  }

  const { uri } = await Filesystem.writeFile({
    path: filename,
    data: text,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
  })

  await Share.share({ title, files: [uri], dialogTitle: title })
}
