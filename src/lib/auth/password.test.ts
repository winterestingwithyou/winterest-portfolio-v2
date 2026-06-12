import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('hashes and verifies a password with PBKDF2 metadata', async () => {
    const hash = await hashPassword('correct horse battery staple')

    expect(hash).toMatch(/^pbkdf2-v1\$\d+\$/)
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
})
