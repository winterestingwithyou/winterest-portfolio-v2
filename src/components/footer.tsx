import { Link } from '@tanstack/react-router'
import { Facebook, Github, Instagram, Mail, Twitter } from 'lucide-react'

import { getPublicCopy, siteProfile } from '#/features/portfolio/data'
import { useSiteSettings } from '#/features/settings/hooks'
import { defaultSiteSettings } from '#/features/settings/types'

function TikTokIcon({ className = 'size-4' }: { className?: string }) {
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

export default function Footer() {
  const year = new Date().getFullYear()
  const copy = getPublicCopy()
  const { data: settings = defaultSiteSettings } = useSiteSettings()

  const siteName = settings.siteName || siteProfile.handle
  const githubUrl = settings.githubUrl || ''
  const facebookUrl = settings.facebookUrl || ''
  const instagramUrl = settings.instagramUrl || ''
  const twitterUrl = settings.twitterUrl || ''
  const tiktokUrl = settings.tiktokUrl || ''
  const publicEmail = settings.publicEmail || ''

  return (
    <footer className="mt-20 border-t border-(--brand-line) px-4 pb-14 pt-10 text-(--brand-muted)">
      <div className="page-wrap grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-start">
        <div>
          <p className="eyebrow mb-3">{copy.footer.eyebrow}</p>
          <p className="m-0 max-w-2xl text-sm leading-7">
            {settings.siteDescription || copy.footer.description}
          </p>
          <p className="mt-5 text-xs">
            &copy; {year} {siteName}. {copy.footer.rights}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-2">
            <Link to="/projects" className="footer-link">
              {copy.nav.projects}
            </Link>
            <Link to="/about" className="footer-link">
              {copy.nav.about}
            </Link>
            <Link to="/contact" className="footer-link">
              {copy.nav.contact}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="icon-link"
              >
                <span className="sr-only">GitHub</span>
                <Github aria-hidden="true" className="size-4" />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="icon-link"
              >
                <span className="sr-only">Facebook</span>
                <Facebook aria-hidden="true" className="size-4" />
              </a>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="icon-link"
              >
                <span className="sr-only">Instagram</span>
                <Instagram aria-hidden="true" className="size-4" />
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="icon-link"
              >
                <span className="sr-only">Twitter / X</span>
                <Twitter aria-hidden="true" className="size-4" />
              </a>
            )}
            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="icon-link"
              >
                <span className="sr-only">TikTok</span>
                <TikTokIcon className="size-4" />
              </a>
            )}
            {publicEmail && (
              <a href={`mailto:${publicEmail}`} className="icon-link">
                <span className="sr-only">{copy.footer.email}</span>
                <Mail aria-hidden="true" className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
