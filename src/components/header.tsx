import { Link, useRouterState } from '@tanstack/react-router'
import { Cloud, Github, LayoutDashboard, Mail, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getPublicCopy } from '#/features/portfolio/data'
import { usePublicSocialLinks } from '#/features/social/hooks'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'

import ParaglideLocaleSwitcher from './locale-switcher.tsx'
import GooeyNav from './react-bits/gooey-nav/gooey-nav'
import ThemeToggle from './theme-toggle'

const iconLinkClasses = cn(
  'inline-grid size-9 place-items-center rounded-full',
  'border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) no-underline',
  'shadow-[0_10px_28px_rgba(42,26,10,0.08)]',
  'transition-[background-color,border-color,color,transform] duration-[180ms] ease-[ease]',
  'hover:border-(--brand-orange) hover:text-(--brand-orange-deep) hover:-translate-y-px',
)

const mobileNavItemBase = cn(
  'flex min-h-[2.85rem] items-center gap-[0.7rem] rounded-[0.85rem] px-[0.9rem]',
  'text-(--brand-muted) text-[0.95rem] font-[780] no-underline',
  'transition-[background-color,color,transform] duration-[180ms] ease-[ease]',
  'hover:bg-[color-mix(in_srgb,var(--brand-orange-soft)_56%,transparent)] hover:text-(--brand-ink) hover:translate-x-0.5',
)

