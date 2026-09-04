import * as React from 'react'
import { isValid } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'
import { Calendar as CalendarIcon, RotateCcw, X } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { cn } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

export type DatePickerProps = {
  value?: Date | string | number | null
  onChange: (date: Date | undefined, isoString: string) => void
  placeholder?: string
  clearLabel?: string
  todayLabel?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  locale?: 'en' | 'id'
  startMonth?: Date
  endMonth?: Date
}

/**
 * Automatically masks digits into DD/MM/YYYY as the user types.
 * User only needs to type numbers (e.g. 15082024 -> 15/08/2024).
 */
export function formatToDateMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/**
 * Validates and parses DD/MM/YYYY string into a valid Date object.
 */
export function parseDisplayDate(val: string): Date | undefined {
  const trimmed = val.trim()
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return undefined
  const [day, month, year] = trimmed.split('/').map(Number)
  if (
    year < 1900 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return undefined
  }
  const d = new Date(year, month - 1, day)
  if (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  ) {
    return d
  }
  return undefined
}

/**
 * Formats a Date object, display string (DD/MM/YYYY), or timestamp into an ISO YYYY-MM-DD string
 * without timezone drift.
 */
export function formatDateToIso(date?: Date | string | number | null): string {
  if (!date) return ''
  if (typeof date === 'string') {
    const trimmed = date.trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split('/')
      return `${year}-${month}-${day}`
    }
    const d = new Date(trimmed)
    if (isValid(d)) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return ''
  }
  if (typeof date === 'number') {
    const d = new Date(date)
    if (isValid(d)) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return ''
  }
  if (date instanceof Date && isValid(date)) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return ''
}

/**
 * Formats external value (Date object, ISO YYYY-MM-DD, or DD/MM/YYYY) to DD/MM/YYYY display string
 * without timezone shift.
 */
export function toDisplayString(date?: Date | string | number | null): string {
  if (!date) return ''
  if (date instanceof Date && isValid(date)) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }
  if (typeof date === 'number') {
    const d = new Date(date)
    if (isValid(d)) {
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    }
    return ''
  }
  if (typeof date === 'string') {
    const trimmed = date.trim()
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return trimmed
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-')
      return `${day}/${month}/${year}`
    }
    const d = new Date(trimmed)
    if (isValid(d)) {
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    }
  }
  return ''
}

/**
 * Parses external value prop to Date object for the Calendar component without timezone offset bugs.
 */
