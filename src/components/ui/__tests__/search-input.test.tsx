import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SearchInput } from '#/components/ui/search-input'

afterEach(() => {
  cleanup()
})

describe('SearchInput', () => {
  it('renders input with placeholder and value', () => {
    render(
      <SearchInput
        placeholder="Search projects..."
        value="React"
        onChange={vi.fn()}
      />,
    )

    const input = screen.getByPlaceholderText('Search projects...')
    expect(input).toBeDefined()
    expect((input as HTMLInputElement).value).toBe('React')
  })

  it('renders clear button when value is present and clears on click', () => {
    const handleChange = vi.fn()
    render(
      <SearchInput
        placeholder="Search..."
        value="Cloudflare"
        onChange={handleChange}
      />,
    )

    const clearButton = screen.getByLabelText('Clear search')
    expect(clearButton).toBeDefined()
    fireEvent.click(clearButton)
    expect(handleChange).toHaveBeenCalledWith('')
  })
})
