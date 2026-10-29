/* Luna Cycle service worker — shell offline enxuto, sem dependências externas. */
const VERSION = 'luna-cycle-v1'
const SHELL_CACHE = `${VERSION}-shell`
const RUNTIME_CACHE = `${VERSION}-runtime`
const SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/icon-maskable-512.png']

async function precache() {
  const cache = await caches.open(SHELL_CACHE)
  await Promise.allSettled(SHELL.map((url) => cache.add(url)))
  try {
    const response = await fetch('./index.html', { cache: 'no-store' })
    if (!response.ok) return
    const copy = response.clone()
    const html = await response.text()
    await cache.put('./index.html', copy)
    const assets = [...new Set([...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]))]
      .filter((path) => path.startsWith('/'))
    await Promise.allSettled(assets.map((path) => cache.add(path)))
  } catch {
    // Sem rede no primeiro acesso, o cache básico do shell já basta.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined)
          return response
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || (await caches.match('./'))),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined)
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || './', self.registration.scope).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.startsWith(self.registration.scope))
      if (existing) {
        existing.focus()
        if ('navigate' in existing) return existing.navigate(target)
        return undefined
      }
      return self.clients.openWindow(target)
    }),
  )
})
