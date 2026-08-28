import { describe, expect, it } from 'vitest'

import { socialLinkSchema } from './types'

describe('socialLinkSchema', () => {
  it('validates a valid social link payload', () => {
    const result = socialLinkSchema.safeParse({
      platform: 'github',
      username: 'winterestingwithyou',
      accountName: 'Winterest',
      url: 'https://github.com/winterestingwithyou',
      isEnabled: true,
      sortOrder: 0,
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid url format', () => {
    const result = socialLinkSchema.safeParse({
      platform: 'github',
      username: 'winterestingwithyou',
      accountName: 'Winterest',
      url: 'not-a-valid-url',
      isEnabled: true,
      sortOrder: 0,
    })

    expect(result.success).toBe(false)
  })

  it('rejects an invalid platform', () => {
    const result = socialLinkSchema.safeParse({
      platform: 'myspace',
      username: 'user',
      accountName: 'User',
      url: 'https://myspace.com/user',
      isEnabled: true,
      sortOrder: 0,
    })

    expect(result.success).toBe(false)
  })

  it('allows all supported platforms in the enum', () => {
    const platforms = [
      'github',
      'linkedin',
      'x',
      'instagram',
      'facebook',
      'tiktok',
      'youtube',
      'discord',
      'telegram',
    ] as const

    for (const platform of platforms) {
      const result = socialLinkSchema.safeParse({
        platform,
        username: 'test',
        accountName: 'Test Account',
        url: `https://${platform}.com/test`,
        isEnabled: true,
        sortOrder: 1,
      })

      expect(result.success).toBe(true)
    }
  })
})
