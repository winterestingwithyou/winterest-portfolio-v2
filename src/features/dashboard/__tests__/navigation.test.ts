import { describe, expect, it } from 'vitest'

import {
  canManageSettings,
  canManageUsers,
  isUserRole,
} from '#/features/auth/roles'
import { dashboardCopy } from '../copy'

describe('dashboard navigation & polish UX', () => {
  it('provides localized systemGroup in shell copy for both languages', () => {
    expect(dashboardCopy.en.shell.systemGroup).toBe('System')
    expect(dashboardCopy.id.shell.systemGroup).toBe('Sistem')
  })

  it('provides localized createFirst CTA copy in projects for both languages', () => {
    expect(dashboardCopy.en.projects.createFirst).toBe('Create first project')
    expect(dashboardCopy.id.projects.createFirst).toBe('Buat project pertama')
  })

  it('filters system navigation based on RBAC permissions for editor, admin, and owner', () => {
    const systemNav = [
      { to: '/dashboard/users', label: 'Users' },
      { to: '/dashboard/settings', label: 'Settings' },
      { to: '/dashboard/account', label: 'Account' },
    ]

    const filterForRole = (rawRole?: string | null) => {
      const role = isUserRole(rawRole) ? rawRole : null
      const canUsers = role ? canManageUsers(role) : false
      const canSettings = role ? canManageSettings(role) : false

      return systemNav.filter((item) => {
        if (item.to === '/dashboard/users' && !canUsers) return false
        if (item.to === '/dashboard/settings' && !canSettings) return false
        return true
      })
    }

    // Editor: restricted from users and settings
    const editorNav = filterForRole('editor')
    expect(editorNav.some((item) => item.to === '/dashboard/users')).toBe(false)
    expect(editorNav.some((item) => item.to === '/dashboard/settings')).toBe(
      false,
    )
    expect(editorNav.map((item) => item.to)).toEqual(['/dashboard/account'])

    // Admin: restricted from users, allowed on settings
    const adminNav = filterForRole('admin')
    expect(adminNav.some((item) => item.to === '/dashboard/users')).toBe(false)
    expect(adminNav.some((item) => item.to === '/dashboard/settings')).toBe(
      true,
    )
    expect(adminNav.map((item) => item.to)).toEqual([
      '/dashboard/settings',
      '/dashboard/account',
    ])

    // Owner: full access to both users and settings
    const ownerNav = filterForRole('owner')
    expect(ownerNav.some((item) => item.to === '/dashboard/users')).toBe(true)
    expect(ownerNav.some((item) => item.to === '/dashboard/settings')).toBe(
      true,
    )
    expect(ownerNav.map((item) => item.to)).toEqual([
      '/dashboard/users',
      '/dashboard/settings',
      '/dashboard/account',
    ])

    // Guest / Invalid: restricted from both
    const guestNav = filterForRole(undefined)
    expect(guestNav.some((item) => item.to === '/dashboard/users')).toBe(false)
    expect(guestNav.some((item) => item.to === '/dashboard/settings')).toBe(
      false,
    )
    expect(guestNav.map((item) => item.to)).toEqual(['/dashboard/account'])
  })
})
