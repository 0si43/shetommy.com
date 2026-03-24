import openGraphScraper from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'

const getOgpData = async (url: string): Promise<OgObject> => {
  try {
    const { result } = await openGraphScraper({ url })

    if (!result.success) {
      return await fetchTitleFallback(url)
    }

    return result
  } catch (error) {
    console.error('Error fetching OGP data:', error)
    return await fetchTitleFallback(url)
  }
}

const fetchTitleFallback = async (url: string): Promise<OgObject> => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const html = await res.text()
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = match?.[1]?.trim() ?? null
    return (title ? { ogTitle: title, requestUrl: url } : { requestUrl: url }) as OgObject
  } catch {
    return { requestUrl: url } as OgObject
  }
}

export default getOgpData
