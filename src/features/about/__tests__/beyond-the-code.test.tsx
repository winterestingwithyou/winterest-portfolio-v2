import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { BeyondTheCodeSection } from '../components/section/beyond-the-code-section'
import { getAboutData } from '../copy'

beforeAll(() => {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
})

afterEach(() => {
  cleanup()
})

describe('BeyondTheCodeSection accessibility', () => {
  it('renders tablist and tabs with correct ARIA semantics', () => {
    const data = getAboutData()
    render(<BeyondTheCodeSection beyond={data.beyond} />)

    const tablist = screen.getByRole('tablist', {
      name: /Beyond the Code categories/i,
    })
    expect(tablist).toBeDefined()

    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBe(3)

    // Initially gaming tab is selected
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].getAttribute('aria-controls')).toBe('beyond-panel-gaming')
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
    expect(tabs[2].getAttribute('aria-selected')).toBe('false')

    // Initial panel is gaming
    const panel = screen.getByRole('tabpanel')
    expect(panel.id).toBe('beyond-panel-gaming')
    expect(panel.getAttribute('aria-labelledby')).toBe('beyond-tab-gaming')
  })

  it('switches active tab and controls panel when clicked', async () => {
    const data = getAboutData()
    render(<BeyondTheCodeSection beyond={data.beyond} />)

    const tabs = screen.getAllByRole('tab')
    const animeTab = tabs[1]

    fireEvent.click(animeTab)

    expect(animeTab.getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')

    await waitFor(() => {
      const panel = screen.getByRole('tabpanel')
      expect(panel.id).toBe('beyond-panel-anime')
      expect(panel.getAttribute('aria-labelledby')).toBe('beyond-tab-anime')
    })
  })
})
