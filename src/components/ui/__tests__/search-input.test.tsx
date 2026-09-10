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

  it('preserves trailing spaces when user types and does not reset if external value matches trimmed', () => {
    const handleChange = vi.fn()
    const { rerender } = render(
      <SearchInput
        placeholder="Search..."
        value="web"
        onChange={handleChange}
      />,
    )

    const input = screen.getByPlaceholderText('Search...')
    expect((input as HTMLInputElement).value).toBe('web')

    // Simulate typing a space: "web "
    fireEvent.change(input, { target: { value: 'web ' } })
    expect((input as HTMLInputElement).value).toBe('web ')

    // Simulate parent re-rendering with trimmed value "web"
    rerender(
      <SearchInput
        placeholder="Search..."
        value="web"
        onChange={handleChange}
      />,
    )

    // Trailing space should still be preserved
    expect((input as HTMLInputElement).value).toBe('web ')
  })

  it('does not swallow typed characters when parent has not yet received the debounced value', () => {
    const handleChange = vi.fn()
    render(
      <SearchInput placeholder="Search..." value="" onChange={handleChange} />,
    )

    const input = screen.getByPlaceholderText('Search...')

    // User types "hello" — the debounced onChange hasn't fired yet,
    // so the external value prop is still "". The sync effect must
    // NOT reset localValue back to "".
    fireEvent.change(input, { target: { value: 'h' } })
    expect((input as HTMLInputElement).value).toBe('h')

    fireEvent.change(input, { target: { value: 'he' } })
    expect((input as HTMLInputElement).value).toBe('he')

    fireEvent.change(input, { target: { value: 'hel' } })
    expect((input as HTMLInputElement).value).toBe('hel')
  })
})
