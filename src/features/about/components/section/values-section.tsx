import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { SectionHeader } from '#/components/marketing/section'
import type { PriorityItem, getAboutData } from '#/features/about/data'
import { defaultViewport, fadeUp } from '#/lib/motion'
import { cn } from '#/lib/utils'

type ValuesSectionProps = {
  values: ReturnType<typeof getAboutData>['values']
}

export function ValuesSection({ values }: ValuesSectionProps) {
  const [expandedValueKey, setExpandedValueKey] = useState<string | null>(null)

  const toggleValue = (key: string) => {
    setExpandedValueKey((prev) => (prev === key ? null : key))
  }

  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
      >
        <SectionHeader
          eyebrow={values.eyebrow}
          title={values.title}
          description={values.subtitle}
        />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="surface-card p-4 sm:p-5 bg-(--brand-orange-soft)/40 border-(--brand-line) text-xs text-(--brand-orange-deep) font-semibold flex items-center gap-3"
      >
        <ShieldCheck className="size-5 shrink-0 text-(--brand-orange)" />
        <span>{values.contextNote}</span>
      </motion.div>

      {/* Priority Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {values.items.map((item: PriorityItem) => {
          const isExpanded = expandedValueKey === item.key
          return (
            <motion.div
              key={item.key}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
                margin: '0px 0px -40px 0px',
              }}
              variants={fadeUp}
              onClick={() => toggleValue(item.key)}
              className={cn(
                'surface-card cursor-pointer p-4 transition-all duration-200 hover:border-(--brand-orange)',
                isExpanded &&
                  'ring-2 ring-(--brand-orange) bg-(--surface-strong)',
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-(--brand-orange-soft) text-xs font-black text-(--brand-orange-deep)">
                  #{item.rank}
                </span>
                <button
                  type="button"
                  aria-label="Toggle details"
                  className="text-(--brand-muted) hover:text-(--brand-ink)"
                >
                  {isExpanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>
              </div>

              <h3 className="text-sm font-bold text-(--brand-ink)">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-(--brand-muted) line-clamp-2">
                {item.summary}
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-(--brand-line) text-xs leading-relaxed text-(--brand-muted)">
                      {item.detail}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
