import { Link, useRouterState } from '@tanstack/react-router'
import { Cloud, Github, LayoutDashboard, Mail, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getPublicCopy, siteProfile } from '#/features/portfolio/data'
import { authClient } from '#/lib/auth-client'

import ParaglideLocaleSwitcher from './LocaleSwitcher.tsx'
import GooeyNav from './react-bits/gooey-nav/GooeyNav'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const copy = getPublicCopy()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const navItems = [
    { href: '/about', label: copy.nav.about },
    { href: '/projects', label: copy.nav.projects },
    { href: '/lab', label: copy.nav.lab },
    { href: '/writing', label: copy.nav.writing },
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
    <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[var(--header-bg)] px-4 backdrop-blur-xl">
      <nav className="page-wrap flex items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="brand-lockup"
          activeProps={{ className: 'is-active-brand' }}
        >
          <span className="brand-mark">
            <Cloud aria-hidden="true" className="size-4" />
            <Sparkles aria-hidden="true" className="brand-spark size-3" />
          </span>
          <span className="brand-name">Winterest</span>
        </Link>

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

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <a
            href={siteProfile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="icon-link hidden sm:inline-grid"
          >
            <span className="sr-only">Open GitHub profile</span>
            <Github aria-hidden="true" className="size-4" />
          </a>
          <a
            href={`mailto:${siteProfile.contactEmail}`}
            className="icon-link hidden sm:inline-grid"
          >
            <span className="sr-only">Email Winterest</span>
            <Mail aria-hidden="true" className="size-4" />
          </a>
          <DashboardLink />
          <ParaglideLocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="mobile-menu-button md:hidden"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
          >
            <span className="sr-only">
              {mobileNavOpen ? 'Close navigation' : 'Open navigation'}
            </span>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>
      <div
        id="mobile-navigation"
        className={`mobile-nav-panel page-wrap md:hidden ${
          mobileNavOpen ? 'is-open' : ''
        }`}
        aria-hidden={!mobileNavOpen}
      >
        <div className="mobile-nav-surface">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`mobile-nav-link ${isActive ? 'is-active' : ''}`}
                tabIndex={mobileNavOpen ? 0 : -1}
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="mobile-nav-actions">
            <a
              href={siteProfile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="mobile-nav-action"
              tabIndex={mobileNavOpen ? 0 : -1}
            >
              <Github aria-hidden="true" className="size-4" />
              GitHub
            </a>
            <a
              href={`mailto:${siteProfile.contactEmail}`}
              className="mobile-nav-action"
              tabIndex={mobileNavOpen ? 0 : -1}
            >
              <Mail aria-hidden="true" className="size-4" />
              Email
            </a>
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
    <Link to="/dashboard" className="icon-link">
      <span className="sr-only">Dashboard</span>
      <LayoutDashboard aria-hidden="true" className="size-4" />
    </Link>
  )
}
