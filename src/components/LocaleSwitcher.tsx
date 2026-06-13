import { Check, ChevronDown, Languages } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover.tsx'
import { getLocale, locales, setLocale } from '#/paraglide/runtime'
import { m } from '#/paraglide/messages'

const localeNames: Record<string, string> = {
  en: 'English',
  id: 'Indonesia',
}

export default function ParaglideLocaleSwitcher() {
  const currentLocale = getLocale()
  const currentLocaleName =
    localeNames[currentLocale] ?? currentLocale.toUpperCase()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="nav-popover-trigger"
          aria-label={m.current_locale({ locale: currentLocaleName })}
        >
          <Languages aria-hidden="true" className="size-4" />
          <span>{currentLocale.toUpperCase()}</span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="nav-popover-content nav-locale-popover w-max"
        aria-label={m.language_label()}
      >
        <div className="nav-popover-heading">{m.language_label()}</div>
        {locales.map((locale) => (
          <button
            type="button"
            key={locale}
            className="nav-popover-option"
            onClick={() => setLocale(locale)}
            aria-pressed={locale === currentLocale}
          >
            <span className="nav-popover-option-icon">
              {locale.toUpperCase()}
            </span>
            <span className="nav-popover-option-copy">
              <span>{localeNames[locale] ?? locale.toUpperCase()}</span>
              <span>{locale.toUpperCase()}</span>
            </span>
            {locale === currentLocale && (
              <Check aria-hidden="true" className="ml-auto size-4" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
