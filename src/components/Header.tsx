import { Link } from '@tanstack/react-router'
import { Cloud, Github, Mail } from 'lucide-react'

import { siteProfile } from '#/features/portfolio/data'

import ParaglideLocaleSwitcher from './LocaleSwitcher.tsx'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/lab', label: 'Lab' },
  { to: '/writing', label: 'Writing' },
  { to: '/stack', label: 'Stack' },
  { to: '/contact', label: 'Contact' },
] as const

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[var(--header-bg)] px-4 backdrop-blur-xl">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-ink)] no-underline shadow-[0_10px_28px_rgba(244,129,32,0.12)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)] sm:px-4"
          activeProps={{ className: 'is-active-brand' }}
        >
          <span className="grid size-7 place-items-center rounded-full bg-[var(--brand-orange)] text-white">
            <Cloud aria-hidden="true" className="size-4" />
          </span>
          <span>{siteProfile.domain}</span>
        </Link>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-2 gap-y-2 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              {item.label}
            </Link>
          ))}
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
          <ParaglideLocaleSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
