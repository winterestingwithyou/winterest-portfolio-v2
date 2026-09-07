import { Search, X } from 'lucide-react'
import * as React from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

export type SearchInputProps = {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  delay?: number
  className?: string
  inputClassName?: string
  disabled?: boolean
  autoFocus?: boolean
  clearAriaLabel?: string
}

export function SearchInput({
  value = '',
  onChange,
  placeholder,
  delay = 350,
  className,
  inputClassName,
  disabled = false,
  autoFocus = false,
  clearAriaLabel,
}: SearchInputProps) {
  const [localValue, setLocalValue] = React.useState(value)

  const isId = getLocale() === 'id'
  const effectivePlaceholder = placeholder ?? (isId ? 'Cari...' : 'Search...')
  const effectiveClearLabel =
    clearAriaLabel ?? (isId ? 'Hapus pencarian' : 'Clear search')

  // Sync external value changes (e.g. from URL params or reset buttons)
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback((val: string) => {
    onChange(val)
  }, delay)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setLocalValue(next)
    debouncedOnChange(next)
  }

  const handleClear = () => {
    setLocalValue('')
    debouncedOnChange.cancel()
    onChange('')
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 size-4 text-(--brand-muted)"
      />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={effectivePlaceholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          'h-10 rounded-xl bg-(--surface-card) pl-9 pr-8 text-sm transition focus-visible:ring-2 focus-visible:ring-(--brand-orange) focus-visible:border-transparent',
          inputClassName,
        )}
      />
      {localValue ? (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          aria-label={effectiveClearLabel}
          className="absolute right-2.5 rounded-full p-0.5 text-(--brand-muted) transition hover:bg-(--surface-strong) hover:text-(--brand-ink) focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}
