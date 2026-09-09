import { describe, expect, it } from 'vitest'

import { portfolioCopy } from '../copy'
import { projectsCopy } from '#/features/projects/copy'

describe('portfolio & projects polish copy', () => {
  it('provides printButton token in resume copy for both languages', () => {
    expect(portfolioCopy.en.resume.printButton).toBe('Print / Save PDF')
    expect(portfolioCopy.id.resume.printButton).toBe('Cetak / Simpan PDF')
  })

  it('provides backToProjects token in project detail copy for both languages', () => {
    expect(projectsCopy.en.detail.backToProjects).toBe('Back to projects')
    expect(projectsCopy.id.detail.backToProjects).toBe('Kembali ke project')
  })
})
