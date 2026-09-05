import { useForm } from '@tanstack/react-form'
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  Tag,
  User,
} from 'lucide-react'
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
        form.setFieldValue('turnstileToken', '')
      }
    },
  })

  return (
    <motion.div
      variants={scaleIn}
      className="grid gap-3.5 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--brand-orange)_28%,var(--brand-line))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-strong)_96%,transparent),color-mix(in_srgb,var(--brand-orange-soft)_28%,transparent)),var(--surface-strong)] p-3.5 shadow-[0_28px_80px_rgba(42,26,10,0.16),inset_0_1px_0_color-mix(in_srgb,white_42%,transparent)] sm:gap-4 sm:p-5"
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
            className="flex w-full min-w-0 max-w-full flex-col gap-3.5 sm:gap-4"
          >
            <div className="flex items-center gap-2.5 border-b border-(--brand-line) pb-2.5 sm:pb-3">
              <div className="flex size-8.5 items-center justify-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                <Send className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-(--brand-ink)">
                  {copy.title}
                </h2>
                <p className="text-xs text-(--brand-muted)">{copy.subtitle}</p>
              </div>
            </div>

            {status === 'error' && (
              <div
                role="alert"
                className="flex items-center gap-2.5 rounded-[0.9rem] border border-[color-mix(in_srgb,#ef4444_38%,transparent)] bg-[color-mix(in_srgb,#ef4444_12%,transparent)] px-3.5 py-2 text-xs font-bold text-red-700 sm:text-sm dark:text-red-200"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage || copy.sendErrorTitle}</span>
              </div>
            )}

            <FieldGroup className="gap-3 sm:gap-3.5">
              <div className="grid w-full min-w-0 max-w-full gap-3 sm:grid-cols-2 sm:gap-3.5">
                {/* Name */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} className="gap-1">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-bold text-(--brand-ink) sm:text-sm"
                        >
                          {copy.name}
                        </FieldLabel>
                        <div className="relative">
                          <User
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--brand-muted)"
                          />
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

                {/* Email */}
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} className="gap-1">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-bold text-(--brand-ink) sm:text-sm"
                        >
                          {copy.email}
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
                            disabled={status === 'loading'}
                            autoComplete="email"
                            placeholder={copy.emailPlaceholder}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
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
              </div>

              {/* Subject */}
              <form.Field
                name="subject"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-bold text-(--brand-ink) sm:text-sm"
                      >
                        {copy.subject}
                      </FieldLabel>
                      <div className="relative">
                        <Tag
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--brand-muted)"
                        />
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

              {/* Message */}
              <form.Field
                name="message"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-bold text-(--brand-ink) sm:text-sm"
                      >
                        {copy.message}
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        disabled={status === 'loading'}
                        rows={4}
                        placeholder={copy.messagePlaceholder}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 rounded-[0.85rem] border-(--brand-line) bg-[color-mix(in_srgb,var(--surface-strong)_86%,transparent)] p-3 text-sm font-semibold text-(--brand-ink) placeholder:text-[color-mix(in_srgb,var(--brand-muted)_72%,transparent)] focus-visible:border-(--brand-orange) focus-visible:ring-(--brand-orange)/20"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>

            <div className="w-full">
              <TurnstileWidget
                ref={turnstileRef}
                action="contact"
                className="w-full"
                onSuccess={(token) =>
                  form.setFieldValue('turnstileToken', token)
                }
                onError={() => form.setFieldValue('turnstileToken', '')}
                onExpire={() => form.setFieldValue('turnstileToken', '')}
              />
            </div>

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex min-h-10.5 w-full items-center justify-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-black text-white shadow-[0_18px_44px_var(--brand-glow)] transition hover:-translate-y-px hover:bg-(--brand-orange-deep) hover:shadow-[0_22px_54px_var(--brand-glow)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-11.5"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  <span>{copy.sending}</span>
                </>
              ) : (
                <>
                  <Send aria-hidden="true" className="size-4" />
                  <span>{copy.send}</span>
                </>
              )}
            </Button>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
