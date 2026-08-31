import { useForm } from '@tanstack/react-form'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import type { TurnstileRef } from '#/components/ui/turnstile'
import { TurnstileWidget } from '#/components/ui/turnstile'
import type { getContactCopy } from '#/features/contact/copy'
import { useSubmitContact } from '#/features/contact/hooks'
import { contactSchema } from '#/features/contact/validation'
import { getApiErrorMessage } from '#/lib/api-client'
import { scaleIn } from '#/lib/motion'

type ContactFormProps = {
  copy: ReturnType<typeof getContactCopy>['form']
}

export function ContactForm({ copy }: ContactFormProps) {
  const turnstileRef = useRef<TurnstileRef>(null)
  const submitMutation = useSubmitContact()
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      turnstileToken: '',
    },
    validators: {
      onSubmit: contactSchema,
    },
    onSubmit: async ({ value }) => {
      setStatus('loading')
      setErrorMessage(null)

      try {
        await submitMutation.mutateAsync(value)

        setStatus('success')
        form.reset()
        turnstileRef.current?.reset()
      } catch (err: unknown) {
        console.error('Failed to send contact message:', err)
        setStatus('error')
        setErrorMessage(getApiErrorMessage(err, copy.sendErrorTitle))
        turnstileRef.current?.reset()
      }
    },
  })

  return (
    <motion.div
      variants={scaleIn}
      className="surface-card w-full min-w-0 max-w-full overflow-hidden p-4 sm:p-6 md:p-8"
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="text-xl font-bold text-(--brand-ink)">
              {copy.sendSuccessTitle}
            </h3>
            <p className="mt-2 max-w-md text-sm text-(--brand-muted)">
              {copy.sendSuccessSubtitle}
            </p>
            <Button
              type="button"
              onClick={() => setStatus('idle')}
              variant="outline"
              className="mt-6 rounded-full border-(--brand-line) font-bold text-(--brand-ink) hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
            >
              {copy.sendAnother}
            </Button>
          </motion.div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}
            className="grid gap-5"
          >
            <div>
              <h2 className="text-xl font-bold text-(--brand-ink)">
                {copy.title}
              </h2>
              <p className="mt-1 text-xs text-(--brand-muted)">
                {copy.subtitle}
              </p>
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 size-5 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">{copy.sendErrorTitle}</p>
                  <p className="mt-0.5 opacity-90">
                    {errorMessage || copy.sendErrorTitle}
                  </p>
                </div>
              </div>
            )}

            <FieldGroup className="w-full min-w-0 max-w-full">
              <div className="grid w-full min-w-0 max-w-full gap-4 sm:grid-cols-2">
                {/* Name */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="w-full min-w-0 max-w-full"
                      >
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                        >
                          {copy.name}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          disabled={status === 'loading'}
                          autoComplete="name"
                          placeholder={copy.namePlaceholder}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="h-11 w-full min-w-0 max-w-full rounded-xl border-(--brand-line) bg-(--surface-strong) text-sm"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                {/* Email */}
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="w-full min-w-0 max-w-full"
                      >
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                        >
                          {copy.email}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          disabled={status === 'loading'}
                          autoComplete="email"
                          placeholder={copy.emailPlaceholder}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="h-11 w-full min-w-0 max-w-full rounded-xl border-(--brand-line) bg-(--surface-strong) text-sm"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </div>

              {/* Subject */}
              <form.Field
                name="subject"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-full min-w-0 max-w-full"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                      >
                        {copy.subject}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        disabled={status === 'loading'}
                        placeholder={copy.subjectPlaceholder}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="h-11 w-full min-w-0 max-w-full rounded-xl border-(--brand-line) bg-(--surface-strong) text-sm"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Message */}
              <form.Field
                name="message"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-full min-w-0 max-w-full"
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                      >
                        {copy.message}
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        disabled={status === 'loading'}
                        rows={5}
                        placeholder={copy.messagePlaceholder}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-28 w-full min-w-0 max-w-full rounded-xl border-(--brand-line) bg-(--surface-strong) text-sm"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Turnstile Bot Verification */}
              <form.Field
                name="turnstileToken"
                children={(field) => (
                  <div className="w-full pt-1">
                    <TurnstileWidget
                      ref={turnstileRef}
                      action="contact"
                      className="w-full"
                      onSuccess={(token) => field.handleChange(token)}
                      onError={() => field.handleChange('')}
                      onExpire={() => field.handleChange('')}
                    />
                  </div>
                )}
              />
            </FieldGroup>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="min-h-11 w-full gap-2 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) font-bold text-white shadow-[0_12px_32px_var(--brand-glow)] transition hover:opacity-95 hover:shadow-[0_18px_48px_var(--brand-glow)] disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                    <span>{copy.sending}</span>
                  </>
                ) : (
                  <>
                    <Send aria-hidden="true" className="size-4" />
                    <span>{copy.send}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
