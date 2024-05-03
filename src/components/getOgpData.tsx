import openGraphScraper, {
  OpenGraphImage,
  OpenGraphProperties,
} from 'open-graph-scraper'

export type OgpData = OpenGraphProperties & {
  ogImage?: OpenGraphImage | OpenGraphImage[] | undefined;
};

const getOgpData = async (url: string): Promise<OgpData> => {
  const options = { url, onlyGetOpenGraphInfo: true }

  try {
    const { result } = await openGraphScraper(options)

    if (!result.success) {
      throw new Error('Failed to fetch OGP data')
    }

    return result
  } catch (error) {
    console.error('Error fetching OGP data:', error)
    return {} as OgpData
  }
}

export default getOgpData;