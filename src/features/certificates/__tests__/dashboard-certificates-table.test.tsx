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

const defaultTableProps: ComponentProps<typeof DashboardCertificatesTable> = {
  certificates: [certificate],
  copy: certificatesCopy.en.dashboard,
  locale: 'en-US',
  onDeleteCertificate: vi.fn(),
  search: '',
  onSearchChange: vi.fn(),
  statusFilter: 'all',
  onStatusFilterChange: vi.fn(),
  issuerFilter: 'all',
  onIssuerFilterChange: vi.fn(),
  page: 1,
  onPageChange: vi.fn(),
  onResetFilters: vi.fn(),
}

function renderTable(
  props: Partial<ComponentProps<typeof DashboardCertificatesTable>> = {},
) {
  return render(
    <DashboardCertificatesTable {...defaultTableProps} {...props} />,
  )
}

describe('DashboardCertificatesTable', () => {
  afterEach(cleanup)

  it('renders certificate details with edit and delete actions', () => {
    const onDeleteCertificate = vi.fn()
    renderTable({ onDeleteCertificate })

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
  }, 15_000)

  it('combines search, status, and issuer filters', () => {
    const matchingCertificate: CertificateRecord = {
      ...certificate,
      id: 'matching-certificate',
      title: 'Edge Credential',
      issuer: 'Issuer Z',
      credentialId: 'credential-123',
      status: 'published',
    }
    const draftCertificate: CertificateRecord = {
      ...matchingCertificate,
      id: 'draft-certificate',
      title: 'Draft Copy',
      status: 'draft',
    }
    const otherIssuerCertificate: CertificateRecord = {
      ...matchingCertificate,
      id: 'other-issuer-certificate',
      title: 'Other Issuer Certificate',
      issuer: 'Issuer A',
    }

    renderTable({
      certificates: [
        matchingCertificate,
        draftCertificate,
        otherIssuerCertificate,
      ],
      search: 'credential-123',
      statusFilter: 'published',
      issuerFilter: 'Issuer Z',
    })

    expect(screen.getByText('Edge Credential')).toBeTruthy()
    expect(screen.queryByText('Draft Copy')).toBeNull()
    expect(screen.queryByText('Other Issuer Certificate')).toBeNull()
  })

  it('searches the English and Indonesian descriptions', () => {
    const describedCertificate: CertificateRecord = {
      ...certificate,
      descriptionEn: 'Edge computing certificate',
      descriptionId: 'Sertifikat komputasi tepi',
    }

    renderTable({
      certificates: [describedCertificate],
      search: 'KOMPUTASI TEPI',
    })

    expect(
      within(screen.getAllByRole('row')[1]).getByText(certificate.title),
    ).toBeTruthy()
  })

  it('offers a reset action when filters return no certificates', () => {
    const onResetFilters = vi.fn()
    renderTable({ search: 'no matching certificate', onResetFilters })

    expect(screen.getByText('No matching certificates.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(onResetFilters).toHaveBeenCalledOnce()
  })

  it('paginates filtered certificates ten at a time', () => {
    renderTable({
      certificates: Array.from({ length: 11 }, (_, index) => ({
        ...certificate,
        id: `certificate-${index}`,
        title: `Certificate ${index + 1}`,
      })),
    })

    expect(screen.getAllByRole('row')).toHaveLength(11)
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }))
    expect(defaultTableProps.onPageChange).toHaveBeenCalledWith(2)
  }, 15_000)
})
