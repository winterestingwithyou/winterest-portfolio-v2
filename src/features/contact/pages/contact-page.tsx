import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { ContactForm } from '#/features/contact/components/form/contact-form'
import { ContactChannels } from '#/features/contact/components/section/contact-channels'
import { getContactCopy } from '#/features/contact/copy'
import { defaultViewport, fadeIn, fadeUp } from '#/lib/motion'

export function ContactPage() {
  const copy = getContactCopy()

  return (
    <main className="overflow-x-clip px-4 py-12 sm:py-16">
      <Container className="max-w-5xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <SectionHeader
            eyebrow={copy.page.eyebrow}
            title={copy.page.title}
            description={copy.page.description}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeIn}
          className="mt-8 grid w-full min-w-0 max-w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <ContactChannels copy={copy.direct} />
          <ContactForm copy={copy.form} />
        </motion.div>
      </Container>
    </main>
  )
}
