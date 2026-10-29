const FORMAT = 'luna-cycle-backup'
const FORMAT_VERSION = 1
const ITERATIONS = 210000
const MIN_PASSPHRASE = 8

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function subtle() {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi?.subtle) throw new Error('Este navegador não oferece criptografia local para o backup.')
  return cryptoApi
}

function bytesToBase64(bytes) {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

function base64ToBytes(value) {
  const binary = atob(value)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function deriveKey(passphrase, salt) {
  const cryptoApi = subtle()
  const material = await cryptoApi.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return cryptoApi.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export function isEncryptedBackup(payload) {
  return Boolean(payload && payload.encrypted === true && typeof payload.ciphertext === 'string')
}

export async function encryptBackup(data, passphrase) {
  if (typeof passphrase !== 'string' || passphrase.length < MIN_PASSPHRASE) {
    throw new Error(`Use uma senha com pelo menos ${MIN_PASSPHRASE} caracteres.`)
  }
  const cryptoApi = subtle()
  const salt = cryptoApi.getRandomValues(new Uint8Array(16))
  const iv = cryptoApi.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const content = encoder.encode(JSON.stringify({
    format: FORMAT,
    version: FORMAT_VERSION,
    createdAt: new Date().toISOString(),
    data,
  }))
  const cipher = await cryptoApi.subtle.encrypt({ name: 'AES-GCM', iv }, key, content)
  return {
    format: FORMAT,
    version: FORMAT_VERSION,
    encrypted: true,
    algorithm: 'AES-GCM',
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: ITERATIONS,
      salt: bytesToBase64(salt),
    },
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(cipher)),
  }
}

export async function decryptBackup(payload, passphrase) {
  if (!isEncryptedBackup(payload)) throw new Error('Este arquivo não é um backup protegido do Luna Cycle.')
  if (typeof passphrase !== 'string' || !passphrase) throw new Error('Digite a senha usada na exportação.')
  const salt = base64ToBytes(payload.kdf?.salt || '')
  const iv = base64ToBytes(payload.iv || '')
  try {
    const key = await deriveKey(passphrase, salt)
    const plain = await subtle().subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(payload.ciphertext))
    const parsed = JSON.parse(decoder.decode(plain))
    return parsed?.data ?? parsed
  } catch {
    throw new Error('Senha incorreta ou arquivo corrompido.')
  }
}

export const BACKUP_MIN_PASSPHRASE = MIN_PASSPHRASE
