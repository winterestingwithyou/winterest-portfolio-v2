import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  Twitter,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { z } from 'zod'

import { Container, SectionHeader } from '#/components/marketing/section'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { getPublicCopy } from '#/features/portfolio/data'
import { useSiteSettings } from '#/features/settings/hooks'
import { defaultSiteSettings } from '#/features/settings/types'
import {
  defaultViewport,
  fadeIn,
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerItem,
} from '#/lib/motion'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function TikTokIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.06.92.16V9.16a6.34 6.34 0 0 0-.92-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.28 8.28 0 0 0 4.77 1.5V7.1a4.85 4.85 0 0 1-1.01-.41z" />
    </svg>
  )
}

const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi.'),
  email: z.string().email('Format email tidak valid.'),
  subject: z.string(),
  message: z.string().min(10, 'Pesan minimal 10 karakter.'),
})

function ContactPage() {
  const copy = getPublicCopy()
  const { data: settings = defaultSiteSettings } = useSiteSettings()

  const githubUrl = settings.githubUrl || ''
  const githubName = settings.githubName || 'GitHub Profile'

  const facebookUrl = settings.facebookUrl || ''
  const facebookName = settings.facebookName || 'Facebook Profile'

  const instagramUrl = settings.instagramUrl || ''
  const instagramName = settings.instagramName || 'Instagram Profile'

  const linkedinUrl = settings.linkedinUrl || ''
  const linkedinName = settings.linkedinName || 'LinkedIn Profile'

  const twitterUrl = settings.twitterUrl || ''
  const twitterName = settings.twitterName || 'Twitter / X'

  const tiktokUrl = settings.tiktokUrl || ''
  const tiktokName = settings.tiktokName || 'TikTok'

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
    },
    validators: {
      onSubmit: contactSchema,
    },
    onSubmit: async ({ value }) => {
      setStatus('loading')
      setErrorMessage(null)

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        })

        const data: { error?: string; success?: boolean } =
          await response.json()

        if (!response.ok || data.error) {
          throw new Error(data.error || copy.contact.sendErrorTitle)
        }

        setStatus('success')
        form.reset()
      } catch (err: unknown) {
        console.error('Failed to send contact message:', err)
        setStatus('error')
        setErrorMessage(
          err instanceof Error ? err.message : copy.contact.sendErrorTitle,
        )
      }
    },
  })

  return (
    <main className="overflow-x-clip px-4 py-12 sm:py-16">
      <Container className="max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <SectionHeader
            eyebrow={copy.contact.eyebrow}
            title={copy.contact.title}
            description={copy.contact.description}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeIn}
          className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start w-full min-w-0 max-w-full"
        >
          {/* Left Column: Direct Channels & Status */}
          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            className="grid gap-5 w-full min-w-0 max-w-full"
          >
            <motion.div variants={staggerItem} className="surface-card p-4 sm:p-6 md:p-7 w-full min-w-0 max-w-full overflow-hidden">
              <div className="flex items-center gap-3 border-b border-(--brand-line) pb-4">
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep) shrink-0">
                  <MessageSquare aria-hidden="true" className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-(--brand-ink) truncate">
                    {copy.contact.directTitle}
                  </h2>
                  <p className="text-xs text-(--brand-muted) truncate">
                    {copy.contact.directSubtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {/* GitHub Block */}
                {githubUrl && (
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                        GitHub
                      </span>
                      <span className="text-xs font-bold text-(--brand-muted)">
                        Public Profile
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <Github
                          aria-hidden="true"
                          className="size-5 shrink-0 text-(--brand-ink)"
                        />
                        <span className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate">
                          {githubName}
                        </span>
                      </div>
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center gap-1 sm:gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 sm:px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-3.5 text-(--brand-muted)"
                        />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* LinkedIn Block */}
                {linkedinUrl && (
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                        LinkedIn
                      </span>
                      <span className="text-xs font-bold text-(--brand-muted)">
                        Professional Profile
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <Linkedin
                          aria-hidden="true"
                          className="size-5 shrink-0 text-(--brand-ink)"
                        />
                        <span className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate">
                          {linkedinName}
                        </span>
                      </div>
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center gap-1 sm:gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 sm:px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-3.5 text-(--brand-muted)"
                        />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Twitter / X Block */}
                {twitterUrl && (
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                        Twitter / X
                      </span>
                      <span className="text-xs font-bold text-(--brand-muted)">
                        Social Profile
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <Twitter
                          aria-hidden="true"
                          className="size-5 shrink-0 text-(--brand-ink)"
                        />
                        <span className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate">
                          {twitterName}
                        </span>
                      </div>
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 sm:px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-3.5 text-(--brand-muted)"
                        />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Facebook Block */}
                {facebookUrl && (
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                        Facebook
                      </span>
                      <span className="text-xs font-bold text-(--brand-muted)">
                        Social Profile
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <Facebook
                          aria-hidden="true"
                          className="size-5 shrink-0 text-(--brand-ink)"
                        />
                        <span className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate">
                          {facebookName}
                        </span>
                      </div>
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 sm:px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-3.5 text-(--brand-muted)"
                        />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Instagram Block */}
                {instagramUrl && (
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                        Instagram
                      </span>
                      <span className="text-xs font-bold text-(--brand-muted)">
                        Photo & Media
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <Instagram
                          aria-hidden="true"
                          className="size-5 shrink-0 text-(--brand-ink)"
                        />
                        <span className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate">
                          {instagramName}
                        </span>
                      </div>
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 sm:px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-3.5 text-(--brand-muted)"
                        />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* TikTok Block */}
                {tiktokUrl && (
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                        TikTok
                      </span>
                      <span className="text-xs font-bold text-(--brand-muted)">
                        Short Videos
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                        <TikTokIcon className="size-5 shrink-0 text-(--brand-ink)" />
                        <span className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate">
                          {tiktokName}
                        </span>
                      </div>
                      <a
                        href={tiktokUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 sm:px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="size-3.5 text-(--brand-muted)"
                        />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Status & Location Pill Card */}
            <motion.div variants={staggerItem} className="surface-card p-4 sm:p-5 w-full min-w-0 max-w-full">
              <div className="flex items-center gap-3">
                <span className="relative flex size-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                </span>
                <p className="text-xs font-bold text-(--brand-ink) truncate">
                  {copy.contact.status}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-(--brand-muted) pt-3 border-t border-(--brand-line)">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5 text-(--brand-orange) shrink-0"
                />
                <span className="truncate">{copy.contact.location}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Resend Form or Success View */}
          <motion.div
            variants={scaleIn}
            className="surface-card p-4 sm:p-6 md:p-8 w-full min-w-0 max-w-full overflow-hidden"
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
                  <div className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold text-(--brand-ink)">
                    {copy.contact.sendSuccessTitle}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-(--brand-muted)">
                    {copy.contact.sendSuccessSubtitle}
                  </p>
                  <Button
                    type="button"
                    onClick={() => setStatus('idle')}
                    variant="outline"
                    className="mt-6 rounded-full border-(--brand-line) font-bold text-(--brand-ink) hover:bg-(--brand-orange-soft) hover:border-(--brand-orange)"
                  >
                    {copy.contact.sendAnother}
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
                      {copy.contact.formTitle}
                    </h2>
                    <p className="mt-1 text-xs text-(--brand-muted)">
                      {copy.contact.formSubtitle}
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
                      <AlertCircle className="size-5 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold">{copy.contact.sendErrorTitle}</p>
                        <p className="mt-0.5 opacity-90">
                          {errorMessage || copy.contact.sendErrorTitle}
                        </p>
                      </div>
                    </div>
                  )}

                  <FieldGroup className="w-full min-w-0 max-w-full">
                    <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0 max-w-full">
                      {/* Name */}
                      <form.Field
                        name="name"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid} className="w-full min-w-0 max-w-full">
                              <FieldLabel
                                htmlFor={field.name}
                                className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                              >
                                {copy.contact.name}
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                disabled={status === 'loading'}
                                autoComplete="name"
                                placeholder={copy.contact.namePlaceholder}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                            <Field data-invalid={isInvalid} className="w-full min-w-0 max-w-full">
                              <FieldLabel
                                htmlFor={field.name}
                                className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                              >
                                {copy.contact.email}
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                type="email"
                                disabled={status === 'loading'}
                                autoComplete="email"
                                placeholder={copy.contact.emailPlaceholder}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                          <Field data-invalid={isInvalid} className="w-full min-w-0 max-w-full">
                            <FieldLabel
                              htmlFor={field.name}
                              className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                            >
                              {copy.contact.subject}
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="text"
                              disabled={status === 'loading'}
                              placeholder={copy.contact.subjectPlaceholder}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                          <Field data-invalid={isInvalid} className="w-full min-w-0 max-w-full">
                            <FieldLabel
                              htmlFor={field.name}
                              className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                            >
                              {copy.contact.message}
                            </FieldLabel>
                            <Textarea
                              id={field.name}
                              name={field.name}
                              disabled={status === 'loading'}
                              rows={5}
                              placeholder={copy.contact.messagePlaceholder}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                        <span>{copy.contact.sending}</span>
                      </>
                    ) : (
                      <>
                        <Send aria-hidden="true" className="size-4" />
                        <span>{copy.contact.send}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </Container>
    </main>
  )
}
