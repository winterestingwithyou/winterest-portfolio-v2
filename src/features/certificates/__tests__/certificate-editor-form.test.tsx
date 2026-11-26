import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CertificateEditorForm } from '../components/form/certificate-editor-form'
import type { CertificateRecord } from '../queries'

const { createMutation, updateMutation, deleteMutation, navigate } = vi.hoisted(
  () => ({
    createMutation: vi.fn(),
    updateMutation: vi.fn(),
    deleteMutation: vi.fn(),
    navigate: vi.fn(),
  }),
)

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}))

vi.mock('#/paraglide/runtime', () => ({ getLocale: () => 'en' }))

vi.mock('#/features/certificates/hooks', () => ({
  useCreateCertificate: () => ({
    mutateAsync: createMutation,
    isPending: false,
  }),
  useUpdateCertificate: () => ({
    mutateAsync: updateMutation,
    isPending: false,
  }),
  useDeleteCertificate: () => ({
    mutateAsync: deleteMutation,
    isPending: false,
  }),
}))

const certificate: CertificateRecord = {
  id: 'certificate-id',
  title: 'Certificate title',
  issuer: 'Certificate issuer',
  credentialId: null,
  descriptionEn: null,
  descriptionId: null,
  coverImageUrl: null,
  pdfUrl: null,
  verificationUrl: null,
  status: 'draft',
  issuedAt: new Date('2025-01-01T00:00:00.000Z'),
  expiresAt: null,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
}

afterEach(cleanup)

beforeEach(() => {
  createMutation.mockResolvedValue(undefined)
  updateMutation.mockResolvedValue(undefined)
  deleteMutation.mockResolvedValue(undefined)
  navigate.mockResolvedValue(undefined)
})

describe('CertificateEditorForm artifact tabs', () => {
  it('defaults new certificates to PDF and preserves values while switching tabs', () => {
    render(<CertificateEditorForm />)

    const pdfTab = screen.getByRole('tab', {
      name: 'Certificate PDF, Not provided',
    })
    expect(pdfTab.getAttribute('aria-selected')).toBe('true')
    const inactivePanel = screen
      .getAllByRole('tabpanel')
      .find((panel) => panel.dataset.state === 'inactive')
    expect(inactivePanel?.className).toContain('data-[state=inactive]:hidden')
    expect(
      screen.getByText(
        'At least one option is required. You may provide both.',
      ),
    ).toBeTruthy()
    fireEvent.click(
      screen.getByRole('tab', { name: 'Verification URL, Not provided' }),
    )

    const verificationInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Verification URL (Optional)',
    })
    fireEvent.change(verificationInput, {
      target: { value: 'https://example.com/verify' },
    })
    fireEvent.click(
      screen.getByRole('tab', { name: 'Certificate PDF, Not provided' }),
    )
    fireEvent.click(
      screen.getByRole('tab', { name: 'Verification URL, Provided' }),
    )

    expect(verificationInput.value).toBe('https://example.com/verify')
  }, 10_000)

  it('opens the populated tab, preferring PDF when both values exist', () => {
    render(
      <CertificateEditorForm
        certificate={{
          ...certificate,
          pdfUrl: 'https://example.com/certificate.pdf',
          verificationUrl: 'https://example.com/verify',
        }}
      />,
    )

    expect(
      screen
        .getByRole('tab', { name: 'Certificate PDF, Provided' })
        .getAttribute('aria-selected'),
    ).toBe('true')
    const verificationTab = screen.getByRole('tab', {
      name: 'Verification URL, Provided',
    })
    expect(verificationTab.querySelector('svg')).toBeTruthy()

    cleanup()
    render(
      <CertificateEditorForm
        certificate={{
          ...certificate,
          verificationUrl: 'https://example.com/verify',
        }}
      />,
    )

    expect(
      screen
        .getByRole('tab', { name: 'Verification URL, Provided' })
        .getAttribute('aria-selected'),
    ).toBe('true')
  })

  it('groups media previews and actions without rendering raw URLs', () => {
    const coverUrl = 'https://example.com/cover.png'
    const pdfUrl = 'https://example.com/certificate.pdf'
    const { container } = render(
      <CertificateEditorForm
        certificate={{
          ...certificate,
          coverImageUrl: coverUrl,
          pdfUrl,
        }}
      />,
    )

    expect(screen.getByText('Cover image selected')).toBeTruthy()
    expect(screen.getByText('Certificate PDF selected')).toBeTruthy()
    expect(container.querySelector(`img[src="${coverUrl}"]`)).toBeTruthy()
    expect(screen.queryByText(pdfUrl)).toBeNull()
    expect(
      screen.getByRole('link', { name: 'View PDF' }).getAttribute('href'),
    ).toBe(pdfUrl)

    fireEvent.click(screen.getByRole('button', { name: 'Remove image' }))
    expect(screen.getByText('No cover image selected')).toBeTruthy()
    expect(container.querySelector(`img[src="${coverUrl}"]`)).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Remove PDF' }))
    expect(screen.getByText('No certificate PDF selected')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'View PDF' })).toBeNull()
  })

  it('switches to the tab containing a validation error on submit', async () => {
    render(<CertificateEditorForm />)
    fireEvent.click(
      screen.getByRole('tab', { name: 'Verification URL, Not provided' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save certificate' }))

    await waitFor(() =>
      expect(
        screen
          .getByRole('tab', { name: 'Certificate PDF, Not provided' })
          .getAttribute('aria-selected'),
      ).toBe('true'),
    )
  })

  it('switches from PDF to verification when the URL is invalid', async () => {
    render(
      <CertificateEditorForm
        certificate={{
          ...certificate,
          pdfUrl: 'https://example.com/certificate.pdf',
          verificationUrl: 'not a valid URL',
        }}
      />,
    )

    expect(
      screen
        .getByRole('tab', { name: 'Certificate PDF, Provided' })
        .getAttribute('aria-selected'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Save certificate' }))

    await waitFor(() =>
      expect(
        screen
          .getByRole('tab', { name: 'Verification URL, Provided' })
          .getAttribute('aria-selected'),
      ).toBe('true'),
    )
  })
})
