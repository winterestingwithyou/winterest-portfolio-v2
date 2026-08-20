import { createFileRoute } from '@tanstack/react-router'
import {
  Award,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Code2,
  Compass,
  Flame,
  Gamepad2,
  Lightbulb,
  Music,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Tv,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { getAboutData } from '#/features/portfolio/about-data'
import type { PriorityItem } from '#/features/portfolio/about-data'
import { cn } from '#/lib/utils'

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
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-(--brand-line) bg-(--brand-orange-soft) px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                <Brain className="size-3.5" />
                <span>{data.hero.eyebrow}</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-(--brand-ink) sm:text-5xl lg:text-6xl leading-[1.15]">
                {data.hero.title}
              </h1>

              <p className="text-lg leading-relaxed text-(--brand-muted) sm:text-xl">
                {data.hero.subtitle}
              </p>

              {/* Personality Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                  {data.hero.badges.map((badge) => (
                    <span
                      key={badge}
                    className="inline-flex items-center gap-1.5 rounded-md border border-(--brand-line) bg-(--surface-strong) px-3 py-1.5 text-xs font-semibold text-(--brand-ink) shadow-xs"
                    >
                    <Sparkles className="size-3.5 text-(--brand-orange)" />
                      {badge}
                    </span>
                  ))}
              </div>
            </div>

            {/* Quote Card */}
            <div className="surface-card relative overflow-hidden p-6 sm:p-8 border-l-4 border-l-(--brand-orange)">
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
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. WHAT DRIVES ME */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <SectionHeader
            eyebrow={data.drives.eyebrow}
            title={data.drives.title}
            description={data.drives.subtitle}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Card 1: Origin & Curiosity */}
            <div className="surface-card flex flex-col justify-between p-6 sm:p-8 space-y-6">
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
            </div>

            {/* Card 2: Mindset, Refactoring & Forecasting */}
            <div className="surface-card flex flex-col justify-between p-6 sm:p-8 space-y-6 bg-linear-to-br from-(--surface-strong) to-(--brand-orange-soft)/30">
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
            </div>

            {/* Card 3: Hierarchy of Satisfaction */}
            <div className="surface-card flex flex-col justify-between p-6 sm:p-8 space-y-4">
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
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. HOW I BUILD (WORKFLOW) */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <SectionHeader
            eyebrow={data.workflow.eyebrow}
            title={data.workflow.title}
            description={data.workflow.subtitle}
          />

          {/* Workflow Steps Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {data.workflow.steps.map((step) => (
              <div
                key={step.step}
                className="surface-card relative flex flex-col justify-between p-4 transition-all hover:-translate-y-1 hover:border-(--brand-orange)"
              >
                <div>
                  <div className="mb-3 text-2xl font-black text-(--brand-orange-deep)/40">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-bold leading-tight text-(--brand-ink)">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Selection & Philosophy Banner */}
          <div className="surface-card grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.5fr_0.8fr] lg:items-center bg-linear-to-r from-(--surface-strong) via-(--brand-orange-soft)/20 to-(--surface-strong)">
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
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 4. MY JOURNEY */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <SectionHeader
            eyebrow={data.journey.eyebrow}
            title={data.journey.title}
            description={data.journey.subtitle}
          />

          <div className="relative border-l-2 border-(--brand-line) pl-6 sm:pl-8 space-y-10 ml-2 sm:ml-4">
            {data.journey.steps.map((step) => (
              <div key={step.year} className="relative group">
                {/* Timeline Node Dot */}
                <div className="absolute left-[-31px] sm:left-[-39px] top-1 grid size-5 place-items-center rounded-full border-2 border-(--brand-orange) bg-(--site-bg) text-(--brand-orange) group-hover:bg-(--brand-orange) group-hover:text-white transition-colors">
                  <div className="size-2 rounded-full bg-current" />
                </div>

                <div className="surface-card p-6 transition-all hover:border-(--brand-orange)">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--brand-line) pb-3 mb-3">
                    <span className="text-sm font-black tracking-wider text-(--brand-orange-deep) uppercase">
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
              </div>
            ))}
          </div>

          {/* Current Stage & Soft Skills Callout */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-5 border-l-4 border-l-sky-500">
              <h4 className="text-sm font-bold text-(--brand-ink) flex items-center gap-2">
                <BookOpen className="size-4 text-sky-500" />
                {data.journey.currentStageTitle}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
                {data.journey.currentStage}
              </p>
            </div>
            <div className="surface-card p-5 border-l-4 border-l-emerald-500">
              <h4 className="text-sm font-bold text-(--brand-ink) flex items-center gap-2">
                <Users className="size-4 text-emerald-500" />
                {data.journey.growthFocusTitle}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-(--brand-muted)">
                {data.journey.softSkillsFocus}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 5. THINGS I CARE ABOUT (VALUES) */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <SectionHeader
            eyebrow={data.values.eyebrow}
            title={data.values.title}
            description={data.values.subtitle}
          />

          <div className="surface-card p-4 sm:p-5 bg-(--brand-orange-soft)/40 border-(--brand-line) text-xs text-(--brand-orange-deep) font-semibold flex items-center gap-3">
            <ShieldCheck className="size-5 shrink-0 text-(--brand-orange)" />
            <span>{data.values.contextNote}</span>
          </div>

          {/* Priority Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.values.items.map((item: PriorityItem) => {
              const isExpanded = expandedValueKey === item.key
              return (
                <div
                  key={item.key}
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

                  {isExpanded ? (
                    <div className="mt-3 pt-3 border-t border-(--brand-line) text-xs leading-relaxed text-(--brand-muted) animate-in fade-in-50 duration-200">
                      {item.detail}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 6. BEYOND CODE */}
        {/* ==================================================================== */}
        <section className="space-y-8">
          <SectionHeader
            eyebrow={data.beyond.eyebrow}
            title={data.beyond.title}
            description={data.beyond.subtitle}
          />

          {/* Subtabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-(--brand-line) pb-4">
            <button
              type="button"
              onClick={() => setActiveBeyondTab('gaming')}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all',
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
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all',
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
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all',
                activeBeyondTab === 'kpop'
                  ? 'bg-(--brand-orange) text-white shadow-xs'
                  : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
              )}
            >
              <Music className="size-4" />
              <span>{data.beyond.kpop.title}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            {/* GAMING TAB */}
            {activeBeyondTab === 'gaming' && (
              <div className="grid gap-6 md:grid-cols-3 animate-in fade-in-50 duration-200">
                {/* MLBB */}
                <div className="surface-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-(--brand-orange-deep)">
                      MOBA
                    </span>
                    <span className="rounded bg-(--brand-orange-soft) px-2 py-0.5 text-[10px] font-bold text-(--brand-orange-deep)">
                      {data.beyond.gaming.mlbb.server}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-(--brand-ink)">
                    {data.beyond.gaming.mlbb.name}
                  </h3>
                  <div className="text-xs text-(--brand-muted)">
                    IGN:{' '}
                    <span className="font-semibold text-(--brand-ink)">
                      {data.beyond.gaming.mlbb.ign}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-(--brand-muted)">
                    {data.beyond.gaming.mlbb.notes}
                  </p>
                </div>

                {/* Growtopia */}
                <div className="surface-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-(--brand-orange-deep)">
                      Sandbox / Trade
                    </span>
                    <span className="rounded bg-(--brand-orange-soft) px-2 py-0.5 text-[10px] font-bold text-(--brand-orange-deep)">
                      {data.beyond.gaming.growtopia.world}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-(--brand-ink)">
                    {data.beyond.gaming.growtopia.name}
                  </h3>
                  <div className="text-xs text-(--brand-muted)">
                    IGN:{' '}
                    <span className="font-semibold text-(--brand-ink)">
                      {data.beyond.gaming.growtopia.ign}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-(--brand-muted)">
                    {data.beyond.gaming.growtopia.notes}
                  </p>
                </div>

                {/* Genshin */}
                <div className="surface-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-(--brand-orange-deep)">
                      Open World RPG
                    </span>
                    <span className="rounded bg-(--brand-orange-soft) px-2 py-0.5 text-[10px] font-bold text-(--brand-orange-deep)">
                      Low Spender
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-(--brand-ink)">
                    {data.beyond.gaming.genshin.name}
                  </h3>
                  <p className="text-xs text-(--brand-muted)">
                    {data.beyond.gaming.genshin.notes}
                  </p>
                  <div className="pt-2 border-t border-(--brand-line) space-y-1.5">
                    <span className="text-[11px] font-bold text-(--brand-ink) block">
                      {data.beyond.gaming.genshin.favLabel}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {data.beyond.gaming.genshin.favorites.map((fav) => (
                        <div
                          key={fav.name}
                          className="rounded-md bg-(--surface-strong) p-2 border border-(--brand-line)"
                        >
                          <div className="text-xs font-bold text-(--brand-orange-deep)">
                            {fav.name}
                          </div>
                          <div className="text-[10px] text-(--brand-muted) line-clamp-1">
                            {fav.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ANIME TAB */}
            {activeBeyondTab === 'anime' && (
              <div className="surface-card p-6 sm:p-8 space-y-6 animate-in fade-in-50 duration-200">
                <div className="max-w-2xl space-y-3">
                  <p className="text-sm leading-relaxed text-(--brand-muted)">
                    {data.beyond.anime.summary}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-5 space-y-2">
                    <span className="text-xs font-extrabold uppercase text-(--brand-orange-deep)">
                      {data.beyond.anime.seriesLabel}
                    </span>
                    <h3 className="text-2xl font-bold text-(--brand-ink)">
                      {data.beyond.anime.favorite}
                    </h3>
                  </div>

                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-5 space-y-2">
                    <span className="text-xs font-extrabold uppercase text-(--brand-orange-deep)">
                      {data.beyond.anime.charLabel}
                    </span>
                    <h3 className="text-2xl font-bold text-(--brand-ink)">
                      {data.beyond.anime.favChar}
                    </h3>
                    <p className="text-xs text-(--brand-muted)">
                      {data.beyond.anime.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* KPOP TAB */}
            {activeBeyondTab === 'kpop' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <p className="text-sm text-(--brand-muted)">
                  {data.beyond.kpop.summary}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {data.beyond.kpop.groups.map((group) => (
                    <div
                      key={group.name}
                      className={cn(
                        'surface-card p-5 space-y-3 bg-linear-to-b transition-all hover:-translate-y-1 hover:border-(--brand-orange)',
                        group.color,
                      )}
                    >
                      <h3 className="text-lg font-bold text-(--brand-ink)">
                        {group.name}
                      </h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-(--brand-muted)">
                            {data.beyond.kpop.biasLabel}
                          </span>
                          <span className="font-bold text-(--brand-orange-deep)">
                            {group.bias}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-(--brand-muted)">
                            {data.beyond.kpop.songLabel}
                          </span>
                          <span className="font-semibold text-(--brand-ink)">
                            {group.song}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 7. CURRENTLY EXPLORING */}
        {/* ==================================================================== */}
        <section className="space-y-8 pb-10">
          <SectionHeader
            eyebrow={data.exploring.eyebrow}
            title={data.exploring.title}
            description={data.exploring.subtitle}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.exploring.items.map((item) => (
              <div
                key={item.title}
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
              </div>
            ))}
          </div>

          {/* Long Term Ambition Banner */}
          <div className="surface-card p-6 sm:p-8 bg-linear-to-r from-(--brand-orange-soft)/50 via-(--surface-strong) to-(--brand-orange-soft)/50 border-(--brand-line) text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-(--brand-orange-deep)">
              <Target className="size-4" />
              {data.exploring.ambitionTitle}
            </span>
            <p className="max-w-2xl mx-auto text-base sm:text-lg font-bold text-(--brand-ink)">
              "{data.exploring.ambitionText}"
            </p>
          </div>
        </section>
      </Container>
    </main>
  )
}
