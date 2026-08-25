import { createFileRoute } from '@tanstack/react-router'
import {
  Award,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Code2,
  Compass,
  ExternalLink,
  Flame,
  Flag,
  Gamepad2,
  Lightbulb,
  Music,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Tv,
  Users,
  Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { Container, SectionHeader } from '#/components/marketing/section'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Timeline } from '#/components/ui/timeline'
import { getAboutData } from '#/features/portfolio/about-data'
import type { PriorityItem } from '#/features/portfolio/about-data'
import {
  defaultViewport,
  fadeUp,
  flowNodeVariant,
  flowPathVariant,
  scaleIn,
  staggerContainer,
  staggerItem,
  staggerItemScale,
  timelineStepVariant,
} from '#/lib/motion'
import { cn } from '#/lib/utils'

const STEP_ICONS = [Target, Flag, Compass, Code2, ShieldCheck, Rocket, Sparkles]

const GLASS_SHARDS = [
  {
    // Shard 0: Arlecchino (Top-Left, sharp vertical wedge)
    clipPath: 'polygon(15% 0%, 98% 6%, 82% 98%, 0% 84%)',
    svgPoints: '15,0 98,6 82,98 0,84',
    rotation: '-rotate-3 group-hover:rotate-0',
    offset: 'sm:-translate-y-2',
  },
  {
    // Shard 1: Wanderer (Top-Right, inverted angular polygon)
    clipPath: 'polygon(10% 4%, 90% 0%, 100% 88%, 18% 100%)',
    svgPoints: '10,4 90,0 100,88 18,100',
    rotation: 'rotate-4 group-hover:rotate-0',
    offset: 'sm:translate-y-3',
  },
  {
    // Shard 2: Lohen (Bottom-Left, sharp diagonal prism)
    clipPath: 'polygon(4% 10%, 96% 0%, 94% 84%, 12% 98%)',
    svgPoints: '4,10 96,0 94,84 12,98',
    rotation: '-rotate-2 group-hover:rotate-0',
    offset: 'sm:-translate-y-1',
  },
  {
    // Shard 3: Tsaritsa (Bottom-Right, tall crystal shard pointing outward)
    clipPath: 'polygon(12% 0%, 100% 15%, 85% 100%, 0% 88%)',
    svgPoints: '12,0 100,15 85,100 0,88',
    rotation: 'rotate-3 group-hover:rotate-0',
    offset: 'sm:translate-y-2',
  },
]

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const data = getAboutData()
  const [expandedValueKey, setExpandedValueKey] = useState<string | null>(null)
  const [activeBeyondTab, setActiveBeyondTab] = useState<
    'gaming' | 'anime' | 'kpop'
  >('gaming')

  const toggleValue = (key: string) => {
    setExpandedValueKey((prev) => (prev === key ? null : key))
  }

  return (
    <main className="px-4 py-12 sm:py-20">
      <Container className="space-y-20 sm:space-y-28">
        {/* ==================================================================== */}
        {/* 1. WHO AM I? */}
        {/* ==================================================================== */}
        <section className="relative">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              variants={staggerContainer(0.08, 0.1)}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-(--brand-line) bg-(--brand-orange-soft) px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)"
              >
                <Brain className="size-3.5" />
                <span>{data.hero.eyebrow}</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-bold tracking-tight text-(--brand-ink) sm:text-5xl lg:text-6xl leading-[1.15]"
              >
                {data.hero.title}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed text-(--brand-muted) sm:text-xl"
              >
                {data.hero.subtitle}
              </motion.p>

              {/* Personality Badges */}
              <motion.div
                variants={staggerContainer(0.06, 0.2)}
                className="flex flex-wrap gap-2 pt-2"
              >
                {data.hero.badges.map((badge) => (
                  <motion.span
                    key={badge}
                    variants={staggerItemScale}
                    className="inline-flex items-center gap-1.5 rounded-md border border-(--brand-line) bg-(--surface-strong) px-3 py-1.5 text-xs font-semibold text-(--brand-ink) shadow-xs"
                  >
                    <Sparkles className="size-3.5 text-(--brand-orange)" />
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Quote Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="surface-card relative overflow-hidden p-6 sm:p-8 border-l-4 border-l-(--brand-orange)"
            >
              <div className="absolute right-4 top-4 opacity-10 text-(--brand-orange)">
                <Terminal className="size-28" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
                  <Lightbulb className="size-4" />
                  <span>{data.hero.cardLabel}</span>
                </div>
                <blockquote className="text-lg font-medium leading-snug text-(--brand-ink) italic">
                  "{data.hero.mindsetQuote}"
                </blockquote>
                <div className="pt-2 text-xs text-(--brand-muted)">
                  — M. Adam Yudistira (Winterest)
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. WHAT DRIVES ME */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={defaultViewport} variants={fadeUp}>
            <SectionHeader
              eyebrow={data.drives.eyebrow}
              title={data.drives.title}
              description={data.drives.subtitle}
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
                  <span>{data.drives.originTitle}</span>
                </div>
                <blockquote className="text-xl font-bold leading-snug text-(--brand-ink)">
                  "{data.drives.originQuote}"
                </blockquote>
                <p className="text-xs leading-relaxed text-(--brand-muted)">
                  {data.drives.originDetail}
                </p>
              </div>

              <div className="pt-6 border-t border-(--brand-line) space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
                  <Sparkles className="size-4" />
                  <span>{data.drives.curiosityTitle}</span>
                </div>
                <div className="text-sm font-semibold text-(--brand-ink)">
                  "{data.drives.curiosityQuote}"
                </div>
                <p className="text-xs leading-relaxed text-(--brand-muted)">
                  {data.drives.curiosityDetail}
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
                  <span>{data.drives.mindsetLabel}</span>
                </div>
                <h3 className="text-2xl font-bold text-(--brand-ink)">
                  "{data.drives.mindsetQuote}"
                </h3>
                <p className="text-xs leading-relaxed text-(--brand-muted)">
                  {data.drives.mindsetDetail}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-(--brand-line)">
                <div className="space-y-1.5">
                  <div className="font-semibold text-xs text-(--brand-ink) flex items-center gap-1.5">
                    <Zap className="size-3.5 text-(--brand-orange)" />
                    {data.drives.refactoringTitle}
                  </div>
                  <p className="text-xs leading-relaxed text-(--brand-muted)">
                    {data.drives.refactoringDetail}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="font-semibold text-xs text-(--brand-ink) flex items-center gap-1.5">
                    <TrendingUp className="size-3.5 text-(--brand-orange)" />
                    {data.drives.forecastingTitle}
                  </div>
                  <blockquote className="text-xs italic font-medium text-(--brand-ink) border-l-2 border-(--brand-orange) pl-2.5 my-1">
                    "{data.drives.forecastingQuote}"
                  </blockquote>
                  <p className="text-xs leading-relaxed text-(--brand-muted)">
                    {data.drives.forecastingDetail}
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
                  {data.drives.hierarchyTitle}
                </h3>
                <p className="text-xs text-(--brand-muted) mt-1">
                  {data.drives.hierarchySubtitle}
                </p>

                <div className="space-y-2.5 pt-4">
                  {data.drives.satisfactionHierarchy.map((item) => (
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
                {data.drives.hierarchyNote}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ==================================================================== */}
        {/* 3. HOW I BUILD (WORKFLOW) */}
        {/* ==================================================================== */}
        <section className="space-y-12">
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={data.workflow.eyebrow}
              title={data.workflow.title}
              description={data.workflow.subtitle}
            />
          </motion.div>

          {/* Central Serpentine S-Curve Workflow Timeline */}
          <div className="max-w-4xl mx-auto px-3 sm:px-6">
            {data.workflow.steps.map((step, index) => {
              const isOddStep = index % 2 === 0 // index 0, 2, 4, 6 -> Step 01, 03, 05, 07
              const isLast = index === data.workflow.steps.length - 1
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
                    'group relative flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-full border-4 bg-(--surface-strong) text-(--brand-orange-deep) shadow-xl transition-all duration-300 hover:scale-110 hover:border-(--brand-orange) relative z-10',
                    isOddStep ? 'sm:-translate-x-6' : 'sm:translate-x-6',
                    borderClass,
                  )}
                >
                  <StepIcon className="size-6 sm:size-7 transition-transform duration-200 group-hover:scale-110 text-(--brand-orange)" />
                  <span
                    className={cn(
                      'absolute -bottom-1 flex size-5 sm:size-6 items-center justify-center rounded-full bg-(--brand-orange-deep) text-[10px] sm:text-xs font-black text-white shadow-xs',
                      isOddStep ? '-right-1' : '-left-1',
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
                      'flex items-center gap-2 flex-wrap',
                      isOddStep
                        ? 'justify-start sm:justify-end'
                        : 'justify-start',
                    )}
                  >
                    {isOddStep ? (
                      <>
                        <h3 className="text-base sm:text-lg font-black text-(--brand-ink) tracking-tight order-2 sm:order-1">
                          {step.title}
                        </h3>
                        <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[10px] sm:text-xs font-black tracking-widest text-(--brand-orange-deep) uppercase shrink-0 order-1 sm:order-2 border border-(--brand-orange)/20">
                          Step {step.step}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[10px] sm:text-xs font-black tracking-widest text-(--brand-orange-deep) uppercase shrink-0 border border-(--brand-orange)/20">
                          Step {step.step}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-(--brand-ink) tracking-tight">
                          {step.title}
                        </h3>
                      </>
                    )}
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
                  viewport={{ once: true, amount: 0.25, margin: '0px 0px -40px 0px' }}
                  className="relative"
                >
                  {/* Step row: 3-column layout on sm+, flex on mobile */}
                  <div className="flex flex-row items-center gap-4 sm:grid sm:grid-cols-[1fr_140px_1fr] sm:gap-0 min-h-[80px]">
                    {/* Left Column (Content for Odd steps) */}
                    {isOddStep ? (
                      <div className="w-full min-w-0">{textNode}</div>
                    ) : (
                      <div className="hidden sm:block" aria-hidden="true" />
                    )}

                    {/* Center Column: Node */}
                    <div className="shrink-0 flex justify-center items-center order-first sm:order-none">
                      {circleNode}
                    </div>

                    {/* Right Column (Content for Even steps) */}
                    {!isOddStep ? (
                      <div className="w-full min-w-0">{textNode}</div>
                    ) : (
                      <div className="hidden sm:block" aria-hidden="true" />
                    )}
                  </div>

                  {/* Seamless S-Curve connector between alternating nodes */}
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
                <span>{data.workflow.philosophyLabel}</span>
              </div>
              <p className="text-sm leading-relaxed text-(--brand-muted)">
                {data.workflow.techSelection}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-(--brand-line) bg-(--surface-strong) p-6 text-center shadow-xs">
              <span className="text-xs font-extrabold uppercase tracking-widest text-(--brand-muted)">
                {data.workflow.ruleLabel}
              </span>
              <span className="mt-1 text-2xl font-black tracking-tight text-(--brand-orange-deep)">
                "{data.workflow.goldenRule}"
              </span>
            </div>
          </motion.div>
        </section>

        {/* ==================================================================== */}
        {/* 4. MY JOURNEY */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={defaultViewport} variants={fadeUp}>
            <SectionHeader
              eyebrow={data.journey.eyebrow}
              title={data.journey.title}
              description={data.journey.subtitle}
            />
          </motion.div>

          <Timeline
            data={data.journey.steps.map((step) => ({
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
                {data.journey.currentStageTitle}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
                {data.journey.currentStage}
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
                {data.journey.growthFocusTitle}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
                {data.journey.softSkillsFocus}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 5. THINGS I CARE ABOUT (VALUES) */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={defaultViewport} variants={fadeUp}>
            <SectionHeader
              eyebrow={data.values.eyebrow}
              title={data.values.title}
              description={data.values.subtitle}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="surface-card p-4 sm:p-5 bg-(--brand-orange-soft)/40 border-(--brand-line) text-xs text-(--brand-orange-deep) font-semibold flex items-center gap-3"
          >
            <ShieldCheck className="size-5 shrink-0 text-(--brand-orange)" />
            <span>{data.values.contextNote}</span>
          </motion.div>

          {/* Priority Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.values.items.map((item: PriorityItem) => {
              const isExpanded = expandedValueKey === item.key
              return (
                <motion.div
                  key={item.key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
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

        {/* ==================================================================== */}
        {/* 6. BEYOND CODE */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={defaultViewport} variants={fadeUp}>
            <SectionHeader
              eyebrow={data.beyond.eyebrow}
              title={data.beyond.title}
              description={data.beyond.subtitle}
            />
          </motion.div>

          {/* Subtabs Navigation */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-2 border-b border-(--brand-line) pb-4"
          >
            <button
              type="button"
              onClick={() => setActiveBeyondTab('gaming')}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
                activeBeyondTab === 'gaming'
                  ? 'bg-(--brand-orange) text-white shadow-xs'
                  : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
              )}
            >
              <Gamepad2 className="size-4" />
              <span>{data.beyond.gaming.title}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBeyondTab('anime')}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
                activeBeyondTab === 'anime'
                  ? 'bg-(--brand-orange) text-white shadow-xs'
                  : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
              )}
            >
              <Tv className="size-4" />
              <span>{data.beyond.anime.title}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBeyondTab('kpop')}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
                activeBeyondTab === 'kpop'
                  ? 'bg-(--brand-orange) text-white shadow-xs'
                  : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
              )}
            >
              <Music className="size-4" />
              <span>{data.beyond.kpop.title}</span>
            </button>
          </motion.div>

          {/* Tab Content */}
          <div className="pt-2">
            <AnimatePresence mode="wait">
              {/* GAMING TAB */}
              {activeBeyondTab === 'gaming' && (
                <motion.div
                  key="gaming"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* 1. Mobile Legends Row */}
                  <div className="surface-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-(--brand-orange)">
                    <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
                      <img
                        src={data.beyond.gaming.mlbb.iconUrl}
                        alt={data.beyond.gaming.mlbb.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="size-14 sm:size-16 shrink-0 rounded-2xl border border-(--brand-line) bg-(--surface-strong) object-cover shadow-xs"
                      />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                            MOBA
                          </span>
                          <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[11px] font-bold text-(--brand-orange-deep)">
                            {data.beyond.gaming.mlbb.server}
                          </span>
                          <span className="text-xs text-(--brand-muted)">
                            IGN:{' '}
                            <span className="font-bold text-(--brand-ink)">
                              {data.beyond.gaming.mlbb.ign}
                            </span>
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-(--brand-ink)">
                          {data.beyond.gaming.mlbb.name}
                        </h3>
                        <p className="text-xs sm:text-sm leading-relaxed text-(--brand-muted)">
                          {data.beyond.gaming.mlbb.notes}
                        </p>
                      </div>
                    </div>

                    {/* Hirara Hero Spotlight */}
                    <div className="group flex items-center gap-4 rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3 sm:p-4 shrink-0 transition-all hover:border-(--brand-orange)">
                      <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border border-(--brand-orange)/40 bg-black/20 shadow-xs">
                        <img
                          src={data.beyond.gaming.mlbb.heroImage}
                          alt={data.beyond.gaming.mlbb.heroName}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                          <Flame className="size-3 text-(--brand-orange)" />
                          {data.beyond.gaming.mlbb.heroLabel}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-(--brand-ink)">
                          {data.beyond.gaming.mlbb.heroName}
                        </h4>
                        <span className="text-[11px] text-(--brand-muted)">
                          Cuma Bisa Hirara
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Growtopia Row */}
                  <div className="surface-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-(--brand-orange)">
                    <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
                      <img
                        src={data.beyond.gaming.growtopia.iconUrl}
                        alt={data.beyond.gaming.growtopia.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="size-14 sm:size-16 shrink-0 rounded-2xl border border-(--brand-line) bg-(--surface-strong) object-cover shadow-xs"
                      />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                            Sandbox / Trading MMO
                          </span>
                          <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[11px] font-bold text-(--brand-orange-deep)">
                            World: {data.beyond.gaming.growtopia.world}
                          </span>
                          <span className="text-xs text-(--brand-muted)">
                            IGN:{' '}
                            <span className="font-bold text-(--brand-ink)">
                              {data.beyond.gaming.growtopia.ign}
                            </span>
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-(--brand-ink)">
                          {data.beyond.gaming.growtopia.name}
                        </h3>
                        <p className="text-xs sm:text-sm leading-relaxed text-(--brand-muted)">
                          {data.beyond.gaming.growtopia.notes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Genshin Impact Row with Broken-Glass / Fractured Collage */}
                  <div className="surface-card p-6 sm:p-8 space-y-6 transition-all hover:border-(--brand-orange)">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--brand-line) pb-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={data.beyond.gaming.genshin.iconUrl}
                          alt={data.beyond.gaming.genshin.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="size-14 sm:size-16 shrink-0 rounded-2xl border border-(--brand-line) bg-(--surface-strong) object-cover shadow-xs"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                              Open World RPG
                            </span>
                            <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[11px] font-bold text-(--brand-orange-deep)">
                              Low Spender
                            </span>
                            <span className="text-xs text-(--brand-muted)">
                              IGN:{' '}
                              <span className="font-bold text-(--brand-ink)">
                                {data.beyond.gaming.genshin.ign}
                              </span>
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-(--brand-ink) mt-1">
                            {data.beyond.gaming.genshin.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-(--brand-muted) max-w-md">
                        {data.beyond.gaming.genshin.notes}
                      </p>
                    </div>

                    {/* Shattered Glass Showcase */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep) flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-(--brand-orange)" />
                            {data.beyond.gaming.genshin.favLabel}
                          </span>
                          <span className="text-[11px] text-(--brand-muted) italic hidden sm:inline">
                            — (Klik pecahan kaca untuk melihat ulasan karakter)
                          </span>
                        </div>
                      </div>

                      {/* Broken Glass Shattered Arena */}
                      <div className="relative overflow-hidden rounded-2xl border border-(--brand-line) bg-radial from-(--brand-orange-soft)/20 via-(--surface-strong)/50 to-(--site-bg) p-4 sm:p-8">
                        {/* Background Fractured Crack Lines & Impact Center */}
                        <svg
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 size-full opacity-30 dark:opacity-40"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line x1="50%" y1="50%" x2="5%" y2="8%" stroke="var(--brand-orange)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="50%" y1="50%" x2="95%" y2="4%" stroke="var(--brand-orange)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="50%" y1="50%" x2="8%" y2="92%" stroke="var(--brand-orange)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="50%" y1="50%" x2="92%" y2="95%" stroke="var(--brand-orange)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="50%" y1="50%" x2="50%" y2="0%" stroke="var(--brand-line)" strokeWidth="1" />
                          <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="var(--brand-line)" strokeWidth="1" />
                          <line x1="50%" y1="50%" x2="0%" y2="50%" stroke="var(--brand-line)" strokeWidth="1" />
                          <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="var(--brand-line)" strokeWidth="1" />
                          <circle cx="50%" cy="50%" r="6" fill="var(--brand-orange)" opacity="0.4" />
                        </svg>

                        {/* 4 Shattered Glass Shards */}
                        <motion.div
                          variants={staggerContainer(0.08, 0.1)}
                          initial="hidden"
                          animate="visible"
                          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-4"
                        >
                          {data.beyond.gaming.genshin.favorites.map((fav, i) => {
                            const shard = GLASS_SHARDS[i] || GLASS_SHARDS[0]
                            return (
                              <Popover key={fav.name}>
                                <PopoverTrigger asChild>
                                  <motion.button
                                    variants={staggerItemScale}
                                    type="button"
                                    className={cn(
                                      'group relative aspect-[3/4] w-full cursor-pointer transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-(--brand-orange) hover:scale-105 hover:z-30',
                                      shard.rotation,
                                      shard.offset,
                                    )}
                                    aria-label={`Inspect ${fav.name} glass shard`}
                                  >
                                    {/* Glass Shard Polygon Body */}
                                    <div
                                      className="relative size-full overflow-hidden bg-black/60 shadow-xl transition-all duration-300"
                                      style={{ clipPath: shard.clipPath }}
                                    >
                                      <img
                                        src={fav.image}
                                        alt={fav.name}
                                        referrerPolicy="no-referrer"
                                        loading="lazy"
                                        className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-115"
                                      />

                                      {/* Glass Specular Glint Reflection */}
                                      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-cyan-400/20 via-white/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                                      {/* Vignette Bottom Gradient */}
                                      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-black/20" />
                                    </div>

                                    {/* Glass Shard Outlined Bevel Border (SVG) */}
                                    <svg
                                      aria-hidden="true"
                                      className="pointer-events-none absolute inset-0 size-full overflow-visible"
                                      viewBox="0 0 100 100"
                                      preserveAspectRatio="none"
                                    >
                                      <polygon
                                        points={shard.svgPoints}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.7)"
                                        strokeWidth="2.5"
                                        className="transition-all duration-300 group-hover:stroke-(--brand-orange) drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                      />
                                    </svg>

                                    {/* Shard Label Floating Name (Outside clipped polygon with z-20 so it never gets clipped) */}
                                    <div className="pointer-events-none absolute inset-x-0 -bottom-3 z-20 flex justify-center">
                                      <span className="rounded-full bg-(--surface-strong) px-3 py-1 text-xs font-black tracking-wide text-(--brand-ink) border border-(--brand-line) shadow-xl group-hover:border-(--brand-orange) group-hover:text-(--brand-orange-deep) group-hover:scale-105 transition-all">
                                        {fav.name}
                                      </span>
                                    </div>
                                  </motion.button>
                                </PopoverTrigger>

                                <PopoverContent
                                  side="top"
                                  sideOffset={16}
                                  className="w-72 sm:w-80 rounded-2xl border-(--brand-orange)/40 bg-(--surface-strong)/95 backdrop-blur-md p-4 shadow-2xl space-y-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={fav.image}
                                      alt={fav.name}
                                      referrerPolicy="no-referrer"
                                      className="size-11 rounded-xl object-cover border border-(--brand-orange)/50 shrink-0"
                                    />
                                    <div>
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-(--brand-orange-deep) block">
                                        Genshin Impact
                                      </span>
                                      <h4 className="font-bold text-base text-(--brand-ink) leading-tight">
                                        {fav.name}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="rounded-xl border border-(--brand-line) bg-(--site-bg)/80 p-3 space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--brand-muted) block">
                                      Catatan Karakter
                                    </span>
                                    <blockquote className="text-xs italic font-medium leading-relaxed text-(--brand-ink)">
                                      "{fav.reason}"
                                    </blockquote>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )
                          })}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ANIME TAB */}
              {activeBeyondTab === 'anime' && (
                <motion.div
                  key="anime"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                  className="surface-card p-6 sm:p-8 transition-all hover:border-(--brand-orange)"
                >
                  <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
                          <Tv className="size-3.5" />
                          <span>{data.beyond.anime.seriesLabel}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-(--brand-ink)">
                          {data.beyond.anime.favorite}
                        </h3>
                      </div>

                      <p className="text-sm leading-relaxed text-(--brand-muted)">
                        {data.beyond.anime.summary}
                      </p>

                      <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-4 space-y-2 border-l-4 border-l-(--brand-orange)">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
                          <Sparkles className="size-4 text-(--brand-orange)" />
                          <span>Domain Expansion & Tactical Battles</span>
                        </div>
                        <p className="text-xs leading-relaxed text-(--brand-muted)">
                          {data.beyond.anime.reason}
                        </p>
                      </div>
                    </div>

                    {/* Gojo Portrait Showcase */}
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-(--brand-line) bg-(--surface-strong) shadow-xl transition-all duration-300 hover:border-(--brand-orange)">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/40">
                        <img
                          src={data.beyond.anime.charImage}
                          alt={data.beyond.anime.favChar}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-5 text-white space-y-1">
                          <span className="inline-block rounded-full bg-(--brand-orange) px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                            {data.beyond.anime.charLabel}
                          </span>
                          <h4 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                            {data.beyond.anime.favChar}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* KPOP TAB */}
              {activeBeyondTab === 'kpop' && (
                <motion.div
                  key="kpop"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-sm leading-relaxed text-(--brand-muted) max-w-2xl">
                    {data.beyond.kpop.summary}
                  </p>

                  {/* 5 Group Cards Grid */}
                  <motion.div
                    variants={staggerContainer(0.08, 0.1)}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
                  >
                    {data.beyond.kpop.groups.map((group) => (
                      <motion.div
                        key={group.name}
                        variants={staggerItem}
                        className={cn(
                          'group relative overflow-hidden rounded-3xl border border-(--brand-line) bg-(--surface-strong)/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:shadow-xl flex flex-col justify-between bg-linear-to-br',
                          group.color,
                        )}
                      >
                        {/* Ambient background glow blur */}
                        <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-(--brand-orange)/10 blur-3xl group-hover:bg-(--brand-orange)/20 transition-all duration-500" />

                        {/* Top Header: Official Logo + Group Name + Bias Badge */}
                        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-(--brand-line)/60 pb-4 mb-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-11 sm:size-12 shrink-0 rounded-2xl border border-(--brand-line) bg-white/90 overflow-hidden shadow-xs">
                              <img
                                src={group.logoUrl}
                                alt={`${group.name} official logo`}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-(--brand-orange-deep) block leading-tight">
                                K-Pop Artist
                              </span>
                              <h3 className="text-lg sm:text-xl font-black text-(--brand-ink) tracking-tight truncate">
                                {group.name}
                              </h3>
                            </div>
                          </div>

                          {/* Bias Pill Badge */}
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-black text-(--brand-orange-deep) border border-(--brand-orange)/30 shadow-xs shrink-0">
                            <Sparkles className="size-3.5 text-(--brand-orange)" />
                            <span>
                              {data.beyond.kpop.biasLabel}:{' '}
                              <strong className="text-(--brand-ink)">
                                {group.bias}
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Main Body: Bias Showcase on Left + Vinyl Track Player on Right */}
                        <div className="relative z-10 grid grid-cols-[105px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-center">
                          {/* Left: Bias Portrait with Glass Frame */}
                          <div className="group/bias relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-(--brand-line) bg-black/40 shadow-md group-hover:border-(--brand-orange) transition-colors">
                            <img
                              src={group.biasImage}
                              alt={`${group.bias} (${group.name})`}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              className="size-full object-cover object-top transition-transform duration-500 group-hover/bias:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                            <div className="absolute inset-x-0 bottom-1.5 text-center">
                              <span className="rounded-md bg-black/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-black text-white border border-white/20">
                                {group.bias}
                              </span>
                            </div>
                          </div>

                          {/* Right: Vinyl Player & Spotify Action */}
                          <div className="space-y-3 min-w-0">
                            {/* Vinyl Album Player */}
                            <div className="flex items-center gap-3 rounded-2xl border border-(--brand-line) bg-(--site-bg)/90 backdrop-blur-md p-2.5 sm:p-3 shadow-xs">
                              {/* Album Cover with Spinning Vinyl Disk peeking out */}
                              <div className="relative size-12 sm:size-14 shrink-0">
                                {/* Vinyl Disk peeking out */}
                                <div className="absolute top-0 right-0 size-12 sm:size-14 rounded-full bg-black border-2 border-neutral-800 shadow-md flex items-center justify-center translate-x-2.5 group-hover:translate-x-3.5 transition-transform duration-300 animate-spin [animation-duration:8s]">
                                  <div className="size-4 sm:size-5 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center">
                                    <div className="size-1.5 sm:size-2 rounded-full bg-(--brand-orange)" />
                                  </div>
                                </div>

                                {/* Album Cover */}
                                <a
                                  href={group.spotifyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/album relative z-10 block size-full rounded-xl overflow-hidden shadow-md border border-(--brand-line) cursor-pointer"
                                  aria-label={`Play ${group.song} by ${group.name} on Spotify`}
                                >
                                  <img
                                    src={group.albumCover}
                                    alt={`${group.song} album cover`}
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    className="size-full object-cover group-hover/album:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/album:opacity-100 transition-opacity">
                                    <Play className="size-4 text-white fill-white" />
                                  </div>
                                </a>
                              </div>

                              {/* Track Info & Animated Equalizer */}
                              <div className="min-w-0 flex-1 pl-2 sm:pl-2.5 space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-(--brand-muted)">
                                    {data.beyond.kpop.songLabel}
                                  </span>
                                  {/* Equalizer bars */}
                                  <div className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 bg-(--brand-orange) rounded-full animate-pulse h-2" />
                                    <span className="w-0.5 bg-(--brand-orange) rounded-full animate-pulse h-3 [animation-delay:150ms]" />
                                    <span className="w-0.5 bg-(--brand-orange) rounded-full animate-pulse h-1.5 [animation-delay:300ms]" />
                                  </div>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate leading-tight">
                                  {group.song}
                                </h4>
                              </div>
                            </div>

                            {/* Spotify Direct Button */}
                            <a
                              href={group.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold px-3 py-2 text-xs transition-all shadow-xs hover:shadow-md hover:shadow-emerald-500/20 cursor-pointer"
                              aria-label={`Open ${group.song} on Spotify`}
                            >
                              <span>{data.beyond.kpop.spotifyLabel}</span>
                              <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 7. CURRENTLY EXPLORING */}
        {/* ==================================================================== */}
        <section className="space-y-8 pb-10">
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={data.exploring.eyebrow}
              title={data.exploring.title}
              description={data.exploring.subtitle}
            />
          </motion.div>

          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data.exploring.items.map((item) => (
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
              {data.exploring.ambitionTitle}
            </span>
            <p className="max-w-2xl mx-auto text-base sm:text-lg font-bold text-(--brand-ink)">
              "{data.exploring.ambitionText}"
            </p>
          </motion.div>
        </section>
      </Container>
    </main>
  )
}
