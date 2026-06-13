import { Box, MousePointer2, Sparkles } from 'lucide-react'

import { getPublicCopy } from '#/features/portfolio/data'

const noteIcons = [Sparkles, MousePointer2, Box] as const

export function CharacterSpotlight() {
  const copy = getPublicCopy()

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
        <p className="eyebrow mb-3">{copy.character.eyebrow}</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
          {copy.character.title}
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
          {copy.character.description}
        </p>

        <div className="mt-6 grid gap-3">
          {copy.character.notes.map((note, index) => {
            const Icon = noteIcons[index] ?? Sparkles

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
