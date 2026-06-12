import { Link } from '@tanstack/react-router'
import { Github, Mail } from 'lucide-react'

import { siteProfile } from '#/features/portfolio/data'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--brand-line)] px-4 pb-14 pt-10 text-[var(--brand-muted)]">
      <div className="page-wrap grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-start">
        <div>
          <p className="eyebrow mb-3">Winterest Portfolio v2</p>
          <p className="m-0 max-w-2xl text-sm leading-7">
            Cloudflare-powered portfolio, CMS roadmap, and developer lab for{' '}
            {siteProfile.name}. Built Bun-first and kept ready for edge
            deployment.
          </p>
          <p className="mt-5 text-xs">
            &copy; {year} {siteProfile.handle}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-2">
            <Link to="/projects" className="footer-link">
              Projects
            </Link>
            <Link to="/writing" className="footer-link">
              Writing
            </Link>
            <Link to="/lab" className="footer-link">
              Lab
            </Link>
            <Link to="/contact" className="footer-link">
              Contact
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
              <span className="sr-only">Email Winterest</span>
              <Mail aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
