import openGraphScraper, {
    OpenGraphImage,
    OpenGraphProperties,
  } from 'open-graph-scraper';
  
  export type OgpData = OpenGraphProperties & {
    ogImage?: OpenGraphImage | OpenGraphImage[] | undefined;
  };
  
  const getOgpData = async (floatingUrls: string[]): Promise<OgpData[]> => {
    const ogpDatas: OgpData[] = [];
    if (floatingUrls.length === 0) return ogpDatas;
  
    await Promise.all(
      floatingUrls.map(async (url) => {
        const options = { url, onlyGetOpenGraphInfo: true };
        return openGraphScraper(options)
          .then((data) => {
            // OGP によるデータ取得が失敗した場合
            if (!data.result.success) {
              return;
            }
            // OGP によるデータ取得が成功した場合
            ogpDatas.push(data.result);
          })
          .catch((error) => {
            // error を throw するとビルドできないため、コンソールに出力して return する
            // eslint-disable-next-line no-console
            console.log(error);
          });
      })
    );
  
    return ogpDatas;
  };
  
  export default getOgpData;