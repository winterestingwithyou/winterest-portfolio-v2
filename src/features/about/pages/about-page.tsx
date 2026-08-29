import { Container } from '#/components/marketing/section'
import { AboutHero } from '#/features/about/components/section/about-hero'
import { BeyondTheCodeSection } from '#/features/about/components/section/beyond-the-code-section'
import { CurrentlyExploringSection } from '#/features/about/components/section/currently-exploring-section'
import { DrivesSection } from '#/features/about/components/section/drives-section'
import { EngineeringMindsetSection } from '#/features/about/components/section/engineering-mindset-section'
import { JourneyTimelineSection } from '#/features/about/components/section/journey-timeline-section'
import { ValuesSection } from '#/features/about/components/section/values-section'
import { getAboutData } from '#/features/about/data'

export function AboutPage() {
  const data = getAboutData()

  return (
    <main className="px-4 py-12 sm:py-20">
      <Container className="space-y-20 sm:space-y-28">
        <AboutHero hero={data.hero} />
        <DrivesSection drives={data.drives} />
        <EngineeringMindsetSection workflow={data.workflow} />
        <JourneyTimelineSection journey={data.journey} />
        <ValuesSection values={data.values} />
        <BeyondTheCodeSection beyond={data.beyond} />
        <CurrentlyExploringSection exploring={data.exploring} />
      </Container>
    </main>
  )
}
