import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DatePicker } from '../date-picker'

describe('DatePicker', () => {
  afterEach(cleanup)

  it('displays and emits dates as DD/MM/YYYY while returning an ISO value', () => {
    const onChange = vi.fn()
    const onBlur = vi.fn()
    render(
      <DatePicker
        id="issuedAt"
        value="2024-08-15"
        onChange={onChange}
        onBlur={onBlur}
      />,
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveProperty('value', '15/08/2024')
    expect(input).toHaveProperty('placeholder', 'DD/MM/YYYY')

    fireEvent.change(input, { target: { value: '16082024' } })
    expect(input).toHaveProperty('value', '16/08/2024')
    expect(onChange).toHaveBeenLastCalledWith(
      new Date(2024, 7, 16),
      '2024-08-16',
    )

    fireEvent.blur(input)
    expect(onBlur).toHaveBeenCalledOnce()
  })
})
