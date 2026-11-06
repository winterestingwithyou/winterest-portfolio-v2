import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProjectGalleryCarousel } from '../components/section/project-gallery-carousel'

const labels = {
  label: 'Project images',
  empty: 'No project images available',
  previous: 'Previous image',
  next: 'Next image',
  play: 'Play slideshow',
  pause: 'Pause slideshow',
  position: (current: number, total: number) => `Image ${current} of ${total}`,
  goTo: (position: number) => `Show image ${position}`,
}

describe('ProjectGalleryCarousel', () => {
  afterEach(cleanup)

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })

    const Observer = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', Observer)
    vi.stubGlobal('ResizeObserver', Observer)

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((media: string) => ({
        matches: false,
        media,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })
  it('shows an image fallback without carousel controls when empty', () => {
    render(
      <ProjectGalleryCarousel
        images={[]}
        labels={labels}
        fallbackLabel="Application"
      />,
    )

    expect(
      screen.getByRole('img', {
        name: 'No project images available: Application',
      }),
    ).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('shows a single image without carousel controls', () => {
    render(
      <ProjectGalleryCarousel
        images={[{ url: '/cover.jpg', alt: 'Project cover' }]}
        labels={labels}
        fallbackLabel="Application"
      />,
    )

    expect(screen.getByRole('img', { name: 'Project cover' })).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('exposes navigation and a play/pause control for multiple images', () => {
    render(
      <ProjectGalleryCarousel
        images={[
          { url: '/cover.jpg', alt: 'Project cover' },
          { url: '/detail.jpg', alt: 'Project detail' },
        ]}
        labels={labels}
        fallbackLabel="Application"
      />,
    )

    expect(screen.getByRole('region', { name: 'Project images' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Previous image' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next image' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Pause slideshow' })).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /Show image/ })).toHaveLength(
      2,
    )

    fireEvent.focus(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByRole('button', { name: 'Play slideshow' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Play slideshow' }))
    expect(screen.getByRole('button', { name: 'Pause slideshow' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('button', { name: 'Play slideshow' })).toBeTruthy()
  })

  it('starts paused for reduced motion but allows explicit playback', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      () =>
        ({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    )

    render(
      <ProjectGalleryCarousel
        images={[
          { url: '/cover.jpg', alt: 'Project cover' },
          { url: '/detail.jpg', alt: 'Project detail' },
        ]}
        labels={labels}
        fallbackLabel="Application"
      />,
    )

    expect(screen.getByRole('button', { name: 'Play slideshow' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Play slideshow' }))
    expect(screen.getByRole('button', { name: 'Pause slideshow' })).toBeTruthy()
  })
})
