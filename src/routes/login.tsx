import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Cloud,
  KeyRound,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher.tsx'
import ThemeToggle from '#/components/ThemeToggle'
import { getDashboardSession } from '#/features/auth/server-functions'
import { cn } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

type LoginSearch = {
  redirectTo?: string
}

type AuthMode = 'signin' | 'signup'

const authCopy = {
  en: {
    metaTitle: 'Login | Winterest',
    metaDescription: 'Private Winterest dashboard access.',
    backHome: 'Back to portfolio',
    eyebrow: 'Winterest private access',
    title: 'A private space for Winterest.',
    description:
      'A simple entry point for maintaining the stories, work, and notes behind the portfolio.',
    noteTitle: 'Personal access only',
    note: 'This area is reserved for Winterest, so the public site can stay clean, focused, and easy to explore.',
    mode: {
      signin: 'Sign in',
      signup: 'Bootstrap',
    },
    fields: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
    },
    placeholders: {
      name: 'Winterest',
      email: 'you@example.com',
      password: 'Your password',
    },
    submit: {
      signin: 'Enter dashboard',
      signup: 'Create owner',
      pending: 'Checking...',
    },
    errors: {
      signin: 'Sign in failed.',
      signup: 'Owner bootstrap failed.',
      request: 'Auth request failed.',
    },
    highlights: [
      'Focused workspace',
      'Calm publishing flow',
      'Portfolio upkeep',
    ],
  },
  id: {
    metaTitle: 'Login | Winterest',
    metaDescription: 'Akses dashboard privat Winterest.',
    backHome: 'Kembali ke portfolio',
    eyebrow: 'Akses privat Winterest',
    title: 'Ruang privat untuk Winterest.',
    description:
      'Tempat sederhana untuk merapikan cerita, karya, dan catatan yang hidup di balik portfolio.',
    noteTitle: 'Akses personal',
    note: 'Area ini disiapkan untuk Winterest, agar halaman publik tetap rapi, fokus, dan nyaman dijelajahi.',
    mode: {
      signin: 'Masuk',
      signup: 'Bootstrap',
    },
    fields: {
      name: 'Nama',
      email: 'Email',
      password: 'Password',
    },
    placeholders: {
      name: 'Winterest',
      email: 'kamu@example.com',
      password: 'Password kamu',
    },
    submit: {
      signin: 'Masuk dashboard',
      signup: 'Buat owner',
      pending: 'Memeriksa...',
    },
    errors: {
      signin: 'Gagal masuk.',
      signup: 'Gagal membuat owner.',
      request: 'Request auth gagal.',
    },
    highlights: [
      'Workspace fokus',
      'Alur publikasi tenang',
      'Perawatan portfolio',
    ],
  },
} satisfies Record<
  'en' | 'id',
  {
    metaTitle: string
    metaDescription: string
    backHome: string
    eyebrow: string
    title: string
    description: string
    noteTitle: string
    note: string
    mode: Record<AuthMode, string>
    fields: Record<'name' | 'email' | 'password', string>
    placeholders: Record<'name' | 'email' | 'password', string>
    submit: Record<AuthMode | 'pending', string>
    errors: Record<AuthMode | 'request', string>
    highlights: string[]
  }
>

