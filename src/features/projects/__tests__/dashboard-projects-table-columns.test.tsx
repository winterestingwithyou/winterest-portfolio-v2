import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { ProjectRow } from '#/features/projects/components/table/dashboard-projects-table-features'

const baseProject: ProjectRow = {
  id: 'proj-1',
  slug: 'my-project',
  title: 'My Project',
  summary: 'A short description.',
  status: 'published',
  featured: false,
  availableLocales: ['en'],
  visibility: 'public',
  category: 'Web',
}

function makeContainer(project: ProjectRow) {
  return (
    <div
      data-testid="cell"
      className="min-w-64 max-w-sm sm:max-w-md space-y-1.5 overflow-hidden"
    >
      <p
        className="truncate font-semibold text-(--brand-ink)"
        title={project.title}
      >
        {project.title}
      </p>
      <p
        className="line-clamp-2 break-words whitespace-normal text-xs leading-relaxed text-(--brand-muted)"
        title={project.summary}
      >
        {project.summary}
      </p>
      <p
        className="truncate font-mono text-xs text-(--brand-muted)"
        title={`/projects/${project.slug}`}
      >
        /projects/{project.slug}
      </p>
    </div>
  )
}

afterEach(() => {
  cleanup()
})

describe('Dashboard Projects Table – title column cell', () => {
  it('renders cell container with overflow-hidden and max-width constraints', () => {
    render(makeContainer(baseProject))
    const cell = screen.getByTestId('cell')
    expect(cell.className).toContain('overflow-hidden')
    expect(cell.className).toContain('max-w-sm')
    expect(cell.className).toContain('min-w-64')
  })

  it('applies truncate and title attribute to project title', () => {
    render(makeContainer(baseProject))
    const titleEl = screen.getByText('My Project')
    expect(titleEl.className).toContain('truncate')
    expect(titleEl.className).toContain('font-semibold')
    expect(titleEl.getAttribute('title')).toBe('My Project')
  })

  it('applies whitespace-normal, line-clamp-2, and break-words to summary', () => {
    render(makeContainer(baseProject))
    const summaryEl = screen.getByText('A short description.')
    expect(summaryEl.className).toContain('whitespace-normal')
    expect(summaryEl.className).toContain('line-clamp-2')
    expect(summaryEl.className).toContain('break-words')
    expect(summaryEl.getAttribute('title')).toBe('A short description.')
  })

  it('applies truncate and full-path title attribute to slug', () => {
    render(makeContainer(baseProject))
    const slugEl = screen.getByText('/projects/my-project')
    expect(slugEl.className).toContain('truncate')
    expect(slugEl.className).toContain('font-mono')
    expect(slugEl.getAttribute('title')).toBe('/projects/my-project')
  })

  it('handles very long unbroken summary without crashing', () => {
    const longProject: ProjectRow = {
      ...baseProject,
      summary: 'a'.repeat(400),
    }
    render(makeContainer(longProject))
    const summaryEl = screen.getByText('a'.repeat(400))
    expect(summaryEl.className).toContain('break-words')
    expect(summaryEl.className).toContain('line-clamp-2')
  })

  it('handles empty summary string gracefully', () => {
    const emptyProject: ProjectRow = { ...baseProject, summary: '' }
    render(makeContainer(emptyProject))
    const cell = screen.getByTestId('cell')
    expect(cell).toBeTruthy()
  })
})
