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
import type { getHomeCopy } from '#/features/home/copy'
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
  copy: ReturnType<typeof getHomeCopy>
  enthusiasms?: ReturnType<typeof getHomeCopy>['enthusiasms']['items']
}

export function EnthusiasmsSection({
  copy,
  enthusiasms,
}: EnthusiasmsSectionProps) {
  const items = enthusiasms ?? copy.enthusiasms.items

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
            eyebrow={copy.enthusiasms.eyebrow}
            title={copy.enthusiasms.title}
            description={copy.enthusiasms.description}
          />
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
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
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-(--brand-line) bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--brand-orange)"
              >
                <div>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-(--brand-line) bg-(--brand-orange-soft) text-(--brand-orange-deep) transition duration-300 group-hover:scale-110 group-hover:border-(--brand-orange) group-hover:bg-(--brand-orange) group-hover:text-white">
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
