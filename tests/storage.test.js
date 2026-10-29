import test from 'node:test'
import assert from 'node:assert/strict'

function memoryStorage() {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  }
}

test('loadDb migrates an older database without discarding users', async () => {
  const storage = memoryStorage()
  storage.setItem('luna-cycle:database:v1', JSON.stringify({
    version: 0,
    currentUserId: 'user-ana',
    users: [{
      id: 'user-ana',
      name: 'Ana',
      email: 'ana@example.com',
      salt: 'salt',
      passwordHash: 'hash',
      demo: false,
      data: { profile: { name: 'Ana', email: 'ana@example.com' }, cycle: { entries: [] } },
    }],
  }))
  globalThis.window = { localStorage: storage }
  const { loadDb } = await import('../src/context/storage.js')
  const db = loadDb()
  assert.equal(db.version, 1)
  assert.equal(db.currentUserId, 'user-ana')
  assert.equal(db.users.length, 1)
  assert.equal(db.users[0].data.profile.name, 'Ana')
  assert.equal(JSON.parse(storage.getItem('luna-cycle:database:v1')).version, 1)
})

test('loadDb clears a current user that no longer exists', async () => {
  const storage = memoryStorage()
  storage.setItem('luna-cycle:database:v1', JSON.stringify({
    version: 1,
    currentUserId: 'user-missing',
    users: [{ id: 'user-1', name: 'Bia', email: 'bia@example.com', salt: 's', passwordHash: 'h', demo: false, data: { profile: { name: 'Bia' } } }],
  }))
  globalThis.window = { localStorage: storage }
  const { loadDb } = await import('../src/context/storage.js')
  const db = loadDb()
  assert.equal(db.currentUserId, null)
  assert.equal(db.users.length, 1)
})
