import { describe, expect, it } from 'vitest'

import { canAccessDashboard, toDashboardUser } from './roles'

describe('auth roles', () => {
  it('allows dashboard access for content roles', () => {
    expect(canAccessDashboard('owner')).toBe(true)
    expect(canAccessDashboard('admin')).toBe(true)
    expect(canAccessDashboard('editor')).toBe(true)
    expect(canAccessDashboard('viewer')).toBe(false)
  })

  it('normalizes Better Auth user payloads into dashboard users', () => {
    expect(
      toDashboardUser({
        id: 'user_1',
        name: 'Winterest',
        email: 'adam@example.com',
        role: 'owner',
      }),
    ).toEqual({
      id: 'user_1',
      name: 'Winterest',
      email: 'adam@example.com',
      role: 'owner',
    })
    expect(toDashboardUser({ id: 'user_1', role: 'root' })).toBeNull()
  })
})
