import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { UnsavedChangesDialog } from '../unsaved-changes-dialog'
import type { BlockerResolver } from '../unsaved-changes-dialog'

afterEach(() => {
  cleanup()
})

describe('UnsavedChangesDialog', () => {
  it('renders nothing when blocker status is idle', () => {
    const idleBlocker: BlockerResolver = {
      status: 'idle',
      current: undefined,
      next: undefined,
      action: undefined,
      proceed: undefined,
      reset: undefined,
    }

    const { container } = render(<UnsavedChangesDialog blocker={idleBlocker} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders confirmation dialog when blocker status is blocked', () => {
    const mockProceed = vi.fn()
    const mockReset = vi.fn()
    const blockedBlocker: BlockerResolver = {
      status: 'blocked',
      current: {} as any,
      next: {} as any,
      action: 'PUSH',
      proceed: mockProceed,
      reset: mockReset,
    }

    render(<UnsavedChangesDialog blocker={blockedBlocker} />)

    expect(screen.getByRole('alertdialog')).toBeDefined()
    expect(
      screen.getByRole('heading', { name: /unsaved changes/i }),
    ).toBeDefined()
    expect(screen.getByText(/your changes will be lost/i)).toBeDefined()
  })

  it('calls blocker.reset when cancel button is clicked', () => {
    const mockProceed = vi.fn()
    const mockReset = vi.fn()
    const blockedBlocker: BlockerResolver = {
      status: 'blocked',
      current: {} as any,
      next: {} as any,
      action: 'PUSH',
      proceed: mockProceed,
      reset: mockReset,
    }

    render(<UnsavedChangesDialog blocker={blockedBlocker} />)

    const cancelButton = screen.getByRole('button', { name: /stay/i })
    fireEvent.click(cancelButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
    expect(mockProceed).not.toHaveBeenCalled()
  })

  it('calls blocker.proceed when leave action button is clicked', () => {
    const mockProceed = vi.fn()
    const mockReset = vi.fn()
    const blockedBlocker: BlockerResolver = {
      status: 'blocked',
      current: {} as any,
      next: {} as any,
      action: 'PUSH',
      proceed: mockProceed,
      reset: mockReset,
    }

    render(<UnsavedChangesDialog blocker={blockedBlocker} />)

    const leaveButton = screen.getByRole('button', {
      name: /leave without saving/i,
    })
    fireEvent.click(leaveButton)

    expect(mockProceed).toHaveBeenCalledTimes(1)
    expect(mockReset).not.toHaveBeenCalled()
  })
})
