import { Brain, Lightbulb, Sparkles, Terminal } from 'lucide-react'
import { motion } from 'motion/react'

import type { getAboutData } from '#/features/about/data'
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerItemScale,
} from '#/lib/motion'

type AboutHeroProps = {
  hero: ReturnType<typeof getAboutData>['hero']
}

export function AboutHero({ hero }: AboutHeroProps) {
  return (
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
            <span>{hero.eyebrow}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight text-(--brand-ink) sm:text-5xl lg:text-6xl leading-[1.15]"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed text-(--brand-muted) sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          {/* Personality Badges */}
          <motion.div
            variants={staggerContainer(0.06, 0.2)}
            className="flex flex-wrap gap-2 pt-2"
          >
            {hero.badges.map((badge) => (
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
              <span>{hero.cardLabel}</span>
            </div>
            <blockquote className="text-lg font-medium leading-snug text-(--brand-ink) italic">
              "{hero.mindsetQuote}"
            </blockquote>
            <div className="pt-2 text-xs text-(--brand-muted)">
              — M. Adam Yudistira (Winterest)
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
