import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '#/lib/api-client'
import { socialQueryKeys, socialQueryOptions } from '../query-options'

vi.mock('#/lib/api-client', () => ({
  api: vi.fn(),
}))

const runQuery = async <T>(queryFn: unknown): Promise<T> => {
  if (typeof queryFn !== 'function') {
    throw new Error('queryFn is not a function')
  }
  return (queryFn as (ctx: unknown) => Promise<T>)({})
}

describe('socialQueryKeys', () => {
  it('generates consistent hierarchical query keys', () => {
    expect(socialQueryKeys.all).toEqual(['social-links'])
    expect(socialQueryKeys.lists()).toEqual(['social-links', 'list'])
    expect(socialQueryKeys.list()).toEqual(['social-links', 'list'])
    expect(socialQueryKeys.public()).toEqual(['social-links', 'public'])
    expect(socialQueryKeys.detail('social-123')).toEqual([
      'social-links',
      'detail',
      'social-123',
    ])
  })
})

describe('socialQueryOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('list() fetches all social links from /api/social', async () => {
    const mockLinks = [
      {
        id: '1',
        platform: 'github' as const,
        username: 'user',
        accountName: 'User',
        url: 'https://github.com/user',
        isEnabled: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(api).mockResolvedValueOnce({ data: mockLinks })

    const options = socialQueryOptions.list()
    expect(options.queryKey).toEqual(['social-links', 'list'])
    expect(options.queryFn).toBeDefined()

    const result = await runQuery(options.queryFn)
    expect(api).toHaveBeenCalledWith('/api/social')
    expect(result).toEqual(mockLinks)
  })

  it('list() returns empty array when data is undefined', async () => {
    vi.mocked(api).mockResolvedValueOnce({})

    const options = socialQueryOptions.list()
    const result = await runQuery(options.queryFn)
    expect(result).toEqual([])
  })

  it('publicList() passes publicOnly=true query parameter to /api/social', async () => {
    const mockPublicLinks = [
      {
        id: '1',
        platform: 'github' as const,
        username: 'user',
        accountName: 'User',
        url: 'https://github.com/user',
        isEnabled: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(api).mockResolvedValueOnce({ data: mockPublicLinks })

    const options = socialQueryOptions.publicList()
    expect(options.queryKey).toEqual(['social-links', 'public'])

    const result = await runQuery(options.queryFn)
    expect(api).toHaveBeenCalledWith('/api/social', {
      query: { publicOnly: 'true' },
    })
    expect(result).toEqual(mockPublicLinks)
  })

  it('detail() fetches individual link from /api/social/:id', async () => {
    const mockLink = {
      id: 'social-github-1',
      platform: 'github' as const,
      username: 'user',
      accountName: 'User',
      url: 'https://github.com/user',
      isEnabled: true,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(api).mockResolvedValueOnce({ data: mockLink })

    const options = socialQueryOptions.detail('social-github-1')
    expect(options.queryKey).toEqual([
      'social-links',
      'detail',
      'social-github-1',
    ])

    const result = await runQuery(options.queryFn)
    expect(api).toHaveBeenCalledWith('/api/social/social-github-1')
    expect(result).toEqual(mockLink)
  })

  it('detail() throws error when record is not found', async () => {
    vi.mocked(api).mockResolvedValueOnce({ data: null })

    const options = socialQueryOptions.detail('non-existent')
    await expect(runQuery(options.queryFn)).rejects.toThrow(
      'Social link not found.',
    )
  })
})
