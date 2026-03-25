import openGraphScraper from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const getOgpData = async (url: string): Promise<OgObject> => {
  if (!isValidUrl(url)) {
    console.error('[OGP] Invalid or disallowed URL:', url)
    return {} as OgObject
  }

  const options = { url }

  try {
    const { result } = await openGraphScraper(options)

    if (!result.success) {
      throw new Error('Failed to fetch OGP data')
    }

    return result
  } catch (error) {
    console.error('Error fetching OGP data:', error)
    return {} as OgObject
  }
}

export default getOgpData
