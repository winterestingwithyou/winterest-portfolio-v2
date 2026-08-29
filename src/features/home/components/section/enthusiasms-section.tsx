import {
  Cloud,
  Layers,
  Layout,
  Network,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  Workflow,
} from 'lucide-react'
import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import type { getPortfolioContent, getPublicCopy } from '#/features/portfolio/data'
import { defaultViewport, fadeUp } from '#/lib/motion'

const ENTHUSIASM_ICONS = {
  Terminal,
  Layout,
  Server,
  Layers,
  Workflow,
  Cloud,
  Network,
  ShieldCheck,
  Smartphone,
} as const

type EnthusiasmsSectionProps = {
  copy: ReturnType<typeof getPublicCopy>
  enthusiasms: ReturnType<typeof getPortfolioContent>['enthusiasms']
}

export function EnthusiasmsSection({
  copy,
  enthusiasms,
}: EnthusiasmsSectionProps) {
  return (
    <section className="px-4 py-14">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
        >
          <SectionHeader
            eyebrow={copy.home.enthusiasmsEyebrow}
            title={copy.home.enthusiasmsTitle}
            description={copy.home.enthusiasmsDescription}
          />
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enthusiasms.map((item) => {
            const Icon = ENTHUSIASM_ICONS[item.iconName]

            return (
              <motion.article
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                  margin: '0px 0px -40px 0px',
                }}
                variants={fadeUp}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-(--brand-line) bg-(--surface-card) p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:shadow-[0_20px_35px_-5px_var(--brand-orange-soft)]"
              >
                {/* Background ambient glow on hover */}
                <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-(--brand-orange)/10 blur-2xl transition duration-500 group-hover:scale-150 group-hover:bg-(--brand-orange)/20" />

                <div>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-(--brand-line) bg-(--brand-orange-soft) text-(--brand-orange-deep) shadow-xs transition duration-300 group-hover:scale-110 group-hover:border-(--brand-orange) group-hover:bg-(--brand-orange) group-hover:text-white">
                    <Icon aria-hidden="true" className="size-6" />
                  </div>

                  <h3 className="text-xl font-bold text-(--brand-ink) transition group-hover:text-(--brand-orange-deep)">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--brand-muted)">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
