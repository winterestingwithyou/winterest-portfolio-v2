import { Award, Compass, Flame, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'motion/react'

import { SectionHeader } from '#/components/marketing/section'
import type { getAboutData } from '#/features/about/data'
import {
  defaultViewport,
  fadeUp,
  staggerContainer,
  staggerItem,
} from '#/lib/motion'

type DrivesSectionProps = {
  drives: ReturnType<typeof getAboutData>['drives']
}

export function DrivesSection({ drives }: DrivesSectionProps) {
  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
      >
        <SectionHeader
          eyebrow={drives.eyebrow}
          title={drives.title}
          description={drives.subtitle}
        />
      </motion.div>

      <motion.div
        variants={staggerContainer(0.1, 0.1)}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Card 1: Origin & Curiosity */}
        <motion.div
          variants={staggerItem}
          className="surface-card flex flex-col justify-between p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
              <Compass className="size-4" />
              <span>{drives.originTitle}</span>
            </div>
            <blockquote className="text-xl font-bold leading-snug text-(--brand-ink)">
              "{drives.originQuote}"
            </blockquote>
            <p className="text-xs leading-relaxed text-(--brand-muted)">
              {drives.originDetail}
            </p>
          </div>

          <div className="pt-6 border-t border-(--brand-line) space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
              <Sparkles className="size-4" />
              <span>{drives.curiosityTitle}</span>
            </div>
            <div className="text-sm font-semibold text-(--brand-ink)">
              "{drives.curiosityQuote}"
            </div>
            <p className="text-xs leading-relaxed text-(--brand-muted)">
              {drives.curiosityDetail}
            </p>
          </div>
        </motion.div>

        {/* Card 2: Mindset, Refactoring & Forecasting */}
        <motion.div
          variants={staggerItem}
          className="surface-card flex flex-col justify-between p-6 sm:p-8 space-y-6 bg-linear-to-br from-(--surface-strong) to-(--brand-orange-soft)/30"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-(--brand-orange) px-3 py-1 text-xs font-bold text-white shadow-xs">
              <Flame className="size-3.5" />
              <span>{drives.mindsetLabel}</span>
            </div>
            <h3 className="text-2xl font-bold text-(--brand-ink)">
              "{drives.mindsetQuote}"
            </h3>
            <p className="text-xs leading-relaxed text-(--brand-muted)">
              {drives.mindsetDetail}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-(--brand-line)">
            <div className="space-y-1.5">
              <div className="font-semibold text-xs text-(--brand-ink) flex items-center gap-1.5">
                <Zap className="size-3.5 text-(--brand-orange)" />
                {drives.refactoringTitle}
              </div>
              <p className="text-xs leading-relaxed text-(--brand-muted)">
                {drives.refactoringDetail}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="font-semibold text-xs text-(--brand-ink) flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-(--brand-orange)" />
                {drives.forecastingTitle}
              </div>
              <blockquote className="text-xs italic font-medium text-(--brand-ink) border-l-2 border-(--brand-orange) pl-2.5 my-1">
                "{drives.forecastingQuote}"
              </blockquote>
              <p className="text-xs leading-relaxed text-(--brand-muted)">
                {drives.forecastingDetail}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Hierarchy of Satisfaction */}
        <motion.div
          variants={staggerItem}
          className="surface-card flex flex-col justify-between p-6 sm:p-8 space-y-4"
        >
          <div>
            <h3 className="text-lg font-bold text-(--brand-ink) flex items-center gap-2">
              <Award className="size-5 text-(--brand-orange-deep)" />
              {drives.hierarchyTitle}
            </h3>
            <p className="text-xs text-(--brand-muted) mt-1">
              {drives.hierarchySubtitle}
            </p>

            <div className="space-y-2.5 pt-4">
              {drives.satisfactionHierarchy.map((item) => (
                <div
                  key={item.rank}
                  className="group flex items-center gap-3 rounded-lg border border-(--brand-line) bg-(--surface-strong) p-2.5 transition-colors hover:border-(--brand-orange)"
                >
                  <div className="grid size-6 shrink-0 place-items-center rounded-md bg-(--brand-orange-soft) text-[11px] font-extrabold text-(--brand-orange-deep)">
                    #{item.rank}
                  </div>
                  <h4 className="min-w-0 flex-1 text-xs font-semibold text-(--brand-ink) group-hover:text-(--brand-orange-deep) transition-colors">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-(--brand-line) bg-(--surface-strong) p-3 text-[11px] italic leading-relaxed text-(--brand-muted)">
            {drives.hierarchyNote}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
