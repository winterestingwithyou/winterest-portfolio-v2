import { Box, MousePointer2, Sparkles } from 'lucide-react'

const characterNotes = [
  {
    title: 'Static first',
    description:
      'The mascot is a lightweight visual accent that does not block core portfolio content.',
    icon: Sparkles,
  },
  {
    title: 'Progressive motion',
    description:
      'Subtle CSS motion is allowed, with reduced-motion users getting a still experience.',
    icon: MousePointer2,
  },
  {
    title: '3D later',
    description:
      'A small GLB scene can arrive after the CMS, auth, and publishing flows are stable.',
    icon: Box,
  },
] as const

export function CharacterSpotlight() {
  return (
    <section className="character-spotlight">
      <div className="character-spotlight__media">
        <img
          src="/assets/characters/winterest-mascot.png"
          alt="Original Winterest mascot shown as a warm developer character with orange cloud accents."
          width={1536}
          height={1024}
          loading="lazy"
        />
      </div>

      <div className="character-spotlight__content">
        <p className="eyebrow mb-3">Character layer</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
          A mascot accent, not a performance tax.
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
          The visual layer gives Winterest a recognizable presence while keeping
          the portfolio readable, fast, and useful. It starts as a static
          illustration and can later grow into a small progressive 3D scene.
        </p>

        <div className="mt-6 grid gap-3">
          {characterNotes.map((note) => {
            const Icon = note.icon

            return (
              <article key={note.title} className="character-spotlight__note">
                <div className="grid size-10 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--brand-ink)]">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">
                    {note.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
