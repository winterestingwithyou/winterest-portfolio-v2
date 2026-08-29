import { Target } from 'lucide-react'
import { motion } from 'motion/react'

import { SectionHeader } from '#/components/marketing/section'
import type { getAboutData } from '#/features/about/data'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '#/lib/motion'

type CurrentlyExploringSectionProps = {
  exploring: ReturnType<typeof getAboutData>['exploring']
}

export function CurrentlyExploringSection({
  exploring,
}: CurrentlyExploringSectionProps) {
  return (
    <section className="space-y-8 pb-10">
      <motion.div variants={fadeUp}>
        <SectionHeader
          eyebrow={exploring.eyebrow}
          title={exploring.title}
          description={exploring.subtitle}
        />
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08, 0.1)}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {exploring.items.map((item) => (
          <motion.div
            key={item.title}
            variants={staggerItem}
            className="surface-card p-5 space-y-2 transition-all hover:border-(--brand-orange)"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
              {item.category}
            </span>
            <h3 className="text-base font-bold text-(--brand-ink)">
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed text-(--brand-muted)">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Long Term Ambition Banner */}
      <motion.div
        variants={scaleIn}
        className="surface-card p-6 sm:p-8 bg-linear-to-r from-(--brand-orange-soft)/50 via-(--surface-strong) to-(--brand-orange-soft)/50 border-(--brand-line) text-center space-y-3"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-(--brand-orange-deep)">
          <Target className="size-4" />
          {exploring.ambitionTitle}
        </span>
        <p className="max-w-2xl mx-auto text-base sm:text-lg font-bold text-(--brand-ink)">
          "{exploring.ambitionText}"
        </p>
      </motion.div>
    </section>
  )
}
