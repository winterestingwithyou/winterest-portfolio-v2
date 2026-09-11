import { describe, expect, it } from 'vitest'

import { portfolioCopy } from '../copy'

describe('header navigation copy', () => {
  it('provides dashboard tokens in portfolio copy for both English and Indonesian', () => {
    expect(portfolioCopy.en.nav.dashboard).toBe('Dashboard CMS')
    expect(portfolioCopy.en.nav.dashboardDesc).toBe(
      'Access content management panel',
    )

    expect(portfolioCopy.id.nav.dashboard).toBe('Dashboard CMS')
    expect(portfolioCopy.id.nav.dashboardDesc).toBe(
      'Akses panel manajemen konten',
    )
  })
})
