import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import type { TurnstileRef } from '#/components/ui/turnstile'
import { TurnstileWidget } from '#/components/ui/turnstile'
import type { AuthCopy } from '#/features/auth/copy'
import { useSignIn } from '#/features/auth/hooks'
import { createLoginSchema } from '#/features/auth/validation'
import { FetchError, getApiErrorMessage } from '#/lib/api-client'
import { getSafeRedirect } from '#/routes/login'

type LoginFormProps = {
  copy: AuthCopy
  redirectTo?: string
}

function getLoginErrorMessage(caught: unknown, copy: AuthCopy): string {
  if (caught instanceof FetchError) {
    if (caught.status === 400 || caught.status === 401) {
      return copy.errors.signin
    }
    if (caught.status && caught.status >= 500) {
      return copy.errors.request
    }
  }
  return getApiErrorMessage(caught, copy.errors.signin)
}

export function LoginForm({ copy, redirectTo }: LoginFormProps) {
  const navigate = useNavigate()
  const signInMutation = useSignIn()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileRef>(null)

  const validationSchema = createLoginSchema(copy.validation)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: validationSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)

      const safeRedirect = getSafeRedirect(redirectTo)
      const payload = {
        email: value.email,
        password: value.password,
        callbackURL: safeRedirect,
        rememberMe: true,
        turnstileToken,
      }

      try {
        await signInMutation.mutateAsync(payload)
        await navigate({ to: safeRedirect })
      } catch (caught) {
        setError(getLoginErrorMessage(caught, copy))
        turnstileRef.current?.reset()
        setTurnstileToken('')
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="grid gap-3.5 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--brand-orange)_28%,var(--brand-line))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-strong)_96%,transparent),color-mix(in_srgb,var(--brand-orange-soft)_28%,transparent)),var(--surface-strong)] p-4 shadow-[0_28px_80px_rgba(42,26,10,0.16),inset_0_1px_0_color-mix(in_srgb,white_42%,transparent)] sm:gap-4 sm:p-5"
    >
      <div className="flex items-center gap-2.5 border-b border-(--brand-line) pb-2.5 sm:pb-3">
        <div className="flex size-8.5 items-center justify-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
          <LogIn className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-(--brand-ink)">
            {copy.formTitle}
          </h2>
          <p className="text-xs text-(--brand-muted)">{copy.formSubtitle}</p>
        </div>
      </div>

      <FieldGroup className="gap-3 sm:gap-3.5">
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0

            return (
              <Field data-invalid={isInvalid} className="gap-1">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-xs font-bold text-(--brand-ink) sm:text-sm"
                >
                  {copy.fields.email}
                </FieldLabel>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--brand-muted)"
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={copy.placeholders.email}
                    aria-invalid={isInvalid}
                    className="h-10.5 rounded-[0.85rem] border-(--brand-line) bg-[color-mix(in_srgb,var(--surface-strong)_86%,transparent)] pl-10 pr-3.5 text-sm font-semibold text-(--brand-ink) placeholder:text-[color-mix(in_srgb,var(--brand-muted)_72%,transparent)] focus-visible:border-(--brand-orange) focus-visible:ring-(--brand-orange)/20 sm:h-11"
                  />
                </div>
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )
          }}
        />

        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0

            return (
              <Field data-invalid={isInvalid} className="gap-1">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-xs font-bold text-(--brand-ink) sm:text-sm"
                >
                  {copy.fields.password}
                </FieldLabel>
                <div className="relative">
                  <KeyRound
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--brand-muted)"
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={copy.placeholders.password}
                    aria-invalid={isInvalid}
                    className="h-10.5 rounded-[0.85rem] border-(--brand-line) bg-[color-mix(in_srgb,var(--surface-strong)_86%,transparent)] pl-10 pr-11 text-sm font-semibold text-(--brand-ink) placeholder:text-[color-mix(in_srgb,var(--brand-muted)_72%,transparent)] focus-visible:border-(--brand-orange) focus-visible:ring-(--brand-orange)/20 sm:h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-(--brand-muted) transition hover:text-(--brand-ink) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? copy.passwordToggle.hide
                        : copy.passwordToggle.show
                    }
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-[0.9rem] border border-[color-mix(in_srgb,#ef4444_38%,transparent)] bg-[color-mix(in_srgb,#ef4444_12%,transparent)] px-3.5 py-2 text-xs font-bold text-red-700 sm:text-sm dark:text-red-200"
        >
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="w-full">
        <TurnstileWidget
          ref={turnstileRef}
          action="login"
          className="w-full"
          onSuccess={setTurnstileToken}
          onError={() => setTurnstileToken('')}
          onExpire={() => setTurnstileToken('')}
        />
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => {
          const isPending = signInMutation.isPending || isSubmitting

          return (
            <Button
              type="submit"
              disabled={!canSubmit || isPending}
              className="inline-flex min-h-10.5 w-full items-center justify-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-black text-white shadow-[0_18px_44px_var(--brand-glow)] transition hover:-translate-y-px hover:bg-(--brand-orange-deep) hover:shadow-[0_22px_54px_var(--brand-glow)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-11.5"
            >
              {isPending ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  <span>{copy.submit.pending}</span>
                </>
              ) : (
                <>
                  <KeyRound aria-hidden="true" className="size-4" />
                  <span>{copy.submit.signin}</span>
                </>
              )}
            </Button>
          )
        }}
      />
    </form>
  )
}
