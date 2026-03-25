import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { OgObject } from 'open-graph-scraper/dist/lib/types.d'
import type { IncomingMessage } from 'http'

// open-graph-scraperのモック
vi.mock('open-graph-scraper', () => ({
  default: vi.fn(),
}))

import openGraphScraper from 'open-graph-scraper'
import getOgpData from '../components/utils/getOgpData'

// scraper の戻り値の型に合わせたモック用ヘルパー
const mockScraperResult = (result: Partial<OgObject>) =>
  ({ result, error: false, response: {} as IncomingMessage, html: '' }) as Awaited<ReturnType<typeof openGraphScraper>>

describe('getOgpData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常なURLのOGPデータを返す', async () => {
    const mockResult: Partial<OgObject> = {
      success: true,
      requestUrl: 'https://example.com',
      ogTitle: 'Example',
    }
    vi.mocked(openGraphScraper).mockResolvedValue(mockScraperResult(mockResult))

    const result = await getOgpData('https://example.com')
    expect(result).toEqual(mockResult)
  })

  it('success=falseの場合は空オブジェクトを返す', async () => {
    vi.mocked(openGraphScraper).mockResolvedValue(mockScraperResult({ success: false }))

    const result = await getOgpData('https://example.com')
    expect(result).toEqual({})
  })

  it('例外が発生した場合は空オブジェクトを返す', async () => {
    vi.mocked(openGraphScraper).mockRejectedValue(new Error('Network error'))

    const result = await getOgpData('https://example.com')
    expect(result).toEqual({})
  })
})
