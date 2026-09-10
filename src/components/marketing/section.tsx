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
  asHeading?: 'h1' | 'h2'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  asHeading = 'h2',
}: SectionHeaderProps) {
  const HeadingTag = asHeading

  return (
    <div
      className={cn(
        'mb-8 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <HeadingTag className="text-3xl font-semibold tracking-tight text-(--brand-ink) sm:text-4xl">
        {title}
      </HeadingTag>
      {description ? (
        <p className="mt-4 text-base leading-8 text-(--brand-muted) sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
