import { Link } from '@tanstack/react-router'
import { Mail, Terminal } from 'lucide-react'
import { motion } from 'motion/react'

import { Container } from '#/components/marketing/section'
import type { getHomeCopy } from '#/features/home/copy'
import { defaultViewport, fadeIn, scaleIn } from '#/lib/motion'

type HomeCtaSectionProps = {
  copy: ReturnType<typeof getHomeCopy>
}

export function HomeCtaSection({ copy }: HomeCtaSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeIn}
      className="px-4 py-14"
    >
      <Container>
        <motion.div
          variants={scaleIn}
          className="command-strip grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <p className="m-0 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-orange-200">
              <Terminal aria-hidden="true" className="size-4" />
              bun run build
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {copy.cta.title}
            </h2>
          </div>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-(--brand-dark) no-underline transition hover:-translate-y-0.5"
          >
            <Mail aria-hidden="true" className="size-4" />
            {copy.cta.contact}
          </Link>
        </motion.div>
      </Container>
    </motion.section>
  )
}
