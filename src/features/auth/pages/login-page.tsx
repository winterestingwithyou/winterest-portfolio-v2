import { ArrowLeft } from 'lucide-react'

import ParaglideLocaleSwitcher from '#/components/locale-switcher.tsx'
import ThemeToggle from '#/components/theme-toggle'
import { LoginForm } from '#/features/auth/components/form/login-form'
import { LoginHeroPanel } from '#/features/auth/components/section/login-hero-panel'
import { getAuthCopy } from '#/features/auth/content/auth-copy'

type LoginPageProps = {
  redirectTo?: string
}

export function LoginPage({ redirectTo }: LoginPageProps) {
  const copy = getAuthCopy()

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
          <LoginHeroPanel copy={copy} />
          <LoginForm copy={copy} redirectTo={redirectTo} />
        </section>
      </div>
    </main>
  )
}
