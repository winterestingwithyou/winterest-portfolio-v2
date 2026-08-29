import { BookOpen, Users } from 'lucide-react'
import { motion } from 'motion/react'

import { SectionHeader } from '#/components/marketing/section'
import { Timeline } from '#/components/ui/timeline'
import type { getAboutData } from '#/features/about/data'
import { defaultViewport, fadeUp } from '#/lib/motion'

type JourneyTimelineSectionProps = {
  journey: ReturnType<typeof getAboutData>['journey']
}

export function JourneyTimelineSection({
  journey,
}: JourneyTimelineSectionProps) {
  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
      >
        <SectionHeader
          eyebrow={journey.eyebrow}
          title={journey.title}
          description={journey.subtitle}
        />
      </motion.div>

      <Timeline
        data={journey.steps.map((step) => ({
          title: step.year,
          tagline: step.tagline,
          content: (
            <div className="surface-card p-5 sm:p-6 transition-all hover:border-(--brand-orange) hover:shadow-[0_12px_32px_var(--brand-glow)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--brand-line) pb-3 mb-3">
                <span className="text-sm font-black tracking-wider text-(--brand-orange-deep) uppercase md:hidden">
                  {step.year}
                </span>
                <span className="text-xs font-semibold text-(--brand-muted) italic">
                  {step.tagline}
                </span>
              </div>

              <h3 className="text-xl font-bold text-(--brand-ink)">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--brand-muted)">
                {step.description}
              </p>

              {step.highlights.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {step.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-md bg-(--brand-orange-soft) px-2.5 py-0.5 text-xs font-medium text-(--brand-orange-deep)"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ),
        }))}
      />

      {/* Current Stage & Soft Skills Callout */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
          variants={fadeUp}
          className="surface-card p-5 border-l-4 border-l-sky-500"
        >
          <h4 className="text-sm font-bold text-(--brand-ink) flex items-center gap-2">
            <BookOpen className="size-4 text-sky-500" />
            {journey.currentStageTitle}
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
            {journey.currentStage}
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
          variants={fadeUp}
          className="surface-card p-5 border-l-4 border-l-emerald-500"
        >
          <h4 className="text-sm font-bold text-(--brand-ink) flex items-center gap-2">
            <Users className="size-4 text-emerald-500" />
            {journey.growthFocusTitle}
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
            {journey.softSkillsFocus}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
