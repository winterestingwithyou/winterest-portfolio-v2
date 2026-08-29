import {
  Code2,
  Compass,
  Flag,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { motion } from 'motion/react'

import { SectionHeader } from '#/components/marketing/section'
import type { getAboutData } from '#/features/about/data'
import {
  fadeUp,
  flowNodeVariant,
  flowPathVariant,
  scaleIn,
  timelineStepVariant,
} from '#/lib/motion'
import { cn } from '#/lib/utils'

const STEP_ICONS = [Target, Flag, Compass, Code2, ShieldCheck, Rocket, Sparkles]

type EngineeringMindsetSectionProps = {
  workflow: ReturnType<typeof getAboutData>['workflow']
}

export function EngineeringMindsetSection({
  workflow,
}: EngineeringMindsetSectionProps) {
  return (
    <section className="space-y-12">
      <motion.div variants={fadeUp}>
        <SectionHeader
          eyebrow={workflow.eyebrow}
          title={workflow.title}
          description={workflow.subtitle}
        />
      </motion.div>

      {/* Central Serpentine S-Curve Workflow Timeline */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {workflow.steps.map((step, index) => {
          const isOddStep = index % 2 === 0 // index 0, 2, 4, 6 -> Step 01, 03, 05, 07
          const isLast = index === workflow.steps.length - 1
          const StepIcon = STEP_ICONS[index] || Code2
          const borderClass =
            index % 3 === 0
              ? 'border-(--brand-orange)'
              : index % 3 === 1
                ? 'border-(--brand-orange-deep)'
                : 'border-(--brand-orange)/60'
          const circleNode = (
            <motion.div
              variants={flowNodeVariant}
              className={cn(
                'group relative flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-full border-4 bg-(--surface-strong) text-(--brand-orange-deep) shadow-xl transition-all duration-300 hover:scale-110 hover:border-(--brand-orange) z-10',
                isOddStep ? 'sm:-translate-x-6' : 'sm:translate-x-6',
                borderClass,
              )}
            >
              <StepIcon className="size-6 sm:size-7 transition-transform duration-200 group-hover:scale-110 text-(--brand-orange)" />
              <span
                className={cn(
                  'absolute -bottom-1 flex size-5 sm:size-6 items-center justify-center rounded-full bg-(--brand-orange-deep) text-[10px] sm:text-xs font-black text-white shadow-xs',
                  '-right-1',
                  isOddStep ? 'sm:-right-1' : 'sm:-left-1',
                )}
              >
                {step.step}
              </span>
            </motion.div>
          )

          const textNode = (
            <motion.div
              variants={timelineStepVariant(isOddStep)}
              className={cn(
                'space-y-1.5 transition-all duration-200',
                isOddStep
                  ? 'text-left sm:text-right sm:ml-auto max-w-md sm:pr-6'
                  : 'text-left sm:mr-auto max-w-md sm:pl-6',
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-2 flex-wrap justify-start',
                  isOddStep ? 'sm:justify-end' : 'sm:justify-start',
                )}
              >
                <span
                  className={cn(
                    'rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[10px] sm:text-xs font-black tracking-widest text-(--brand-orange-deep) uppercase shrink-0 border border-(--brand-orange)/20',
                    isOddStep ? 'order-1 sm:order-2' : 'order-1',
                  )}
                >
                  Step {step.step}
                </span>
                <h3
                  className={cn(
                    'text-base sm:text-lg font-black text-(--brand-ink) tracking-tight',
                    isOddStep ? 'order-2 sm:order-1' : 'order-2',
                  )}
                >
                  {step.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-(--brand-muted)">
                {step.description}
              </p>
            </motion.div>
          )

          return (
            <motion.div
              key={step.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="relative pb-8 sm:pb-0"
            >
              {/* Vertical flow connector for mobile */}
              {!isLast && (
                <div className="sm:hidden absolute left-7 top-10 -bottom-9 w-0.5 -translate-x-1/2 pointer-events-none z-0">
                  <motion.div
                    variants={{
                      hidden: { scaleY: 0 },
                      visible: {
                        scaleY: 1,
                        transition: { duration: 0.5, ease: 'easeOut' },
                      },
                    }}
                    style={{ transformOrigin: 'top' }}
                    className="h-full w-full bg-linear-to-b from-(--brand-orange) via-(--brand-orange) to-(--brand-orange-deep) opacity-85 shadow-[0_0_8px_var(--brand-orange)]"
                  />
                </div>
              )}

              {/* Step row: 3-column layout on sm+, flex on mobile */}
              <div className="flex flex-row items-center gap-4 sm:grid sm:grid-cols-[1fr_140px_1fr] sm:gap-0 min-h-20">
                {/* Left Column (Content for Odd steps) */}
                {isOddStep ? (
                  <div className="w-full min-w-0">{textNode}</div>
                ) : (
                  <div className="hidden sm:block" aria-hidden="true" />
                )}

                {/* Center Column: Node */}
                <div className="shrink-0 flex justify-center items-center order-first sm:order-0">
                  {circleNode}
                </div>

                {/* Right Column (Content for Even steps) */}
                {!isOddStep ? (
                  <div className="w-full min-w-0">{textNode}</div>
                ) : (
                  <div className="hidden sm:block" aria-hidden="true" />
                )}
              </div>

              {/* Seamless S-Curve connector between alternating nodes for desktop */}
              {!isLast && (
                <div className="hidden sm:grid sm:grid-cols-[1fr_140px_1fr] items-center pointer-events-none -my-4 relative z-0">
                  <div aria-hidden="true" />
                  <div className="w-full h-20 flex items-center justify-center">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 140 80"
                      className="w-full h-20 overflow-visible"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient
                          id={`cg-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--brand-orange)"
                            stopOpacity="0.8"
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--brand-orange-deep)"
                            stopOpacity="0.95"
                          />
                        </linearGradient>
                      </defs>
                      <motion.path
                        variants={flowPathVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        d={
                          isOddStep
                            ? 'M 46 0 C 46 48, 94 32, 94 80'
                            : 'M 94 0 C 94 48, 46 32, 46 80'
                        }
                        stroke={`url(#cg-${index})`}
                        strokeWidth="3.5"
                        strokeDasharray="7 5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div aria-hidden="true" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Tech Selection & Philosophy Banner */}
      <motion.div
        variants={scaleIn}
        className="surface-card grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.5fr_0.8fr] lg:items-center bg-linear-to-r from-(--surface-strong) via-(--brand-orange-soft)/20 to-(--surface-strong)"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
            <Code2 className="size-4" />
            <span>{workflow.philosophyLabel}</span>
          </div>
          <p className="text-sm leading-relaxed text-(--brand-muted)">
            {workflow.techSelection}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-(--brand-line) bg-(--surface-strong) p-6 text-center shadow-xs">
          <span className="text-xs font-extrabold uppercase tracking-widest text-(--brand-muted)">
            {workflow.ruleLabel}
          </span>
          <span className="mt-1 text-2xl font-black tracking-tight text-(--brand-orange-deep)">
            "{workflow.goldenRule}"
          </span>
        </div>
      </motion.div>
    </section>
  )
}