export default function Header() {
  const copy = getPublicCopy()
  const { data: socialLinks = [] } = usePublicSocialLinks()
  const githubLink = socialLinks.find((l) => l.platform === 'github')
  const githubUrl = githubLink?.url || ''
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const navItems = [
    { href: '/about', label: copy.nav.about },
    { href: '/projects', label: copy.nav.projects },
    { href: '/stack', label: copy.nav.stack },
    { href: '/contact', label: copy.nav.contact },
  ] as const
  const activeNavIndex = navItems.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileNavOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-(--brand-line) bg-(--header-bg) px-4 backdrop-blur-xl">
      <nav className="page-wrap flex items-center justify-between gap-x-2 sm:gap-x-3 py-3 sm:py-4">
        {/* Brand lockup */}
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className={cn(
            'relative inline-flex min-h-10 shrink-0 items-center gap-[0.65rem] overflow-hidden whitespace-nowrap',
            'rounded-full border border-[color-mix(in_srgb,var(--brand-orange)_34%,var(--brand-line))]',
            'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-strong)_88%,white),color-mix(in_srgb,var(--brand-orange-soft)_52%,transparent)),var(--surface-strong)]',
            'py-[0.3rem] pr-[0.9rem] pl-[0.35rem] text-(--brand-ink) no-underline',
            'shadow-[0_14px_34px_rgba(244,129,32,0.14),inset_0_1px_0_color-mix(in_srgb,white_70%,transparent)]',
            'transition-[border-color,box-shadow,transform] duration-180 ease-[ease]',
            "after:absolute after:inset-[0.2rem] after:rounded-[inherit] after:content-[''] after:opacity-[0.42] after:pointer-events-none",
            'after:bg-[linear-gradient(110deg,transparent_8%,rgba(255,255,255,0.32)_38%,transparent_62%)]',
            'hover:border-[color-mix(in_srgb,var(--brand-orange)_74%,white)] hover:-translate-y-px',
            'hover:shadow-[0_16px_44px_var(--brand-glow),inset_0_1px_0_color-mix(in_srgb,white_78%,transparent)]',
          )}
          activeProps={{
            className: cn(
              'border-[color-mix(in_srgb,var(--brand-orange)_74%,white)] -translate-y-px',
              'shadow-[0_16px_44px_var(--brand-glow),inset_0_1px_0_color-mix(in_srgb,white_78%,transparent)]',
            ),
          }}
        >
          {/* Brand mark */}
          <span
            className={cn(
              'relative z-1 grid size-8 shrink-0 place-items-center rounded-full',
              'border border-[color-mix(in_srgb,white_42%,transparent)] text-white',
              'bg-[radial-gradient(circle_at_32%_24%,#ffd7a4_0_20%,transparent_22%),linear-gradient(145deg,#ff9d3e,var(--brand-orange)_58%,#c7520c)]',
              'shadow-[0_10px_24px_rgba(244,129,32,0.34),inset_0_1px_0_rgba(255,255,255,0.36)]',
            )}
          >
            <Cloud aria-hidden="true" className="size-4" />
            <Sparkles
              aria-hidden="true"
              className="absolute right-[-0.18rem] top-[-0.12rem] size-3 text-[#fff6da] drop-shadow-[0_2px_5px_rgba(116,49,4,0.28)]"
            />
          </span>
          {/* Brand name */}
          <span className="relative z-1 shrink-0 whitespace-nowrap text-[0.95rem] font-[850] tracking-normal text-(--brand-ink)">
            Winterest
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center md:flex">
          <GooeyNav
            items={[...navItems]}
            initialActiveIndex={activeNavIndex}
            particleCount={20}
            particleDistances={[34, 8]}
            particleR={200}
            timeVariance={300}
            colors={[1, 1, 1, 2, 1, 2]}
          />
        </div>

        {/* Controls cluster */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(iconLinkClasses, 'hidden sm:inline-grid')}
            >
              <span className="sr-only">Open GitHub profile</span>
              <Github aria-hidden="true" className="size-4" />
            </a>
          )}
          <Link
            to="/contact"
            className={cn(iconLinkClasses, 'hidden sm:inline-grid')}
          >
            <span className="sr-only">Contact Winterest</span>
            <Mail aria-hidden="true" className="size-4" />
          </Link>
          <DashboardLink />
          <ParaglideLocaleSwitcher />
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            className={cn(
              'relative inline-grid size-[2.35rem] place-items-center rounded-full md:hidden',
              'border border-(--brand-line) text-(--brand-ink)',
              'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-strong)_86%,transparent),color-mix(in_srgb,var(--brand-orange-soft)_46%,transparent)),var(--surface-strong)]',
              'shadow-[0_12px_28px_rgba(42,26,10,0.08)]',
              'transition-[border-color,box-shadow,transform] duration-180 ease-[ease]',
              'hover:border-[color-mix(in_srgb,var(--brand-orange)_68%,white)] hover:shadow-[0_14px_36px_var(--brand-glow)]',
              mobileNavOpen &&
                'border-[color-mix(in_srgb,var(--brand-orange)_68%,white)] shadow-[0_14px_36px_var(--brand-glow)] -translate-y-px',
            )}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
          >
            <span className="sr-only">
              {mobileNavOpen ? 'Close navigation' : 'Open navigation'}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'absolute h-0.5 w-4 rounded-full bg-current origin-center',
                'transition-[opacity,transform] duration-220 ease-[ease]',
                mobileNavOpen ? 'rotate-45' : 'translate-y-[-0.34rem]',
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                'absolute h-0.5 w-4 rounded-full bg-current origin-center',
                'transition-[opacity,transform] duration-220 ease-[ease]',
                mobileNavOpen ? 'scale-x-0 opacity-0' : 'scale-x-[0.78]',
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                'absolute h-0.5 w-4 rounded-full bg-current origin-center',
                'transition-[opacity,transform] duration-220 ease-[ease]',
                mobileNavOpen ? '-rotate-45' : 'translate-y-[0.34rem]',
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile nav panel */}
      <div
        id="mobile-navigation"
        className={cn(
          'page-wrap grid overflow-hidden md:hidden',
          'transition-[grid-template-rows,opacity,transform] duration-240 ease-[ease]',
          mobileNavOpen
            ? 'grid-rows-[1fr] opacity-100 translate-y-0'
            : 'grid-rows-[0fr] opacity-0 -translate-y-2',
        )}
        aria-hidden={!mobileNavOpen}
      >
        <div
          className={cn(
            'grid min-h-0 gap-[0.35rem] overflow-hidden border-t transition-all duration-240',
            mobileNavOpen
              ? 'border-(--brand-line) pt-3 pb-[0.9rem]'
              : 'border-transparent py-0',
          )}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  mobileNavItemBase,
                  isActive &&
                    'bg-(--brand-orange) text-white shadow-[0_14px_34px_var(--brand-glow)]',
                )}
                tabIndex={mobileNavOpen ? 0 : -1}
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Mobile action links */}
          <div className="grid grid-cols-2 gap-2 pt-[0.45rem]">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  mobileNavItemBase,
                  'justify-center border border-(--brand-line) bg-(--surface-strong) text-sm',
                )}
                tabIndex={mobileNavOpen ? 0 : -1}
              >
                <Github aria-hidden="true" className="size-4" />
                GitHub
              </a>
            )}
            <Link
              to="/contact"
              className={cn(
                mobileNavItemBase,
                'justify-center border border-(--brand-line) bg-(--surface-strong) text-sm',
              )}
              tabIndex={mobileNavOpen ? 0 : -1}
              onClick={() => setMobileNavOpen(false)}
            >
              <Mail aria-hidden="true" className="size-4" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function DashboardLink() {
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    let isMounted = true

    void authClient.getSession().then((result) => {
      if (isMounted) {
        setHasSession(Boolean(result.data?.user))
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!hasSession) {
    return null
  }

  return (
    <Link to="/dashboard" className={iconLinkClasses}>
      <span className="sr-only">Dashboard</span>
      <LayoutDashboard aria-hidden="true" className="size-4" />
    </Link>
  )
}
