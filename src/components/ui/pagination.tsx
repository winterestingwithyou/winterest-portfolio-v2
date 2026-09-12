import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'
import { Slot } from 'radix-ui'

import { buttonVariants } from '#/components/ui/button'
import type { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  asChild?: boolean
  disabled?: boolean
  href?: string
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  asChild = false,
  disabled = false,
  ...props
}: PaginationLinkProps) {
  if (asChild) {
    return (
      <Slot.Root
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
          }),
          disabled && 'pointer-events-none opacity-40 cursor-not-allowed',
          className,
        )}
        {...props}
      />
    )
  }

  if (props.href) {
    return (
      <a
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
          }),
          disabled && 'pointer-events-none opacity-40 cursor-not-allowed',
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      data-slot="pagination-link"
      data-active={isActive}
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        disabled && 'pointer-events-none opacity-40 cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      {children ?? (
        <>
          <ChevronLeftIcon />
          <span className="hidden sm:block">Previous</span>
        </>
      )}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      {children ?? (
        <>
          <span className="hidden sm:block">Next</span>
          <ChevronRightIcon />
        </>
      )}
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
