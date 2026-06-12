import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { KeyRound, LogIn, UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { getDashboardSession } from '#/features/auth/server-functions'

type LoginSearch = {
  redirectTo?: string
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
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { redirectTo } = Route.useSearch()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
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
        throw new Error(
          result.message ??
            result.error ??
            (mode === 'signup' ? 'Owner bootstrap failed.' : 'Sign in failed.'),
        )
      }

      await navigate({ to: redirectTo ?? '/dashboard' })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Auth request failed.',
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="px-4 py-16">
      <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="eyebrow mb-4">Winterest CMS</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-5xl">
            Private cockpit for projects, writing, and lab entries.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--brand-muted)]">
            Sign in with the owner account. If this is the first account after
            applying migrations, bootstrap creates the owner and closes public
            signup afterward.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="surface-card grid gap-5 p-5">
          <div className="inline-grid grid-cols-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition ${
                mode === 'signin'
                  ? 'bg-[var(--brand-orange)] text-white'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-ink)]'
              }`}
            >
              <LogIn aria-hidden="true" className="size-4" />
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition ${
                mode === 'signup'
                  ? 'bg-[var(--brand-orange)] text-white'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-ink)]'
              }`}
            >
              <UserPlus aria-hidden="true" className="size-4" />
              Bootstrap
            </button>
          </div>

          {mode === 'signup' ? (
            <Field
              label="Name"
              name="name"
              autoComplete="name"
              defaultValue="Winterest"
            />
          ) : null}
          <Field label="Email" name="email" autoComplete="email" type="email" />
          <Field
            label="Password"
            name="password"
            autoComplete={
              mode === 'signup' ? 'new-password' : 'current-password'
            }
            type="password"
          />

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <KeyRound aria-hidden="true" className="size-4" />
            {isPending
              ? 'Checking...'
              : mode === 'signup'
                ? 'Create owner'
                : 'Enter dashboard'}
          </button>
        </form>
      </section>
    </main>
  )
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  autoComplete: string
  defaultValue?: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-bold text-[var(--brand-ink)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
        className="mt-2 min-h-11 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--brand-ink)]"
      />
    </div>
  )
}
