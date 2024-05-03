import type { OgpData } from './getOgpData'
import styles from '../styles/articles/post.module.css'

export default function linkCard(url: string, ogpData: OgpData) {
    return (
        <div className={styles.linkCard}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {ogpData.ogImage && (
                    <div className={styles.linkCardImage}>
                    <img src={ogpData.ogImage[0].url} alt={ogpData.ogTitle} />
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
