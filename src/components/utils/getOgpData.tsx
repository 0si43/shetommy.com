import openGraphScraper from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'

const getOgpData = async (url: string): Promise<OgObject> => {
  if (!url) {
    return {} as OgObject
  }

  const options = { url, timeout: 10000 }

  try {
    const { result } = await openGraphScraper(options)

    if (!result.success) {
      console.error('[OGP] Failed to fetch OGP data for URL:', url)
      return {} as OgObject
    }

    return result
  } catch (error) {
    if (error instanceof Error) {
      console.error('[OGP] Error fetching OGP data for URL:', url, error.message)
    } else {
      console.error('[OGP] Unknown error fetching OGP data for URL:', url)
    }
    return {} as OgObject
  }
}

export default getOgpData
