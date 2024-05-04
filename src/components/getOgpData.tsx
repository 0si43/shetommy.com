import openGraphScraper from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'

const getOgpData = async (url: string): Promise<OgObject> => {
  const options = { url, onlyGetOpenGraphInfo: true }

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

export default getOgpData;