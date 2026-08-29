import { Shield, ShieldAlert, ShieldCheck, Users } from 'lucide-react'
import type { ReactNode } from 'react'

import type { getDashboardCopy } from '#/features/dashboard/copy'

type DashboardUsersMetricsProps = {
  copy: ReturnType<typeof getDashboardCopy>['users']
  totalUsers: number
  ownerCount: number
  adminCount: number
  teamCount: number
}

export function DashboardUsersMetrics({
  copy,
  totalUsers,
  ownerCount,
  adminCount,
  teamCount,
}: DashboardUsersMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricCard
        icon={<Users className="size-4 text-(--brand-orange)" />}
        label={copy.metrics.total}
        value={totalUsers}
      />
      <MetricCard
        icon={<ShieldAlert className="size-4 text-(--brand-orange-deep)" />}
        label={copy.roles.owner}
        value={ownerCount}
      />
      <MetricCard
        icon={<ShieldCheck className="size-4 text-purple-600 dark:text-purple-400" />}
        label={copy.roles.admin}
        value={adminCount}
      />
      <MetricCard
        icon={<Shield className="size-4 text-blue-600 dark:text-blue-400" />}
        label={copy.roles.editor}
        value={teamCount}
      />
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number
}) {
  return (
    <div className="surface-card flex items-center gap-3.5 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-(--brand-line) bg-(--surface-strong)">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-(--brand-muted)">
          {label}
        </p>
        <p className="text-xl font-extrabold text-(--brand-ink)">{value}</p>
      </div>
    </div>
  )
}
