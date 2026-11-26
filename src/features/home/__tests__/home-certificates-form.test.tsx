import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getDefaultCertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import { HomeCertificatesForm } from '../components/form/home-certificates-form'

vi.mock('#/paraglide/runtime', () => ({ getLocale: () => 'en' }))

afterEach(cleanup)

describe('HomeCertificatesForm', () => {
  it('edits the localized homepage section fields and description visibility', () => {
    const config = getDefaultCertificatesPageConfig()

    function FormHarness() {
      const [formData, setFormData] = useState(config)

      return (
        <HomeCertificatesForm
          locale="en"
          formData={formData}
          onChange={setFormData}
        />
      )
    }

    render(<FormHarness />)

    fireEvent.change(screen.getByLabelText('Title (EN)'), {
      target: { value: 'Credentials' },
    })
    expect(screen.getByDisplayValue('Credentials')).toBeTruthy()

    const descriptionSwitch = screen.getByRole('switch', {
      name: 'Show description',
    })
    fireEvent.click(descriptionSwitch)
    expect(descriptionSwitch.getAttribute('aria-checked')).toBe('false')
  }, 15_000)
})
