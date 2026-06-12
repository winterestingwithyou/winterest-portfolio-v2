import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

type ContainerProps = ComponentProps<'div'>

export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn('page-wrap', className)} {...props} />
}

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
