import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DashboardCertificatesTable } from '../components/table/dashboard-certificates-table'
import { certificatesCopy } from '../copy'
import type { CertificateRecord } from '../queries'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => (
    <a href="#" {...props}>
      {children}
    </a>
  ),
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
  expiresAt: new Date('2027-01-01T00:00:00.000Z'),
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
}

describe('DashboardCertificatesTable', () => {
  afterEach(cleanup)

  it('renders certificate details with edit and delete actions', () => {
    const onDeleteCertificate = vi.fn()
    render(
      <DashboardCertificatesTable
        certificates={[certificate]}
        copy={certificatesCopy.en.dashboard}
        locale="en-US"
        onDeleteCertificate={onDeleteCertificate}
      />,
    )

    expect(screen.getByRole('table')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: `Edit ${certificate.title}` }),
    ).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeTruthy()
    expect(
      within(screen.getAllByRole('row')[1]).getByText(certificate.title),
    ).toBeTruthy()
    expect(screen.getByText(certificate.issuer)).toBeTruthy()
    expect(screen.getByText('Jan 2025')).toBeTruthy()
    expect(screen.getByText('Jan 2027')).toBeTruthy()
    expect(screen.getByText('Published')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', { name: `Delete ${certificate.title}` }),
    )
    expect(onDeleteCertificate).toHaveBeenCalledWith(certificate)
  })
})
