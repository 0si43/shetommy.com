import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'
import styles from '../styles/articles/post.module.css'

export default function linkCard(url: string, ogpData: OgObject) {
    const urls = ogpData.ogImage?.map(image => image.url).filter(url => url != null && url != undefined) ?? []
    const bestImageUrl = findBestImage(urls, url)
    return (
        <div className={styles.linkCard}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {bestImageUrl && (
                    <div className={styles.linkCardImage}>
                    <img src={bestImageUrl} alt={ogpData.ogTitle} />
                    </div>
                )}
                <div className={styles.linkCardContent}>
                    <h3 className={styles.linkCardTitle}>{ogpData.ogTitle}</h3>
                    <p className={styles.linkCardDescription}>{ogpData.ogDescription}</p>
                    {url}
                </div>
            </a>
        </div>
    )
}

// amazonが複数のOG画像を返してくるので、その対策
function findBestImage(originalUrls: string[], domain: string) {
    // ex: https://m.media-amazon.com/images/I/51tDCnOWe8L._SY445_SX342_.jpg
    if (domain.includes('amazon') || domain.includes('amzn')) {
        const urls = originalUrls.filter(url => {
            return url.includes('/I/') && url.includes('_SX') && url.includes('_SY')
        })
        return urls[0] || originalUrls[0]
    } else {
        return originalUrls[0]
    }
}
  