import { ExternalLink, Zap } from 'lucide-react'

import { TechIcon } from '#/components/ui/tech-icon'
import { cn } from '#/lib/utils'

export interface TechMarqueeCardProps {
  name: string
  icon?: string | null
  color?: string | null
  url?: string | null
  variant?: 'default' | 'ultimate'
  className?: string
}

export function TechMarqueeCard({
  name,
  icon,
  color,
  url,
  variant = 'default',
  className,
}: TechMarqueeCardProps) {
  const isUltimate = variant === 'ultimate'

  return (
    <div
      className={cn(
        'group relative flex shrink-0 flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-(--brand-orange) bg-card',
        isUltimate
          ? 'h-[190px] w-52 rounded-2xl border border-(--brand-orange)/40 p-6 sm:h-[208px] sm:w-60 gap-4'
          : 'h-[160px] w-44 rounded-2xl border border-(--brand-line) p-5 sm:h-[176px] sm:w-52 gap-3',
        className,
      )}
    >
      {/* Ultimate Badge */}
      {isUltimate ? (
        <div
          className="absolute top-3 right-3 rounded-full bg-(--brand-orange) p-1 text-white opacity-90 transition group-hover:scale-105"
          aria-hidden="true"
        >
          <Zap className="size-3 fill-white text-white" />
        </div>
      ) : null}

      {/* Prominent Centerpiece Icon */}
      <div
        className={cn(
          'flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
          isUltimate ? 'p-2' : 'p-1',
        )}
      >
        <TechIcon
          src={icon}
          alt={name}
          color={color}
          className={cn(
            'object-contain',
            isUltimate ? 'size-16 sm:size-20' : 'size-12 sm:size-14',
          )}
        />
      </div>

      {/* Tech Name & Link with Reserved Title Slot */}
      <div
        className={cn(
          'flex w-full items-center justify-center gap-1.5 px-1',
          isUltimate
            ? 'min-h-[2.75rem] sm:min-h-[3rem]'
            : 'min-h-[2.5rem] sm:min-h-[2.75rem]',
        )}
      >
        <h3
          className={cn(
            'line-clamp-2 leading-tight text-(--brand-ink)',
            isUltimate
              ? 'text-base font-extrabold sm:text-lg'
              : 'text-sm font-bold sm:text-base',
          )}
        >
          {name}
        </h3>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit official website of ${name} (opens in a new tab)`}
            title={`Visit ${name}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center -m-3 p-3 rounded-full text-(--brand-muted) opacity-65 transition hover:opacity-100 hover:text-(--brand-orange-deep) focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
          >
            <ExternalLink
              className={cn(isUltimate ? 'size-4' : 'size-3.5')}
              aria-hidden="true"
            />
            <span className="sr-only">
              Visit official website of {name} (opens in a new tab)
            </span>
          </a>
        ) : null}
      </div>
    </div>
  )
}
