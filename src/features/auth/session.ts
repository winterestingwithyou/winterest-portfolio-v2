import { auth } from '#/lib/auth'

import { canAccessDashboard, canManageContent, toDashboardUser } from './roles'
import type { DashboardUser } from './roles'

export async function getDashboardUserFromRequest(
  request: Request,
): Promise<DashboardUser | null> {
  const session = await auth.api.getSession({
    headers: request.headers,
  })
  const user = toDashboardUser(session?.user)

  if (!user || !canAccessDashboard(user.role)) {
    return null
  }

  return user
}

export async function requireDashboardUser(
  request: Request,
): Promise<DashboardUser | Response> {
  const user = await getDashboardUserFromRequest(request)

  if (!user) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 })
  }

  if (!canManageContent(user.role)) {
    return Response.json({ error: 'Insufficient role.' }, { status: 403 })
  }

  return user
}
