import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ContactChannels } from '../components/section/contact-channels'
import { contactCopy, getContactCopy } from '../copy'

import type * as TanstackReactQuery from '@tanstack/react-query'

let mockSettings: { publicEmail: string } = { publicEmail: 'contact@example.com' }
let mockSocialLinks: Array<{
  id: string
  platform: 'github' | 'linkedin'
  url: string
  username: string
  accountName: string
}> = []

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanstackReactQuery>()
  return {
    ...actual,
    useQuery: vi.fn(({ queryKey }: { queryKey: readonly unknown[] }) => {
      if (Array.isArray(queryKey) && queryKey[0] === 'site-settings') {
        return { data: mockSettings }
      }
      return { data: mockSocialLinks }
    }),
  }
})

describe('ContactChannels - Dedicated Public Email Card', () => {
  beforeEach(() => {
    mockSettings = { publicEmail: 'contact@example.com' }
    mockSocialLinks = []
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders direct email in status pill card when publicEmail is configured', () => {
    const copy = contactCopy.en.direct
    render(<ContactChannels copy={copy} />)

    expect(screen.getByText('contact@example.com')).toBeDefined()

    const mailtoLink = screen.getByRole('link', { name: new RegExp(copy.sendEmail, 'i') })
    expect(mailtoLink.getAttribute('href')).toBe('mailto:contact@example.com')
  })

  it('does NOT render direct email section when publicEmail is empty or whitespace (Strict Invariant)', () => {
    mockSettings = { publicEmail: '   ' }
    const copy = contactCopy.en.direct
    render(<ContactChannels copy={copy} />)

    expect(screen.queryByText('contact@example.com')).toBeNull()
    expect(screen.queryByRole('link', { name: new RegExp(copy.sendEmail, 'i') })).toBeNull()
  })

  it('does NOT render direct email section when publicEmail is null or undefined (Strict Invariant)', () => {
    mockSettings = { publicEmail: '' }
    const copy = contactCopy.en.direct
    render(<ContactChannels copy={copy} />)

    expect(screen.queryByText('contact@example.com')).toBeNull()
    expect(screen.queryByRole('link', { name: new RegExp(copy.sendEmail, 'i') })).toBeNull()
  })

  it('copies email to clipboard and displays copied feedback for 2000ms', async () => {
    vi.useFakeTimers()
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    })

    const copy = contactCopy.en.direct
    render(<ContactChannels copy={copy} />)

    const copyButton = screen.getByRole('button', { name: new RegExp(copy.copyEmail, 'i') })
    expect(copyButton).toBeDefined()

    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(writeTextMock).toHaveBeenCalledWith('contact@example.com')
    expect(screen.getByText(copy.copiedEmail)).toBeDefined()

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.queryByText(copy.copiedEmail)).toBeNull()
    expect(screen.getByText(copy.copyEmail)).toBeDefined()
  })

  it('renders Indonesian copywriting tokens properly when id locale is active', () => {
    const idCopy = contactCopy.id.direct
    render(<ContactChannels copy={idCopy} />)

    expect(screen.getByRole('link', { name: new RegExp(idCopy.sendEmail, 'i') })).toBeDefined()
    expect(screen.getByRole('button', { name: new RegExp(idCopy.copyEmail, 'i') })).toBeDefined()
  })

  it('provides complete bilingual copy tokens in getContactCopy', () => {
    const currentCopy = getContactCopy()
    expect(currentCopy.direct.emailTitle).toBeTruthy()
    expect(currentCopy.direct.emailSubtitle).toBeTruthy()
    expect(currentCopy.direct.sendEmail).toBeTruthy()
    expect(currentCopy.direct.copyEmail).toBeTruthy()
    expect(currentCopy.direct.copiedEmail).toBeTruthy()

    expect(contactCopy.en.direct.emailTitle).toBe('Email Address')
    expect(contactCopy.en.direct.emailSubtitle).toBe('Official direct correspondence.')
    expect(contactCopy.id.direct.emailTitle).toBe('Alamat Email')
    expect(contactCopy.id.direct.emailSubtitle).toBe('Komunikasi resmi & korespondensi langsung.')
  })
})
