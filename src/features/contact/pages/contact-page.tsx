import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { ContactForm } from '#/features/contact/components/form/contact-form'
import { ContactChannels } from '#/features/contact/components/section/contact-channels'
import { getPublicCopy } from '#/features/portfolio/data'
import { defaultViewport, fadeIn, fadeUp } from '#/lib/motion'

export function ContactPage() {
  const copy = getPublicCopy()

  return (
    <main className="overflow-x-clip px-4 py-12 sm:py-16">
      <Container className="max-w-5xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <SectionHeader
            eyebrow={copy.contact.eyebrow}
            title={copy.contact.title}
            description={copy.contact.description}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeIn}
          className="mt-8 grid w-full min-w-0 max-w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <ContactChannels copy={copy.contact} />
          <ContactForm copy={copy.contact} />
        </motion.div>
      </Container>
    </main>
  )
}
