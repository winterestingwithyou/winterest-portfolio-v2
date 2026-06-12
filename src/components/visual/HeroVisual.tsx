import { Cloud, Code2, Cpu, Sparkles } from 'lucide-react'

const signalItems = [
  { label: 'Workers', value: 'edge-ready', icon: Cloud },
  { label: 'Bun', value: 'fast loops', icon: Sparkles },
  { label: 'CMS', value: 'D1-backed', icon: Cpu },
] as const

export function HeroVisual() {
  return (
    <figure className="hero-visual" aria-labelledby="hero-visual-title">
      <div className="hero-visual__media">
        <img
          src="/assets/characters/winterest-mascot.png"
          alt="Original Winterest developer mascot with orange cloud accents and floating code panels."
          width={1536}
          height={1024}
          fetchPriority="high"
        />
      </div>

      <figcaption className="sr-only" id="hero-visual-title">
        Original Winterest mascot for the Cloudflare and Bun inspired portfolio.
      </figcaption>

      <div className="hero-visual__terminal" aria-hidden="true">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f56]" />
          <span className="size-2 rounded-full bg-[#ffbd2e]" />
          <span className="size-2 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[0.65rem] text-orange-100">
            winterest/lab
          </span>
        </div>
        <div className="grid gap-1.5 font-mono text-[0.72rem] leading-5 text-orange-50">
          <span>
            <span className="text-orange-300">runtime</span>: workers
          </span>
          <span>
            <span className="text-orange-300">cms</span>: d1 + drizzle
          </span>
          <span>
            <span className="text-orange-300">mood</span>: playful, precise
          </span>
        </div>
      </div>

      <div className="hero-visual__signals" aria-hidden="true">
        {signalItems.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.label} className="hero-visual__signal">
              <Icon className="size-4" />
              <div>
                <p>{item.label}</p>
                <span>{item.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="hero-visual__badge" aria-hidden="true">
        <Code2 className="size-4" />
        Edge lab
      </div>
    </figure>
  )
}
