import test from 'node:test'
import assert from 'node:assert/strict'
import { BACKUP_MIN_PASSPHRASE, decryptBackup, encryptBackup, isEncryptedBackup } from '../src/lib/backup.js'

const sample = { profile: { name: 'Ana' }, cycle: { entries: [{ id: 'c1', startDate: '2026-10-01' }] } }

test('encrypted backup round-trips the data with the right passphrase', async () => {
  const payload = await encryptBackup(sample, 'frase-segura-123')
  assert.equal(payload.encrypted, true)
  assert.equal(payload.algorithm, 'AES-GCM')
  assert.ok(isEncryptedBackup(payload))
  assert.ok(!JSON.stringify(payload).includes('Ana'))
  const restored = await decryptBackup(payload, 'frase-segura-123')
  assert.deepEqual(restored, sample)
})

test('encrypted backup rejects a wrong passphrase', async () => {
  const payload = await encryptBackup(sample, 'frase-segura-123')
  await assert.rejects(() => decryptBackup(payload, 'frase-errada-123'), /Senha incorreta/)
})

test('encrypted backup enforces a minimum passphrase length', async () => {
  await assert.rejects(() => encryptBackup(sample, 'curta'), new RegExp(String(BACKUP_MIN_PASSPHRASE)))
})

test('plain payloads are not treated as encrypted backups', () => {
  assert.equal(isEncryptedBackup({ data: sample }), false)
  assert.equal(isEncryptedBackup(null), false)
})
