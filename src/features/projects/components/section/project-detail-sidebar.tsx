import { Calendar, CheckCircle2, Clock, Layers } from 'lucide-react'
import type { ReactNode } from 'react'

import { TechIcon } from '#/components/ui/tech-icon'
import type { getPublishedProject } from '#/features/projects/public-loaders'
import { formatDate } from '#/lib/utils'

type ProjectDetailSidebarProps = {
  project: NonNullable<Awaited<ReturnType<typeof getPublishedProject>>>
}

export function ProjectDetailSidebar({ project }: ProjectDetailSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Project Metadata Card */}
      <div className="surface-card p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-orange-deep)">
          Informasi Project
        </h3>

        <div className="space-y-4">
          <MetaItem
            icon={<Layers className="size-4" />}
            label="Kategori"
            value={project.category}
          />

          {project.startedAt ? (
            <MetaItem
              icon={<Clock className="size-4" />}
              label="Dimulai Pada"
              value={formatDate(project.startedAt)}
            />
          ) : null}

          {project.completedAt ? (
            <MetaItem
              icon={<CheckCircle2 className="size-4" />}
              label="Selesai Pada"
              value={formatDate(project.completedAt)}
            />
          ) : null}

          {project.publishedAt ? (
            <MetaItem
              icon={<Calendar className="size-4" />}
              label="Dipublish Pada"
              value={formatDate(project.publishedAt)}
            />
          ) : null}
        </div>
      </div>

      {/* Technologies Card */}
      {project.technologies.length > 0 ? (
        <div className="surface-card p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-orange-deep)">
            Teknologi
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((item) => (
              <span
                key={item.id || item.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-1 font-mono text-xs font-semibold text-(--brand-ink)"
              >
                <TechIcon
                  src={item.icon}
                  name={item.name}
                  color={item.color}
                  className="size-3.5"
                />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--brand-orange-soft) text-(--brand-orange-deep)">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-(--brand-muted)">{label}</p>
        <p className="text-sm font-bold text-(--brand-ink)">{value}</p>
      </div>
    </div>
  )
}
