import { Languages } from 'lucide-react'

import { cn } from '#/lib/utils'

type LanguageSwitcherPillProps = {
  activeLocale: 'en' | 'id'
  onChange: (locale: 'en' | 'id') => void
  className?: string
}

export function LanguageSwitcherPill({
  activeLocale,
  onChange,
  className,
}: LanguageSwitcherPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-(--brand-line) bg-card p-1 text-xs shadow-xs',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 px-2 text-muted-foreground">
        <Languages className="size-3.5 text-(--brand-orange)" />
        <span className="text-[11px] font-medium hidden sm:inline">
          Bahasa:
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={cn(
          'rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer text-xs',
          activeLocale === 'en'
            ? 'bg-(--brand-orange) text-white font-bold shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange('id')}
        className={cn(
          'rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer text-xs',
          activeLocale === 'id'
            ? 'bg-(--brand-orange) text-white font-bold shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        )}
      >
        ID
      </button>
    </div>
  )
}
