import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Cloud,
  KeyRound,
  LogIn,
  Sparkles,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'

import ParaglideLocaleSwitcher from '#/components/locale-switcher.tsx'
import ThemeToggle from '#/components/theme-toggle'
import type { TurnstileRef } from '#/components/ui/turnstile'
import { TurnstileWidget } from '#/components/ui/turnstile'
import { getDashboardSession } from '#/features/auth/server-functions'
import { api, getApiErrorMessage } from '#/lib/api-client'
import { getLocale } from '#/paraglide/runtime'

type LoginSearch = {
  redirectTo?: string
}

const authCopy = {
  en: {
    metaTitle: 'Sign In | Winterest Portfolio',
    metaDescription:
      'Sign in to manage portfolio content, media assets, site settings, and publishing workflows.',
    brandName: 'Winterest',
    backHome: 'Back to portfolio',
    eyebrow: 'Dashboard Access',
    title: 'Sign in to manage your portfolio.',
    description:
      'A central workspace to manage portfolio content, media assets, site configurations, and publishing workflows.',
    formTitle: 'Account sign in',
    formSubtitle: 'Enter your credentials to continue',
    fields: {
      email: 'Email',
      password: 'Password',
    },
    placeholders: {
      email: 'name@example.com',
      password: 'Enter your password',
    },
    submit: {
      signin: 'Sign in',
      pending: 'Signing in...',
    },
    errors: {
      signin: 'Invalid email or password. Please check your credentials.',
      request: 'Authentication request failed. Please try again.',
    },
  },
  id: {
    metaTitle: 'Masuk | Winterest Portfolio',
    metaDescription:
      'Masuk untuk mengelola konten portfolio, aset media, pengaturan situs, dan alur publikasi.',
    brandName: 'Winterest Portfolio',
    backHome: 'Kembali ke portfolio',
    eyebrow: 'Akses Dashboard',
    title: 'Masuk untuk mengelola portfolio.',
    description:
      'Workspace terpusat untuk mengelola konten portfolio, aset media, konfigurasi situs, dan alur publikasi.',
    formTitle: 'Masuk ke akun',
    formSubtitle: 'Masukkan kredensial kamu untuk melanjutkan',
    fields: {
      email: 'Email',
      password: 'Kata sandi',
    },
    placeholders: {
      email: 'nama@example.com',
      password: 'Masukkan kata sandi',
    },
    submit: {
      signin: 'Masuk',
      pending: 'Memproses...',
    },
    errors: {
      signin: 'Email atau kata sandi salah. Silakan periksa kembali.',
      request: 'Permintaan autentikasi gagal. Silakan coba lagi.',
    },
  },
} satisfies Record<
  'en' | 'id',
  {
    metaTitle: string
    metaDescription: string
    brandName: string
    backHome: string
    eyebrow: string
    title: string
    description: string
    formTitle: string
    formSubtitle: string
    fields: Record<'email' | 'password', string>
    placeholders: Record<'email' | 'password', string>
    submit: { signin: string; pending: string }
    errors: { signin: string; request: string }
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
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileRef>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      callbackURL: redirectTo ?? '/dashboard',
      rememberMe: true,
      turnstileToken,
    }

    try {
      await api('/api/auth/sign-in/email', {
        method: 'POST',
        headers: {
          'cf-turnstile-response': turnstileToken,
        },
        body: payload,
      })

      await navigate({ to: redirectTo ?? '/dashboard' })
    } catch (caught) {
      setError(getApiErrorMessage(caught, copy.errors.signin))
      turnstileRef.current?.reset()
      setTurnstileToken('')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_12%,color-mix(in_srgb,var(--brand-orange)_24%,transparent),transparent_28rem),radial-gradient(circle_at_86%_78%,color-mix(in_srgb,var(--brand-orange-deep)_20%,transparent),transparent_24rem),linear-gradient(145deg,color-mix(in_srgb,var(--brand-cream)_92%,white),color-mix(in_srgb,var(--brand-orange-soft)_42%,var(--brand-cream)))] text-(--brand-ink) lg:h-screen lg:overflow-hidden dark:bg-[radial-gradient(circle_at_12%_14%,color-mix(in_srgb,var(--brand-orange)_22%,transparent),transparent_28rem),radial-gradient(circle_at_84%_76%,color-mix(in_srgb,var(--brand-orange-deep)_28%,transparent),transparent_24rem),linear-gradient(145deg,color-mix(in_srgb,var(--brand-dark)_96%,black),color-mix(in_srgb,#24170d_72%,var(--brand-dark)))]">
      <div className="mx-auto flex min-h-screen w-full max-w-296 flex-col justify-between px-5 py-4 sm:px-6 sm:py-6 lg:h-full lg:min-h-0 lg:px-8 lg:py-6">
        <header
          className="flex items-center justify-between gap-4"
          aria-label="Authentication navigation"
        >
          <a
            href="/"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-(--brand-line) bg-[color-mix(in_srgb,var(--surface-strong)_88%,transparent)] px-3.5 text-xs font-extrabold text-(--brand-ink) no-underline shadow-[0_14px_36px_rgba(42,26,10,0.08)] transition hover:-translate-y-px hover:border-(--brand-orange) hover:text-(--brand-orange-deep) sm:min-h-10 sm:text-sm"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {copy.backHome}
          </a>
          <div className="flex items-center gap-1.5">
            <ParaglideLocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <section className="my-auto grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-12 lg:py-0">
          <div className="grid gap-3 sm:gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-orange)_38%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_72%,transparent)] py-1 pr-3 pl-1 text-xs font-black text-(--brand-ink) shadow-[0_18px_44px_var(--brand-glow)] sm:text-sm">
              <span className="brand-mark">
                <Cloud aria-hidden="true" className="size-4" />
                <Sparkles aria-hidden="true" className="brand-spark size-3" />
              </span>
              <span>{copy.brandName}</span>
            </div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="max-w-2xl text-2xl font-black leading-tight text-(--brand-ink) sm:text-3xl lg:text-4xl xl:text-[2.75rem]">
              {copy.title}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-(--brand-muted) sm:text-base sm:leading-7">
              {copy.description}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-3.5 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--brand-orange)_28%,var(--brand-line))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-strong)_96%,transparent),color-mix(in_srgb,var(--brand-orange-soft)_28%,transparent)),var(--surface-strong)] p-4 shadow-[0_28px_80px_rgba(42,26,10,0.16),inset_0_1px_0_color-mix(in_srgb,white_42%,transparent)] sm:gap-4 sm:p-5"
          >
            <div className="flex items-center gap-2 border-b border-(--brand-line) pb-2.5 sm:pb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                <LogIn className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-(--brand-ink)">
                  {copy.formTitle}
                </h2>
                <p className="text-xs text-(--brand-muted)">
                  {copy.formSubtitle}
                </p>
              </div>
            </div>

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
              autoComplete="current-password"
              type="password"
              placeholder={copy.placeholders.password}
            />

            {error ? (
              <p className="rounded-[0.9rem] border border-[color-mix(in_srgb,#ef4444_38%,transparent)] bg-[color-mix(in_srgb,#ef4444_12%,transparent)] px-3.5 py-2.5 text-xs font-bold text-red-700 sm:text-sm dark:text-red-200">
                {error}
              </p>
            ) : null}

            <div className="w-full py-0.5">
              <TurnstileWidget
                ref={turnstileRef}
                action="login"
                className="w-full"
                onSuccess={setTurnstileToken}
                onError={() => setTurnstileToken('')}
                onExpire={() => setTurnstileToken('')}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-black text-white shadow-[0_18px_44px_var(--brand-glow)] transition hover:-translate-y-px hover:shadow-[0_22px_54px_var(--brand-glow)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-12"
            >
              <KeyRound aria-hidden="true" className="size-4" />
              {isPending ? copy.submit.pending : copy.submit.signin}
            </button>
          </form>
        </section>
      </div>
    </main>
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
        className="text-sm font-extrabold text-(--brand-ink)"
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
        className="min-h-12 w-full rounded-[0.9rem] border border-(--brand-line) bg-[color-mix(in_srgb,var(--surface-strong)_86%,transparent)] px-3.5 text-sm font-semibold text-(--brand-ink) outline-none transition placeholder:text-[color-mix(in_srgb,var(--brand-muted)_72%,transparent)] focus:border-(--brand-orange) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand-orange)_16%,transparent)]"
      />
    </div>
  )
}
