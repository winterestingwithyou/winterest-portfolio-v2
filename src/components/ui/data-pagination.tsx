import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination'
import { cn } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

export type DataPaginationLabels = {
  showing?: string
  to?: string
  of?: string
  items?: string
  previous?: string
  next?: string
  morePages?: string
  goToPreviousPage?: string
  goToNextPage?: string
  goToPage?: (page: number) => string
  paginationNav?: string
}

export type DataPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  showItemCount?: boolean
  siblingCount?: number
  className?: string
  itemLabel?: string
  locale?: 'en' | 'id'
  labels?: DataPaginationLabels
}

export function DataPagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  showItemCount = false,
  siblingCount = 1,
  className,
  itemLabel,
  locale,
  labels,
}: DataPaginationProps) {
  // Determine active locale: prop override or Paraglide runtime
  const activeLocale = locale ?? (getLocale() === 'id' ? 'id' : 'en')

  const defaultLabels: Required<DataPaginationLabels> =
    activeLocale === 'id'
      ? {
          showing: 'Menampilkan',
          to: 'sampai',
          of: 'dari',
          items: 'item',
          previous: 'Sebelumnya',
          next: 'Berikutnya',
          morePages: 'Halaman lainnya',
          goToPreviousPage: 'Ke halaman sebelumnya',
          goToNextPage: 'Ke halaman berikutnya',
          goToPage: (p: number) => `Ke halaman ${p}`,
          paginationNav: 'Navigasi halaman',
        }
      : {
          showing: 'Showing',
          to: 'to',
          of: 'of',
          items: 'items',
          previous: 'Previous',
          next: 'Next',
          morePages: 'More pages',
          goToPreviousPage: 'Go to previous page',
          goToNextPage: 'Go to next page',
          goToPage: (p: number) => `Go to page ${p}`,
          paginationNav: 'Pagination',
        }

  const t: Required<DataPaginationLabels> = {
    ...defaultLabels,
    ...labels,
  }

  const activeItemLabel = itemLabel ?? t.items

  // If no pages or only 1 page with no items count to show, hide
  if (totalPages <= 1 && (!showItemCount || totalItems === 0)) {
    return null
  }

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5 // siblings + first + last + current + 2 ellipsis

    // Case 1: Total pages less than what we want to display with ellipsis
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1)
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    // Case 2: No left dots to show, but right dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, 'ellipsis-right', lastPageIndex]
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      )
      return [firstPageIndex, 'ellipsis-left', ...rightRange]
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      )
      return [
        firstPageIndex,
        'ellipsis-left',
        ...middleRange,
        'ellipsis-right',
        lastPageIndex,
      ]
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages, page, siblingCount])

  const startItem =
    totalItems && pageSize ? Math.min((page - 1) * pageSize + 1, totalItems) : 0
  const endItem =
    totalItems && pageSize ? Math.min(page * pageSize, totalItems) : 0

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 py-2 sm:flex-row',
        className,
      )}
    >
      {showItemCount && totalItems !== undefined && pageSize !== undefined ? (
        <div className="text-xs text-(--brand-muted)">
          {totalItems === 0 ? (
            <span>0 {activeItemLabel}</span>
          ) : (
            <span>
              {t.showing}{' '}
              <span className="font-semibold text-(--brand-ink)">
                {startItem}
              </span>{' '}
              {t.to}{' '}
              <span className="font-semibold text-(--brand-ink)">
                {endItem}
              </span>{' '}
              {t.of}{' '}
              <span className="font-semibold text-(--brand-ink)">
                {totalItems}
              </span>{' '}
              {activeItemLabel}
            </span>
          )}
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}

      {totalPages > 1 && (
        <Pagination
          aria-label={t.paginationNav}
          className="mx-0 w-auto justify-center sm:justify-end"
        >
          <PaginationContent className="flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
                disabled={page <= 1}
                aria-disabled={page <= 1}
                aria-label={t.goToPreviousPage}
                className="cursor-pointer select-none"
              >
                <ChevronLeftIcon className="size-4" />
                <span className="hidden sm:inline">{t.previous}</span>
              </PaginationPrevious>
            </PaginationItem>

            {paginationRange.map((pageNumber, idx) => {
              if (
                pageNumber === 'ellipsis-left' ||
                pageNumber === 'ellipsis-right'
              ) {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis>
                      <span className="sr-only">{t.morePages}</span>
                    </PaginationEllipsis>
                  </PaginationItem>
                )
              }

              const pageNum = Number(pageNumber)
              const isCurrent = pageNum === page

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={isCurrent}
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(pageNum)
                    }}
                    aria-label={t.goToPage(pageNum)}
                    className={cn(
                      'cursor-pointer select-none',
                      isCurrent &&
                        'border-(--brand-orange) bg-(--brand-orange-soft) font-bold text-(--brand-orange-deep) hover:bg-(--brand-orange-soft)',
                    )}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) onPageChange(page + 1)
                }}
                disabled={page >= totalPages}
                aria-disabled={page >= totalPages}
                aria-label={t.goToNextPage}
                className="cursor-pointer select-none"
              >
                <span className="hidden sm:inline">{t.next}</span>
                <ChevronRightIcon className="size-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
