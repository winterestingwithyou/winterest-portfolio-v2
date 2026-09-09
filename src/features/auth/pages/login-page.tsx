import { ArrowLeft } from 'lucide-react'

import ParaglideLocaleSwitcher from '#/components/locale-switcher.tsx'
import ThemeToggle from '#/components/theme-toggle'
import { LoginForm } from '#/features/auth/components/form/login-form'
import { LoginHeroPanel } from '#/features/auth/components/section/login-hero-panel'
import { getAuthCopy } from '#/features/auth/copy'

type LoginPageProps = {
  redirectTo?: string
}

export function LoginPage({ redirectTo }: LoginPageProps) {
  const copy = getAuthCopy()

  return (
    <main className="min-h-screen bg-background text-(--brand-ink)">
      <div className="mx-auto flex min-h-screen w-full max-w-296 flex-col justify-between px-5 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header
          className="flex items-center justify-between gap-4"
          aria-label="Authentication navigation"
        >
          <a
            href="/"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-(--brand-line) bg-card px-3.5 text-xs font-extrabold text-(--brand-ink) no-underline transition hover:-translate-y-px hover:border-(--brand-orange) hover:text-(--brand-orange-deep) sm:min-h-10 sm:text-sm"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {copy.backHome}
          </a>
          <div className="flex items-center gap-1.5">
            <ParaglideLocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <section className="my-auto grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-12 lg:py-8">
          <LoginHeroPanel copy={copy} />
          <LoginForm copy={copy} redirectTo={redirectTo} />
        </section>
      </div>
    </main>
  )
}
