import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { CertificateRecord } from '../queries'
import { DashboardCertificatesPage } from '../pages/dashboard-certificates-page'

const { mutateAsync } = vi.hoisted(() => ({ mutateAsync: vi.fn() }))

vi.mock('@tanstack/react-query', () => ({
  queryOptions: (options: unknown) => options,
  useSuspenseQuery: () => ({
    data: [certificate],
    refetch: vi.fn(),
    isFetching: false,
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a href="#" {...props}>
      {children}
    </a>
  ),
}))

vi.mock('#/components/dashboard/dashboard-shell', () => ({
  DashboardShell: ({ children }: { children: ReactNode }) => (
    <main>{children}</main>
  ),
}))

vi.mock('#/features/certificates/hooks', () => ({
  useDeleteCertificate: () => ({ mutateAsync, isPending: false }),
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
  status: 'published',
  issuedAt: new Date('2025-01-01T00:00:00.000Z'),
  expiresAt: null,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
}

describe('DashboardCertificatesPage', () => {
  beforeEach(() => {
    mutateAsync.mockResolvedValue(undefined)
  })

  afterEach(cleanup)

  it('requires confirmation before deleting a certificate', async () => {
    render(<DashboardCertificatesPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Delete Certificate title' }),
    )

    expect(
      screen.getByText('Delete “Certificate title”? This cannot be undone.'),
    ).toBeTruthy()
    expect(mutateAsync).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /^Delete$/ }))

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith(certificate.id),
    )
  }, 10_000)
})