export function parseValueToDate(
  val?: Date | string | number | null,
): Date | undefined {
  if (!val) return undefined
  if (val instanceof Date) {
    return isValid(val) ? val : undefined
  }
  if (typeof val === 'number') {
    const d = new Date(val)
    return isValid(d) ? d : undefined
  }
  if (typeof val === 'string') {
    const trimmed = val.trim()
    const fromDisplay = parseDisplayDate(trimmed)
    if (fromDisplay) return fromDisplay
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-').map(Number)
      const d = new Date(year, month - 1, day)
      if (
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === day
      ) {
        return d
      }
    }
    const d = new Date(val)
    return isValid(d) ? d : undefined
  }
  return undefined
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  clearLabel,
  todayLabel,
  disabled = false,
  id,
  name,
  className,
  locale,
  startMonth,
  endMonth,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const activeLocale = locale ?? (getLocale() === 'id' ? 'id' : 'en')
  const dateFnsLocale = activeLocale === 'id' ? idLocale : enUS

  const defaultPlaceholder = 'DD/MM/YYYY'
  const defaultClearLabel =
    activeLocale === 'id' ? 'Hapus tanggal' : 'Clear date'
  const defaultTodayLabel = activeLocale === 'id' ? 'Hari ini' : 'Today'

  // Parse external value to Date for calendar
  const parsedDate = React.useMemo(() => parseValueToDate(value), [value])

  // Internal text input state (kept in sync with value prop as DD/MM/YYYY)
  const [inputValue, setInputValue] = React.useState(() =>
    toDisplayString(value),
  )

  React.useEffect(() => {
    setInputValue(toDisplayString(value))
  }, [value])

  const syncDateChange = React.useCallback(
    (maskedText: string) => {
      if (maskedText.trim() === '') {
        onChange(undefined, '')
        return
      }
      const parsed = parseDisplayDate(maskedText)
      if (parsed) {
        onChange(parsed, formatDateToIso(parsed))
      }
    },
    [onChange],
  )

  // Handle direct text typing with automatic DD/MM/YYYY masking
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const masked = formatToDateMask(raw)
    setInputValue(masked)
    syncDateChange(masked)
  }

  // Handle smart backspace over slashes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const input = e.currentTarget
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0
      if (start === end && start > 0 && inputValue[start - 1] === '/') {
        e.preventDefault()
        const rawBefore = inputValue.slice(0, start - 2)
        const rawAfter = inputValue.slice(start)
        const newFormatted = formatToDateMask(rawBefore + rawAfter)
        setInputValue(newFormatted)
        syncDateChange(newFormatted)
        requestAnimationFrame(() => {
          const newPos = Math.max(0, start - 2)
          input.setSelectionRange(newPos, newPos)
        })
      }
    }
  }

  const handleInputBlur = () => {
    if (inputValue.trim() === '') {
      onChange(undefined, '')
      setInputValue('')
      return
    }

    const matched = parseDisplayDate(inputValue)
    if (matched) {
      const formatted = toDisplayString(matched)
      setInputValue(formatted)
      onChange(matched, formatDateToIso(matched))
    } else {
      // Revert to valid value or clear
      if (parsedDate) {
        setInputValue(toDisplayString(parsedDate))
      } else {
        setInputValue('')
        onChange(undefined, '')
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setInputValue('')
    onChange(undefined, '')
  }

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setInputValue(toDisplayString(today))
    onChange(today, formatDateToIso(today))
    setOpen(false)
  }

  // Calendar bounds (following shadcn Date of Birth pattern: 1900 to current + 10)
  const calendarStartMonth = React.useMemo(
    () => startMonth ?? new Date(1900, 0),
    [startMonth],
  )
  const calendarEndMonth = React.useMemo(
    () => endMonth ?? new Date(new Date().getFullYear() + 10, 11),
    [endMonth],
  )

  const hasValue = Boolean(parsedDate || inputValue.trim() !== '')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'group relative flex w-full min-w-0 items-center',
          className,
        )}
      >
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={placeholder || defaultPlaceholder}
          maxLength={10}
          autoComplete="off"
          className={cn(
            'h-11 w-full min-w-0 rounded-xl border border-(--brand-line) bg-surface px-3 font-mono text-sm text-(--brand-ink) placeholder:text-(--brand-muted)/60 outline-none transition',
            'focus:border-(--brand-orange) focus:ring-2 focus:ring-(--brand-orange)/20',
            'disabled:pointer-events-none disabled:opacity-50',
            hasValue ? 'pr-16' : 'pr-10',
          )}
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="grid size-7 place-items-center rounded-lg text-(--brand-muted) transition hover:bg-surface-strong hover:text-(--brand-ink) cursor-pointer focus:outline-hidden"
              title={clearLabel || defaultClearLabel}
              aria-label={clearLabel || defaultClearLabel}
            >
              <X className="size-3.5" />
            </button>
          )}

          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              className={cn(
                'size-8 rounded-lg text-(--brand-muted) hover:bg-surface-strong hover:text-(--brand-ink)',
                open && 'bg-surface-strong text-(--brand-orange-deep)',
              )}
              aria-label={
                activeLocale === 'id' ? 'Buka kalender' : 'Open calendar'
              }
            >
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>
        </div>
      </div>

      <PopoverContent
        className="w-auto p-0 border border-(--brand-line) bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden"
        align="start"
      >
        <Calendar
          mode="single"
          selected={parsedDate}
          defaultMonth={parsedDate}
          captionLayout="dropdown"
          startMonth={calendarStartMonth}
          endMonth={calendarEndMonth}
          onSelect={(selected) => {
            if (selected) {
              setInputValue(toDisplayString(selected))
              onChange(selected, formatDateToIso(selected))
            } else {
              setInputValue('')
              onChange(undefined, '')
            }
            setOpen(false)
          }}
          autoFocus
          locale={dateFnsLocale}
        />

        <div className="border-t border-(--brand-line) bg-surface/60 px-3 py-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleToday}
            className="text-xs text-(--brand-orange-deep) hover:bg-(--brand-orange-soft) cursor-pointer"
          >
            <RotateCcw className="mr-1 size-3" />
            {todayLabel || defaultTodayLabel}
          </Button>

          {hasValue && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={(e) => {
                handleClear(e)
                setOpen(false)
              }}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
            >
              <X className="mr-1 size-3" />
              {clearLabel || defaultClearLabel}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
