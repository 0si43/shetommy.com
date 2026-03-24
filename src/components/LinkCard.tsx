import type { SlimOgpData } from './Notion'
import styles from '../styles/articles/post.module.css'

export default function LinkCard(url: string, ogpData: SlimOgpData) {
    const imageUrl = findBestImage(ogpData.ogImageUrl, url)
    return (
        <div className={styles.linkCard}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {imageUrl && (
                    <div className={styles.linkCardImage}>
                    <img src={imageUrl} alt={ogpData.ogTitle} />
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
function findBestImage(imageUrl: string | undefined, domain: string) {
    if (!imageUrl) return undefined
    if (domain.includes('amazon') || domain.includes('amzn')) {
        if (imageUrl.includes('/I/') && imageUrl.includes('_SX') && imageUrl.includes('_SY')) {
            return imageUrl
        }
        return undefined
    }
    return imageUrl
}