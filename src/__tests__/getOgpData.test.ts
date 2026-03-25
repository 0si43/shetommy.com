import { describe, it, expect, vi, beforeEach } from 'vitest'

// open-graph-scraperのモック
vi.mock('open-graph-scraper', () => ({
  default: vi.fn(),
}))

import openGraphScraper from 'open-graph-scraper'
import getOgpData from '../components/utils/getOgpData'

describe('getOgpData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常なURLのOGPデータを返す', async () => {
    const mockResult = {
      success: true,
      requestUrl: 'https://example.com',
      ogTitle: 'Example',
    }
    vi.mocked(openGraphScraper).mockResolvedValue({ result: mockResult } as any)

    const result = await getOgpData('https://example.com')
    expect(result).toEqual(mockResult)
  })

  it('success=falseの場合は空オブジェクトを返す', async () => {
    vi.mocked(openGraphScraper).mockResolvedValue({ result: { success: false } } as any)

    const result = await getOgpData('https://example.com')
    expect(result).toEqual({})
  })

  it('例外が発生した場合は空オブジェクトを返す', async () => {
    vi.mocked(openGraphScraper).mockRejectedValue(new Error('Network error'))

    const result = await getOgpData('https://example.com')
    expect(result).toEqual({})
  })
})
