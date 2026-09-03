import * as React from 'react'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'
import { Calendar as CalendarIcon, X } from 'lucide-react'

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
  value?: Date | string | null
  onChange: (date: Date | undefined) => void
  placeholder?: string
  clearLabel?: string
  disabled?: boolean
  id?: string
  className?: string
  locale?: 'en' | 'id'
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  clearLabel,
  disabled = false,
  id,
  className,
  locale,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const activeLocale = locale ?? (getLocale() === 'id' ? 'id' : 'en')
  const dateFnsLocale = activeLocale === 'id' ? idLocale : enUS

  const parsedDate = React.useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? undefined : value
    }
    const d = new Date(value)
    return isNaN(d.getTime()) ? undefined : d
  }, [value])

  const defaultPlaceholder =
    activeLocale === 'id' ? 'Pilih tanggal' : 'Pick a date'
  const defaultClearLabel =
    activeLocale === 'id' ? 'Hapus tanggal' : 'Clear date'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn('relative flex items-center w-full', className)}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'h-11 w-full justify-start rounded-xl border border-(--brand-line) bg-surface px-3 text-left font-normal text-sm transition hover:bg-surface/80 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20',
              !parsedDate && 'text-(--brand-muted)',
              parsedDate && 'pr-9',
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 text-(--brand-muted)" />
            {parsedDate ? (
              <span className="truncate font-medium text-(--brand-ink)">
                {format(parsedDate, 'PPP', { locale: dateFnsLocale })}
              </span>
            ) : (
              <span className="truncate text-(--brand-muted)/70">
                {placeholder || defaultPlaceholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        {parsedDate && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onChange(undefined)
            }}
            className="absolute right-2.5 grid size-6 place-items-center rounded-md text-(--brand-muted) transition hover:bg-muted hover:text-(--brand-ink) cursor-pointer"
            title={clearLabel || defaultClearLabel}
            aria-label={clearLabel || defaultClearLabel}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <PopoverContent
        className="w-auto p-0 border border-(--brand-line) bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden"
        align="start"
      >
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(selected) => {
            onChange(selected)
            setOpen(false)
          }}
          autoFocus
          locale={dateFnsLocale}
        />
        {parsedDate && (
          <div className="border-t border-(--brand-line) bg-card/60 p-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                onChange(undefined)
                setOpen(false)
              }}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
            >
              <X className="mr-1 size-3" />
              {clearLabel || defaultClearLabel}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
