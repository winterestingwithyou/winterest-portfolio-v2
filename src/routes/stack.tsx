import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechIcon } from '#/components/ui/tech-icon'
import { getPublicCopy } from '#/features/portfolio/data'
import { getPublicStackData } from '#/features/technologies/public-loaders'

export const Route = createFileRoute('/stack')({
  loader: () => getPublicStackData(),
  component: StackPage,
})

function StackPage() {
  const copy = getPublicCopy()
  const categories = Route.useLoaderData()

  return (
    <main className="py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.stack.eyebrow}
          title={copy.stack.title}
          description={copy.stack.description}
        />
      </Container>

      {/* Categories Marquee Showcase - Full Window Width */}
      {categories.length === 0 ? (
        <Container>
          <div className="surface-card p-8 text-center">
            <h2 className="text-xl font-semibold text-(--brand-ink)">
              Stack items coming soon!
            </h2>
            <p className="mt-2 text-sm text-(--brand-muted)">
              Tech stack database entries are currently being updated.
            </p>
          </div>
        </Container>
      ) : (
        <div className="mt-10 flex flex-col gap-14 sm:gap-20">
          {categories.map((category, index) => {
            if (category.technologies.length === 0) return null

            return (
              <section key={category.id} className="w-full">
                {/* Centered Highlighted Category Title - No numbers */}
                <Container className="mb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-black tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
                      <span className="bg-gradient-to-r from-(--brand-ink) via-(--brand-orange-deep) to-(--brand-ink) bg-clip-text text-transparent">
                        {category.name}
                      </span>
                    </h2>
                    <span className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-(--brand-orange) to-(--brand-orange-deep) opacity-80" />
                  </div>
                </Container>

                {/* Marquee Row - Edge to Edge across full window width */}
                <div className="relative w-full overflow-hidden py-2">
                  {/* Gradient Fade Overlays */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-(--brand-bg) to-transparent sm:w-24" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-(--brand-bg) to-transparent sm:w-24" />

                  <Marquee
                    pauseOnHover
                    reverse={index % 2 === 1}
                    className="py-4 [--duration:35s]"
                    repeat={4}
                  >
                    {category.technologies.map((tech) => (
                      <div
                        key={tech.id}
                        className="group relative flex w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-(--brand-line)/60 bg-(--surface-strong)/60 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:bg-(--surface-strong) hover:shadow-xl hover:shadow-(--brand-orange-soft) sm:w-52"
                      >
                        {/* Prominent Centerpiece Icon - No container box */}
                        <div className="flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110">
                          <TechIcon
                            src={tech.icon}
                            alt={tech.name}
                            color={tech.color}
                            className="size-14 sm:size-16 object-contain"
                          />
                        </div>

                        {/* Tech Name & Link */}
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-(--brand-ink) sm:text-base">
                            {tech.name}
                          </h3>
                          {tech.url ? (
                            <a
                              href={tech.url}
                              target="_blank"
                              rel="noreferrer"
                              title={`Visit ${tech.name}`}
                              className="text-(--brand-muted) opacity-0 transition group-hover:opacity-100 hover:text-(--brand-orange-deep)"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </Marquee>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
