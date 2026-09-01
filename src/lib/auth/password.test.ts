import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('hashes and verifies a password with PBKDF2 metadata', async () => {
    const hash = await hashPassword('correct horse battery staple')

    expect(hash).toMatch(/^pbkdf2-v1\$100000\$/)
    await expect(
      verifyPassword({
        hash,
        password: 'correct horse battery staple',
      }),
    ).resolves.toBe(true)
    await expect(
      verifyPassword({
        hash,
        password: 'wrong password',
      }),
    ).resolves.toBe(false)
  })

  it('rejects verification safely when iterations exceed maximum allowed threshold', async () => {
    // Simulated hash with 120_000 iterations (which exceeds Cloudflare Workers 100_000 limit)
    const hashAboveLimit = 'pbkdf2-v1$120000$c2FsdHNhbHQ$a2V5a2V5'

    await expect(
      verifyPassword({
        hash: hashAboveLimit,
        password: 'any password',
      }),
    ).resolves.toBe(false)
  })

  it('handles corrupted or invalid hash formats safely', async () => {
    await expect(
      verifyPassword({
        hash: 'invalid-hash-string',
        password: 'password',
      }),
    ).resolves.toBe(false)

    await expect(
      verifyPassword({
        hash: 'pbkdf2-v1$notanumber$salt$key',
        password: 'password',
      }),
    ).resolves.toBe(false)
  })
})
