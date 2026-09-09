import { describe, expect, it } from 'vitest'

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

  it('filters out user management navigation item when role is not owner', () => {
    const systemNav = [
      { to: '/dashboard/users', label: 'Users' },
      { to: '/dashboard/settings', label: 'Settings' },
      { to: '/dashboard/account', label: 'Account' },
    ]

    const filterForRole = (role?: string | null) => {
      const isOwner = role === 'owner'
      return systemNav.filter((item) => {
        if (item.to === '/dashboard/users' && !isOwner) return false
        return true
      })
    }

    const editorNav = filterForRole('editor')
    expect(editorNav.some((item) => item.to === '/dashboard/users')).toBe(false)
    expect(editorNav.map((item) => item.to)).toEqual([
      '/dashboard/settings',
      '/dashboard/account',
    ])

    const adminNav = filterForRole('admin')
    expect(adminNav.some((item) => item.to === '/dashboard/users')).toBe(false)

    const ownerNav = filterForRole('owner')
    expect(ownerNav.some((item) => item.to === '/dashboard/users')).toBe(true)
    expect(ownerNav.map((item) => item.to)).toEqual([
      '/dashboard/users',
      '/dashboard/settings',
      '/dashboard/account',
    ])

    const guestNav = filterForRole(undefined)
    expect(guestNav.some((item) => item.to === '/dashboard/users')).toBe(false)
  })
})
