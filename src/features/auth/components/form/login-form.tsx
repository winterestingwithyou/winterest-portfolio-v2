import { useNavigate } from '@tanstack/react-router'
import { KeyRound, LogIn } from 'lucide-react'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'

import type { TurnstileRef } from '#/components/ui/turnstile'
import { TurnstileWidget } from '#/components/ui/turnstile'
import type { AuthCopy } from '#/features/auth/content/auth-copy'
import { api, getApiErrorMessage } from '#/lib/api-client'

type LoginFormProps = {
  copy: AuthCopy
  redirectTo?: string
}

export function LoginForm({ copy, redirectTo }: LoginFormProps) {
  const navigate = useNavigate()
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
          <p className="text-xs text-(--brand-muted)">{copy.formSubtitle}</p>
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
