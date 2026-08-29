import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'

import { getPublicCopy, siteProfile } from '#/features/portfolio/data'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { defaultSiteSettings } from '#/features/settings/types'
import { socialQueryOptions } from '#/features/social/query-options'
import { platformMetaMap } from '#/features/social/types'

export default function Footer() {
  const year = new Date().getFullYear()
  const copy = getPublicCopy()
  const { data: settings = defaultSiteSettings } = useQuery(
    settingsQueryOptions.get(),
  )
  const { data: socialLinks = [] } = useQuery(socialQueryOptions.publicList())

  const siteName = settings.siteName || siteProfile.handle
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
            {socialLinks.map((item) => {
              const meta = platformMetaMap[item.platform]
              const IconComponent = meta.icon

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-link"
                  title={item.accountName || meta.name}
                >
                  <span className="sr-only">{meta.name}</span>
                  <IconComponent className="size-4" />
                </a>
              )
            })}
            {publicEmail && (
              <a
                href={`mailto:${publicEmail}`}
                className="icon-link"
                title={copy.footer.email}
              >
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