function getCopy() {
  return authCopy[getLocale() === 'id' ? 'id' : 'en']
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirectTo:
      typeof search.redirectTo === 'string' ? search.redirectTo : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const user = await getDashboardSession()

    if (user) {
      throw redirect({ to: search.redirectTo ?? '/dashboard' })
    }
  },
  head: () => {
    const copy = getCopy()

    return {
      meta: [
        {
          title: copy.metaTitle,
        },
        {
          name: 'description',
          content: copy.metaDescription,
        },
      ],
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { redirectTo } = Route.useSearch()
  const copy = getCopy()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get('name') ?? 'Winterest'),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      callbackURL: redirectTo ?? '/dashboard',
      rememberMe: true,
    }

    try {
      const response = await fetch(
        mode === 'signup'
          ? '/api/auth/sign-up/email'
          : '/api/auth/sign-in/email',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(
            mode === 'signup'
              ? payload
              : {
                  email: payload.email,
                  password: payload.password,
                  callbackURL: payload.callbackURL,
                  rememberMe: payload.rememberMe,
                },
          ),
        },
      )
      const result: { message?: string; error?: string } = await response.json()

      if (!response.ok) {
        throw new Error(result.message ?? result.error ?? copy.errors[mode])
      }

      await navigate({ to: redirectTo ?? '/dashboard' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.errors.request)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_12%,color-mix(in_srgb,var(--brand-orange)_24%,transparent),transparent_28rem),radial-gradient(circle_at_86%_78%,color-mix(in_srgb,var(--brand-orange-deep)_20%,transparent),transparent_24rem),linear-gradient(145deg,color-mix(in_srgb,var(--brand-cream)_92%,white),color-mix(in_srgb,var(--brand-orange-soft)_42%,var(--brand-cream)))] text-[var(--brand-ink)] dark:bg-[radial-gradient(circle_at_12%_14%,color-mix(in_srgb,var(--brand-orange)_22%,transparent),transparent_28rem),radial-gradient(circle_at_84%_76%,color-mix(in_srgb,var(--brand-orange-deep)_28%,transparent),transparent_24rem),linear-gradient(145deg,color-mix(in_srgb,var(--brand-dark)_96%,black),color-mix(in_srgb,#24170d_72%,var(--brand-dark)))]">
      <div className="mx-auto min-h-screen w-full max-w-[74rem] px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
        <header
          className="flex items-start justify-between gap-4 sm:items-center"
          aria-label="Authentication navigation"
        >
          <a
            href="/"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--surface-strong)_88%,transparent)] px-3 text-xs font-extrabold text-[var(--brand-ink)] no-underline shadow-[0_14px_36px_rgba(42,26,10,0.08)] transition hover:-translate-y-px hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)] sm:min-h-10 sm:text-sm"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {copy.backHome}
          </a>
          <div className="flex items-center gap-1.5">
            <ParaglideLocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-5rem)] items-center gap-8 py-9 sm:py-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)] lg:gap-16 lg:py-20">
          <div className="grid gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-orange)_38%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_72%,transparent)] py-1 pr-3 pl-1 text-sm font-black text-[var(--brand-ink)] shadow-[0_18px_44px_var(--brand-glow)]">
              <span className="brand-mark">
                <Cloud aria-hidden="true" className="size-4" />
                <Sparkles aria-hidden="true" className="brand-spark size-3" />
              </span>
              <span>Winterest</span>
            </div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="max-w-2xl text-[clamp(2rem,9vw,3rem)] leading-[1] font-black text-[var(--brand-ink)] sm:text-[clamp(2.2rem,5vw,4rem)]">
              {copy.title}
            </h1>
            <p className="max-w-xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
              {copy.description}
            </p>

            <div className="grid max-w-xl gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--brand-orange)_28%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_72%,transparent)] p-4 shadow-[0_18px_52px_rgba(42,26,10,0.08)] sm:grid-cols-[auto_1fr]">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-5 text-[var(--brand-orange-deep)]"
              />
              <div>
                <strong className="block text-sm text-[var(--brand-ink)]">
                  {copy.noteTitle}
                </strong>
                <span className="mt-1 block text-sm leading-7 text-[var(--brand-muted)]">
                  {copy.note}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {copy.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-[color-mix(in_srgb,var(--brand-orange)_30%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_64%,transparent)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-muted)]"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--brand-orange)_28%,var(--brand-line))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-strong)_96%,transparent),color-mix(in_srgb,var(--brand-orange-soft)_28%,transparent)),var(--surface-strong)] p-4 shadow-[0_28px_80px_rgba(42,26,10,0.16),inset_0_1px_0_color-mix(in_srgb,white_42%,transparent)] sm:p-5"
          >
            <div
              className="grid grid-cols-2 gap-1 rounded-full border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-dark)_5%,var(--surface-strong))] p-1"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                aria-pressed={mode === 'signin'}
                className={getModeButtonClass(mode === 'signin')}
              >
                <LogIn aria-hidden="true" className="size-4" />
                {copy.mode.signin}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError(null)
                }}
                aria-pressed={mode === 'signup'}
                className={getModeButtonClass(mode === 'signup')}
              >
                <UserPlus aria-hidden="true" className="size-4" />
                {copy.mode.signup}
              </button>
            </div>

            {mode === 'signup' ? (
              <Field
                label={copy.fields.name}
                name="name"
                autoComplete="name"
                defaultValue="Winterest"
                placeholder={copy.placeholders.name}
              />
            ) : null}
            <Field
              label={copy.fields.email}
              name="email"
              autoComplete="email"
              type="email"
              placeholder={copy.placeholders.email}
            />
            <Field
              label={copy.fields.password}
              name="password"
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              type="password"
              placeholder={copy.placeholders.password}
            />

            {error ? (
              <p className="rounded-[0.9rem] border border-[color-mix(in_srgb,#ef4444_38%,transparent)] bg-[color-mix(in_srgb,#ef4444_12%,transparent)] px-3.5 py-3 text-sm font-bold text-red-700 dark:text-red-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 text-sm font-black text-white shadow-[0_18px_44px_var(--brand-glow)] transition hover:-translate-y-px hover:shadow-[0_22px_54px_var(--brand-glow)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <KeyRound aria-hidden="true" className="size-4" />
              {isPending ? copy.submit.pending : copy.submit[mode]}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

function getModeButtonClass(isActive: boolean) {
  return cn(
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-full text-sm font-extrabold transition',
    isActive
      ? 'bg-[var(--brand-orange)] text-white shadow-[0_12px_32px_var(--brand-glow)]'
      : 'text-[var(--brand-muted)] hover:text-[var(--brand-ink)]',
  )
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  autoComplete: string
  defaultValue?: string
  placeholder: string
}) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={name}
        className="text-sm font-extrabold text-[var(--brand-ink)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
        className="min-h-12 w-full rounded-[0.9rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--surface-strong)_86%,transparent)] px-3.5 text-sm font-semibold text-[var(--brand-ink)] outline-none transition placeholder:text-[color-mix(in_srgb,var(--brand-muted)_72%,transparent)] focus:border-[var(--brand-orange)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand-orange)_16%,transparent)]"
      />
    </div>
  )
}
