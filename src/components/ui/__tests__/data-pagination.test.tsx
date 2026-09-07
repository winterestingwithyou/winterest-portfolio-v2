import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DataPagination } from '#/components/ui/data-pagination'

afterEach(() => {
  cleanup()
})

describe('DataPagination', () => {
  it('renders nothing when totalPages is 1 and showItemCount is false', () => {
    const { container } = render(
      <DataPagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders item count when showItemCount is true', () => {
    render(
      <DataPagination
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
        showItemCount
        totalItems={25}
        pageSize={10}
      />,
    )
    expect(
      screen.getByText((_, element) => {
        if (!element) return false
        return (
          element.tagName.toLowerCase() === 'span' &&
          element.textContent.includes('Showing 1 to 10 of 25 items')
        )
      }),
    ).toBeDefined()
  })

  it('handles page change on click', () => {
    const handlePageChange = vi.fn()
    render(
      <DataPagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    )

    const page2Button = screen.getByLabelText('Go to page 2')
    fireEvent.click(page2Button)
    expect(handlePageChange).toHaveBeenCalledWith(2)
  })

  it('disables previous button on first page', () => {
    const handlePageChange = vi.fn()
    render(
      <DataPagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    )

    const prevButton = screen.getByLabelText('Go to previous page')
    expect(prevButton.hasAttribute('disabled')).toBe(true)
    fireEvent.click(prevButton)
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('disables next button on last page', () => {
    const handlePageChange = vi.fn()
    render(
      <DataPagination
        page={5}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    )

    const nextButton = screen.getByLabelText('Go to next page')
    expect(nextButton.hasAttribute('disabled')).toBe(true)
    fireEvent.click(nextButton)
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('calls onPageChange with next page when next button is clicked', () => {
    const handlePageChange = vi.fn()
    render(
      <DataPagination
        page={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    )

    const nextButton = screen.getByLabelText('Go to next page')
    expect(nextButton.hasAttribute('disabled')).toBe(false)
    fireEvent.click(nextButton)
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it('renders localized Indonesian text and aria-labels when locale is id', () => {
    render(
      <DataPagination
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
        showItemCount
        totalItems={15}
        pageSize={5}
        locale="id"
        itemLabel="project"
      />,
    )

    expect(
      screen.getByText((_, element) => {
        if (!element) return false
        return (
          element.tagName.toLowerCase() === 'span' &&
          element.textContent.includes('Menampilkan 1 sampai 5 dari 15 project')
        )
      }),
    ).toBeDefined()

    const prevButton = screen.getByLabelText('Ke halaman sebelumnya')
    expect(prevButton).toBeDefined()
    expect(prevButton.hasAttribute('disabled')).toBe(true)

    const nextButton = screen.getByLabelText('Ke halaman berikutnya')
    expect(nextButton).toBeDefined()
    expect(nextButton.hasAttribute('disabled')).toBe(false)
  })

  it('supports custom label overrides', () => {
    render(
      <DataPagination
        page={1}
        totalPages={2}
        onPageChange={vi.fn()}
        showItemCount
        totalItems={8}
        pageSize={5}
        labels={{
          showing: 'Displaying',
          to: 'thru',
          of: 'out of',
          items: 'entries',
        }}
      />,
    )

    expect(
      screen.getByText((_, element) => {
        if (!element) return false
        return (
          element.tagName.toLowerCase() === 'span' &&
          element.textContent.includes('Displaying 1 thru 5 out of 8 entries')
        )
      }),
    ).toBeDefined()
  })
})
