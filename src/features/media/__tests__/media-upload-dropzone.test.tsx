import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FetchError } from 'ofetch'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { MediaUploadDropzone } from '../components/section/media-upload-dropzone'

afterEach(() => {
  cleanup()
})

const mockCopy = getDashboardCopy().media

describe('MediaUploadDropzone', () => {
  it('renders default dropzone state without error or success banner', () => {
    render(
      <MediaUploadDropzone
        copy={mockCopy}
        isUploading={false}
        isError={false}
        isSuccess={false}
        onUpload={vi.fn()}
      />,
    )

    expect(screen.getByText(mockCopy.uploadTitle)).toBeDefined()
    expect(screen.getByText(mockCopy.browseFiles)).toBeDefined()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('displays clear server error from FetchError payload', () => {
    const fetchError = new FetchError('[POST] "/api/media": 400 Bad Request')
    fetchError.status = 400
    fetchError.data = { error: 'File size exceeds 10MB limit.' }

    render(
      <MediaUploadDropzone
        copy={mockCopy}
        isUploading={false}
        isError={true}
        error={fetchError}
        onUpload={vi.fn()}
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeDefined()
    expect(alert.textContent).toContain('File size exceeds 10MB limit.')
    // Should NOT show raw ofetch status line
    expect(alert.textContent).not.toContain('[POST]')
  })

  it('suppresses raw ofetch HTTP debug line and displays fallback copy', () => {
    render(
      <MediaUploadDropzone
        copy={mockCopy}
        isUploading={false}
        isError={true}
        errorMessage='[POST] "https://example.com/api/media": 500 Internal Server Error'
        onUpload={vi.fn()}
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeDefined()
    expect(alert.textContent).toContain(mockCopy.uploadError)
    expect(alert.textContent).not.toContain('[POST]')
  })

  it('displays clean custom error message when provided', () => {
    render(
      <MediaUploadDropzone
        copy={mockCopy}
        isUploading={false}
        isError={true}
        errorMessage="Format file tidak didukung."
        onUpload={vi.fn()}
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeDefined()
    expect(alert.textContent).toContain('Format file tidak didukung.')
  })

  it('displays error when onUpload rejects with an error', async () => {
    const fetchError = new FetchError('[POST] "/api/media": 400')
    fetchError.data = { error: 'Invalid file type: text/plain.' }
    const onUploadMock = vi.fn().mockRejectedValue(fetchError)

    const { container } = render(
      <MediaUploadDropzone
        copy={mockCopy}
        isUploading={false}
        onUpload={onUploadMock}
      />,
    )

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeDefined()

    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toBeDefined()
      expect(alert.textContent).toContain('Invalid file type: text/plain.')
    })
  })

  it('displays success banner when isSuccess is true and no error exists', () => {
    render(
      <MediaUploadDropzone
        copy={mockCopy}
        isUploading={false}
        isError={false}
        isSuccess={true}
        onUpload={vi.fn()}
      />,
    )

    const status = screen.getByRole('status')
    expect(status).toBeDefined()
    expect(status.textContent).toContain(mockCopy.uploadSuccess)
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
