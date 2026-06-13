import { Link } from '@tanstack/react-router'
import { Github, Mail } from 'lucide-react'

import { getPublicCopy, siteProfile } from '#/features/portfolio/data'

export default function Footer() {
  const year = new Date().getFullYear()
  const copy = getPublicCopy()

  return (
    <footer className="mt-20 border-t border-[var(--brand-line)] px-4 pb-14 pt-10 text-[var(--brand-muted)]">
      <div className="page-wrap grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-start">
        <div>
          <p className="eyebrow mb-3">{copy.footer.eyebrow}</p>
          <p className="m-0 max-w-2xl text-sm leading-7">
            {copy.footer.description}
          </p>
          <p className="mt-5 text-xs">
            &copy; {year} {siteProfile.handle}. {copy.footer.rights}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-2">
            <Link to="/projects" className="footer-link">
              {copy.nav.projects}
            </Link>
            <Link to="/writing" className="footer-link">
              {copy.nav.writing}
            </Link>
            <Link to="/lab" className="footer-link">
              {copy.nav.lab}
            </Link>
            <Link to="/contact" className="footer-link">
              {copy.nav.contact}
            </Link>
          </div>

          <div className="flex gap-2">
            <a
              href={siteProfile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="icon-link"
            >
              <span className="sr-only">Open GitHub profile</span>
              <Github aria-hidden="true" className="size-4" />
            </a>
            <a
              href={`mailto:${siteProfile.contactEmail}`}
              className="icon-link"
            >
              <span className="sr-only">{copy.footer.email}</span>
              <Mail aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
