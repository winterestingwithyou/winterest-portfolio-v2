import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Header from '../header'

import { authClient } from '#/lib/auth-client'

import type * as TanstackReactQuery from '@tanstack/react-query'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    className,
    onClick,
    tabIndex,
    'aria-label': ariaLabel,
  }: {
    to: string
    children?: React.ReactNode
    className?: string
    onClick?: (e: React.MouseEvent) => void
    tabIndex?: number
    'aria-label'?: string
  }) => (
    <a
      href={to}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  ),
  useRouterState: vi.fn(() => '/'),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanstackReactQuery>()
  return {
    ...actual,
    useQuery: vi.fn(() => ({ data: [] })),
  }
})

vi.mock('#/lib/auth-client', () => ({
  authClient: {
    getSession: vi.fn(),
  },
}))

vi.mock('../locale-switcher.tsx', () => ({
  default: () => <div data-testid="locale-switcher" />,
}))

vi.mock('../theme-toggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))

vi.mock('../react-bits/gooey-nav/gooey-nav', () => ({
  default: () => <div data-testid="gooey-nav" />,
}))

describe('Header responsive navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('does not render dashboard link or card when user is not authenticated', async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: null,
      error: null,
    } as any)

    render(<Header />)

    // Wait for session effect
    await waitFor(() => {
      expect(authClient.getSession).toHaveBeenCalled()
    })

    // No dashboard link in topbar
    expect(screen.queryByRole('link', { name: /dashboard/i })).toBeNull()

    // No login link anywhere (strict zero-login policy)
    expect(screen.queryByRole('link', { name: /login/i })).toBeNull()

    // Open mobile hamburger
    const hamburger = screen.getByRole('button', { name: /open navigation/i })
    fireEvent.click(hamburger)

    // Mobile drawer should not show Dashboard CMS card
    expect(screen.queryByText('Dashboard CMS')).toBeNull()
    expect(screen.queryByText('Access content management panel')).toBeNull()
  })

  it('renders hidden md:inline-grid topbar icon and prominent drawer card when authenticated', async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: {
        user: { id: 'user-1', email: 'test@example.com', name: 'Winterest' },
        session: { id: 'session-1', userId: 'user-1' },
      },
      error: null,
    } as any)

    render(<Header />)

    // Wait for session resolution
    await waitFor(() => {
      expect(
        screen.getByText('Dashboard', { selector: '.sr-only' }),
      ).toBeDefined()
    })

    // Topbar dashboard link must have 'hidden md:inline-grid' so it is hidden on mobile
    const topbarDashboardLink = screen
      .getByText('Dashboard', { selector: '.sr-only' })
      .closest('a')
    expect(topbarDashboardLink).not.toBeNull()
    expect(topbarDashboardLink?.className).toContain('hidden')
    expect(topbarDashboardLink?.className).toContain('md:inline-grid')

    // Open mobile menu
    const hamburger = screen.getByRole('button', { name: /open navigation/i })
    fireEvent.click(hamburger)

    // Mobile drawer now displays prominent Dashboard CMS card
    const drawerDashboardHeading = screen.getByText('Dashboard CMS', {
      selector: '.text-sm.font-bold',
    })
    expect(drawerDashboardHeading).toBeDefined()

    const drawerDashboardDesc = screen.getByText(
      'Access content management panel',
    )
    expect(drawerDashboardDesc).toBeDefined()

    const drawerDashboardCard = drawerDashboardHeading.closest('a')
    expect(drawerDashboardCard).not.toBeNull()
    expect(drawerDashboardCard?.getAttribute('href')).toBe('/dashboard')

    // Clicking drawer card closes the mobile menu
    fireEvent.click(drawerDashboardCard!)
    expect(hamburger.getAttribute('aria-expanded')).toBe('false')
  })
})
