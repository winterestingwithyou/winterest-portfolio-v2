import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react'

import type { UserRole } from '#/db/schema'
import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { UserWithSessionCount } from '#/features/users/queries'

export type { UserWithSessionCount }

export function getRoleBadges(
  copy: ReturnType<typeof getDashboardCopy>['users'],
): Record<UserRole, { label: string; className: string; icon: typeof Shield }> {
  return {
    owner: {
      label: copy.roles.owner,
      className:
        'bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) text-white border-transparent shadow-xs',
      icon: ShieldAlert,
    },
    admin: {
      label: copy.roles.admin,
      className:
        'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
      icon: ShieldCheck,
    },
    editor: {
      label: copy.roles.editor,
      className:
        'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
      icon: Shield,
    },
  }
}
