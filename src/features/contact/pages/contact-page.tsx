import { motion } from 'motion/react'

import { SectionHeader } from '#/components/marketing/section'
import { ContactForm } from '#/features/contact/components/form/contact-form'
import { ContactChannels } from '#/features/contact/components/section/contact-channels'
import { getContactCopy } from '#/features/contact/copy'
import type { ContactPageConfig } from '#/features/portfolio/page-content-schemas'
import { defaultViewport, fadeIn, fadeUp } from '#/lib/motion'
import { getLocale } from '#/paraglide/runtime'

type ContactPageProps = {
  pageContent?: ContactPageConfig
}

export function ContactPage({ pageContent }: ContactPageProps) {
  const copy = getContactCopy()
  const locale = getLocale() === 'id' ? 'id' : 'en'

  const resolvedEyebrow =
    (locale === 'en' ? pageContent?.eyebrowEn : pageContent?.eyebrowId) ||
    copy.page.eyebrow
  const resolvedTitle =
    (locale === 'en' ? pageContent?.titleEn : pageContent?.titleId) ||
    copy.page.title
  const resolvedDescription =
    pageContent?.showDescription !== false
      ? (locale === 'en'
          ? pageContent?.descriptionEn
          : pageContent?.descriptionId) || copy.page.description
      : undefined

  const directChannelsCopy = {
    ...copy.direct,
    title:
      (locale === 'en'
        ? pageContent?.directTitleEn
        : pageContent?.directTitleId) || copy.direct.title,
    subtitle:
      (locale === 'en'
        ? pageContent?.directSubtitleEn
        : pageContent?.directSubtitleId) || copy.direct.subtitle,
    status:
      (locale === 'en'
        ? pageContent?.directStatusEn
        : pageContent?.directStatusId) || copy.direct.status,
    location:
      (locale === 'en'
        ? pageContent?.directLocationEn
        : pageContent?.directLocationId) || copy.direct.location,
  }

  const formCopy = {
    ...copy.form,
    title:
      (locale === 'en' ? pageContent?.formTitleEn : pageContent?.formTitleId) ||
      copy.form.title,
    subtitle:
      (locale === 'en'
        ? pageContent?.formSubtitleEn
        : pageContent?.formSubtitleId) || copy.form.subtitle,
  }

  return (
    <main className="overflow-x-clip py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <SectionHeader
            eyebrow={resolvedEyebrow}
            title={resolvedTitle}
            description={resolvedDescription}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeIn}
          className="mt-8 grid w-full min-w-0 max-w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <ContactChannels copy={directChannelsCopy} />
          <ContactForm copy={formCopy} />
        </motion.div>
      </div>
    </main>
  )
}
