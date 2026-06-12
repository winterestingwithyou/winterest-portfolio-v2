import { userRoles } from '#/db/schema'
import type { UserRole } from '#/db/schema'

export type DashboardUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && userRoles.includes(value as UserRole)
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'editor'
}

export function canManageContent(role: UserRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'editor'
}

export function toDashboardUser(value: unknown): DashboardUser | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const user = value as Record<string, unknown>

  if (
    typeof user.id !== 'string' ||
    typeof user.name !== 'string' ||
    typeof user.email !== 'string' ||
    !isUserRole(user.role)
  ) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
