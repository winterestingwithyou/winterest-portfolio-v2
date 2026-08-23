import { describe, expect, it } from 'vitest'

import {
  createUserSchema,
  resetPasswordSchema,
  updateUserSchema,
} from './validation'

describe('users validation', () => {
  it('validates user creation payload properly', () => {
    const valid = {
      name: 'Winterest',
      email: 'owner@winterest.tech',
      password: 'password123',
      role: 'owner',
    }

    const parsed = createUserSchema.parse(valid)
    expect(parsed.name).toBe('Winterest')
    expect(parsed.email).toBe('owner@winterest.tech')
    expect(parsed.role).toBe('owner')

    // Password too short
    expect(() =>
      createUserSchema.parse({
        ...valid,
        password: 'short',
      }),
    ).toThrow()

    // Invalid email
    expect(() =>
      createUserSchema.parse({
        ...valid,
        email: 'invalid-email',
      }),
    ).toThrow()

    // Invalid role
    expect(() =>
      createUserSchema.parse({
        ...valid,
        role: 'superadmin',
      }),
    ).toThrow()
  })

  it('validates user update payload properly', () => {
    const valid = {
      id: 'user_123',
      name: 'Adam',
      email: 'adam@example.com',
      role: 'admin',
    }

    const parsed = updateUserSchema.parse(valid)
    expect(parsed.id).toBe('user_123')
    expect(parsed.role).toBe('admin')

    expect(() =>
      updateUserSchema.parse({
        ...valid,
        name: 'A', // too short
      }),
    ).toThrow()
  })

  it('validates reset password payload properly', () => {
    const valid = {
      id: 'user_123',
      password: 'new-secure-password',
    }

    const parsed = resetPasswordSchema.parse(valid)
    expect(parsed.id).toBe('user_123')

    expect(() =>
      resetPasswordSchema.parse({
        id: 'user_123',
        password: '123', // too short
      }),
    ).toThrow()
  })
})
