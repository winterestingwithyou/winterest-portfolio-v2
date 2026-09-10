import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SectionHeader } from '#/components/marketing/section'

afterEach(() => {
  cleanup()
})

describe('SectionHeader component', () => {
  it('renders h2 by default', () => {
    render(<SectionHeader title="Featured Projects" />)

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Featured Projects',
    })
    expect(heading).toBeDefined()
    expect(heading.tagName).toBe('H2')
  })

  it('renders h1 when asHeading="h1" is passed', () => {
    render(
      <SectionHeader
        asHeading="h1"
        title="Resume — Winterest"
        eyebrow="Curriculum Vitae"
        description="Fullstack developer summary"
      />,
    )

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Resume — Winterest',
    })
    expect(heading).toBeDefined()
    expect(heading.tagName).toBe('H1')
    expect(screen.getByText('Curriculum Vitae')).toBeDefined()
    expect(screen.getByText('Fullstack developer summary')).toBeDefined()
  })
})
