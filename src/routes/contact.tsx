import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
} from 'lucide-react'
import { useState } from 'react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { getPublicCopy, siteProfile } from '#/features/portfolio/data'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const copy = getPublicCopy()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: { error?: string; success?: boolean } =
        await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || copy.contact.sendErrorTitle)
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err: unknown) {
      console.error('Failed to send contact message:', err)
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : copy.contact.sendErrorTitle,
      )
    }
  }

  return (
    <main className="px-4 py-12 sm:py-16">
      <Container className="max-w-5xl">
        <SectionHeader
          eyebrow={copy.contact.eyebrow}
          title={copy.contact.title}
          description={copy.contact.description}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Left Column: Direct Channels & Status */}
          <div className="grid gap-5">
            <div className="surface-card p-6 sm:p-7">
              <div className="flex items-center gap-3 border-b border-(--brand-line) pb-4">
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                  <MessageSquare aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-(--brand-ink)">
                    {copy.contact.directTitle}
                  </h2>
                  <p className="text-xs text-(--brand-muted)">
                    {copy.contact.directSubtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {/* GitHub Block */}
                <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                      GitHub
                    </span>
                    <span className="text-xs font-bold text-(--brand-muted)">
                      Public Profile
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Github
                        aria-hidden="true"
                        className="size-5 shrink-0 text-(--brand-ink)"
                      />
                      <span className="text-sm font-bold text-(--brand-ink) truncate">
                        {siteProfile.githubDisplayName}
                      </span>
                    </div>
                    <a
                      href={siteProfile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        className="size-3.5 text-(--brand-muted)"
                      />
                      <span>Open</span>
                    </a>
                  </div>
                </div>

                {/* Facebook Block */}
                <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                      Facebook
                    </span>
                    <span className="text-xs font-bold text-(--brand-muted)">
                      Social Profile
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Facebook
                        aria-hidden="true"
                        className="size-5 shrink-0 text-(--brand-ink)"
                      />
                      <span className="text-sm font-bold text-(--brand-ink) truncate">
                        {siteProfile.facebookName}
                      </span>
                    </div>
                    <a
                      href={siteProfile.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        className="size-3.5 text-(--brand-muted)"
                      />
                      <span>Open</span>
                    </a>
                  </div>
                </div>

                {/* Instagram Block */}
                <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                      Instagram
                    </span>
                    <span className="text-xs font-bold text-(--brand-muted)">
                      Social Profile
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Instagram
                        aria-hidden="true"
                        className="size-5 shrink-0 text-(--brand-ink)"
                      />
                      <span className="text-sm font-bold text-(--brand-ink) truncate">
                        {siteProfile.instagramName}
                      </span>
                    </div>
                    <a
                      href={siteProfile.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface) px-3 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        className="size-3.5 text-(--brand-muted)"
                      />
                      <span>Open</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Location Pill Card */}
            <div className="surface-card p-5">
              <div className="flex items-center gap-3">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                </span>
                <p className="text-xs font-bold text-(--brand-ink)">
                  {copy.contact.status}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-(--brand-muted) pt-3 border-t border-(--brand-line)">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5 text-(--brand-orange)"
                />
                <span>{copy.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Resend Form or Success View */}
          <div className="surface-card p-6 sm:p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-(--brand-ink)">
                  {copy.contact.sendSuccessTitle}
                </h3>
                <p className="mt-2 max-w-md text-sm text-(--brand-muted)">
                  {copy.contact.sendSuccessSubtitle}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-xs font-bold text-(--brand-ink) transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                >
                  {copy.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                    >
                      {copy.contact.name}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      disabled={status === 'loading'}
                      autoComplete="name"
                      placeholder={copy.contact.namePlaceholder}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1.5 min-h-11 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-3.5 text-sm text-(--brand-ink) placeholder:text-(--brand-muted) focus:border-(--brand-orange) focus:outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                    >
                      {copy.contact.email}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={status === 'loading'}
                      autoComplete="email"
                      placeholder={copy.contact.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1.5 min-h-11 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-3.5 text-sm text-(--brand-ink) placeholder:text-(--brand-muted) focus:border-(--brand-orange) focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                  >
                    {copy.contact.subject}
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    disabled={status === 'loading'}
                    placeholder={copy.contact.subjectPlaceholder}
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-3.5 text-sm text-(--brand-ink) placeholder:text-(--brand-muted) focus:border-(--brand-orange) focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                  >
                    {copy.contact.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    disabled={status === 'loading'}
                    rows={5}
                    placeholder={copy.contact.messagePlaceholder}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-3.5 py-3 text-sm text-(--brand-ink) placeholder:text-(--brand-muted) focus:border-(--brand-orange) focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-(--brand-orange) px-6 text-sm font-bold text-white shadow-[0_12px_32px_var(--brand-glow)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_var(--brand-glow)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
                  </button>
                  <p className="mt-2 text-center text-xs text-(--brand-muted)">
                    {copy.contact.sendNotice}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
