import { Cloud, Sparkles } from 'lucide-react'

import type { AuthCopy } from '#/features/auth/content/auth-copy'

type LoginHeroPanelProps = {
  copy: AuthCopy
}

export function LoginHeroPanel({ copy }: LoginHeroPanelProps) {
  return (
    <div className="grid gap-3 sm:gap-4">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-orange)_38%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_72%,transparent)] py-1 pr-3 pl-1 text-xs font-black text-(--brand-ink) shadow-[0_18px_44px_var(--brand-glow)] sm:text-sm">
        <span className="brand-mark">
          <Cloud aria-hidden="true" className="size-4" />
          <Sparkles aria-hidden="true" className="brand-spark size-3" />
        </span>
        <span>{copy.brandName}</span>
      </div>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="max-w-2xl text-2xl font-black leading-tight text-(--brand-ink) sm:text-3xl lg:text-4xl xl:text-[2.75rem]">
        {copy.title}
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-(--brand-muted) sm:text-base sm:leading-7">
        {copy.description}
      </p>
    </div>
  )
}
