import { createFileRoute } from '@tanstack/react-router'
import { Github, Mail, Send, Terminal } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { siteProfile } from '#/features/portfolio/data'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="px-4 py-14 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeader
          eyebrow="Contact"
          title="Want to talk about web systems, projects, or experiments?"
          description="GitHub is the best public channel for now. Email is available for direct messages, project conversations, or anything that needs a little more context."
        />

        <div className="grid gap-5">
          <div className="contact-signal">
            <div>
              <p className="m-0 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-orange-200">
                <Terminal aria-hidden="true" className="size-4" />
                contact --mode practical
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                Best fit: fullstack web projects, Cloudflare workflows,
                portfolio systems, and useful developer experiments.
              </h2>
            </div>
            <div className="contact-signal__status" aria-hidden="true">
              <span />
              Async friendly
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">
              Direct channels
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={siteProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
              >
                <Github aria-hidden="true" className="size-4" />
                GitHub
              </a>
              <a
                href={`mailto:${siteProfile.contactEmail}`}
                className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
              >
                <Mail aria-hidden="true" className="size-4" />
                {siteProfile.contactEmail}
              </a>
            </div>
          </div>

          <form
            action={`mailto:${siteProfile.contactEmail}`}
            method="post"
            encType="text/plain"
            className="surface-card grid gap-5 p-6"
          >
            <div>
              <label
                htmlFor="name"
                className="text-sm font-bold text-[var(--brand-ink)]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--brand-ink)]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-bold text-[var(--brand-ink)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--brand-ink)]"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="text-sm font-bold text-[var(--brand-ink)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-2 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-3 text-sm text-[var(--brand-ink)]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              <Send aria-hidden="true" className="size-4" />
              Draft email
            </button>
          </form>
        </div>
      </Container>
    </main>
  )
}
