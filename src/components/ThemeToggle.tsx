import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover.tsx'
import { getLocale } from '#/paraglide/runtime'

type ThemeMode = 'light' | 'dark' | 'auto'

const themeOptions = [
  {
    mode: 'light',
    Icon: Sun,
  },
  {
    mode: 'dark',
    Icon: Moon,
  },
  {
    mode: 'auto',
    Icon: Monitor,
  },
] satisfies Array<{
  mode: ThemeMode
  Icon: typeof Sun
}>

const themeCopy = {
  en: {
    heading: 'Theme',
    ariaLabel: 'Theme mode: {mode}',
    options: {
      light: 'Light',
      dark: 'Dark',
      auto: 'System',
    },
  },
  id: {
    heading: 'Tema',
    ariaLabel: 'Mode tema: {mode}',
    options: {
      light: 'Terang',
      dark: 'Gelap',
      auto: 'Sistem',
    },
  },
} satisfies Record<
  'en' | 'id',
  {
    heading: string
    ariaLabel: string
    options: Record<ThemeMode, string>
  }
>

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const copy = themeCopy[getLocale() === 'id' ? 'id' : 'en']

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function setThemeMode(nextMode: ThemeMode) {
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const CurrentThemeIcon =
    mode === 'auto' ? Monitor : mode === 'dark' ? Moon : Sun
  const currentOption =
    themeOptions.find((option) => option.mode === mode) ?? themeOptions[2]
  const currentLabel = copy.options[currentOption.mode]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={copy.ariaLabel.replace('{mode}', currentLabel)}
          className="nav-popover-trigger nav-popover-trigger-icon"
        >
          <CurrentThemeIcon aria-hidden="true" className="size-4" />
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="nav-popover-content nav-theme-popover w-max"
      >
        <div className="nav-popover-heading">{copy.heading}</div>
        {themeOptions.map(({ mode: optionMode, Icon: OptionIcon }) => (
          <button
            type="button"
            key={optionMode}
            className="nav-popover-option"
            aria-pressed={optionMode === mode}
            onClick={() => setThemeMode(optionMode)}
          >
            <span className="nav-popover-option-icon">
              <OptionIcon aria-hidden="true" className="size-4" />
            </span>
            <span className="nav-popover-option-copy">
              <span>{copy.options[optionMode]}</span>
            </span>
            {optionMode === mode && (
              <Check aria-hidden="true" className="ml-auto size-4" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
