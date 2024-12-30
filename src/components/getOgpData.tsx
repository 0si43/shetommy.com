import openGraphScraper from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'

const getOgpData = async (url: string): Promise<OgObject> => {
  const options = { url }

  try {
    const { result } = await openGraphScraper(options)
    console.log(JSON.stringify(result, null, 2))

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