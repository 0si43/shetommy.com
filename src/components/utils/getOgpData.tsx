import openGraphScraper from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'

const cache = new Map<string, OgObject>()
let lastRequestTime = 0
const RATE_LIMIT_DELAY = 500

const getOgpData = async (url: string): Promise<OgObject> => {
  if (cache.has(url)) return cache.get(url)!

  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < RATE_LIMIT_DELAY) {
    await new Promise<void>((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY - elapsed))
  }
  lastRequestTime = Date.now()

  try {
    const { result } = await openGraphScraper({ url })

    if (!result.success) {
      throw new Error('Failed to fetch OGP data')
    }

    cache.set(url, result)
    return result
  } catch (error) {
    console.error('Error fetching OGP data:', error)
    return {} as OgObject
  }
}

export default getOgpData
