import Header from '../../components/Header'
import {
  getDatabase,
  sanitizeForUrl,
  getPageTitle,
  getBlocks,
  isPublishDate,
  getPageDate,
  type NotionPage,
  ExtendNotionBlock
} from '../../components/Notion'
import { renderBlock } from '../../components/utils/renderNotionBlock'
import getOgpData from '../../components/utils/getOgpData'
import saveImageIfNeeded from '../../components/utils/saveImageIfNeeded'
import { databaseId } from './index'
import styles from '../../styles/articles/post.module.css'
import Footer from '../../components/Footer'

import { Fragment, useState } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Lightbox from '../../components/Lightbox'

export default function Post({ title, blocks, tableOfContentsBlocks, publishDate, imageSizeMap }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  return (
    <div>
      <Header titlePre={title} />
      <article className={styles.container}>
        <h1 className={styles.name}>{title}</h1>
        <time className={styles.date} dateTime={publishDate}>
          {new Date(publishDate).toLocaleDateString()}
        </time>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock({ block: block, tableOfContents: tableOfContentsBlocks, imageSizeMap: imageSizeMap, onImageClick: (src, alt) => setLightbox({ src, alt }) })}</Fragment>
          ))}
        </section>
      </article>
      <Footer />
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}

export const getStaticPaths = async () => {
  const pages = await getDatabase(databaseId)

  const paths = pages
    .filter(
      (page) => 'properties' in page && isPublishDate(page) && getPageTitle(page) !== ''
    )
    .map((page) => {
      const title = getPageTitle(page as NotionPage)
      const slug = sanitizeForUrl(title)
      return {
        params: {
          slug: slug,
        },
      }
    })

  return {
    paths: paths,
    fallback: false,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>
interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { slug } = context.params as IParams
  const database = await getDatabase(databaseId)
  const page = database.find((page) => {
    const title = getPageTitle(page as NotionPage)
    const sanitizeTitle = sanitizeForUrl(title)
    return sanitizeTitle == slug
  })
  const id = page!.id
  const title = getPageTitle(page as NotionPage)
  const blocks = await getBlocks(id)
  const imageSizeMap = await saveImageIfNeeded(blocks)

  const publishDate = getPageDate(page as NotionPage).toISOString()
  const blocksWithOGP: ExtendNotionBlock[] = []
  const tableOfContentsBlocks: ExtendNotionBlock[] = []
  
  await Promise.all(
    blocks.map(async (block, index) => {
      /// 目次用のブロックを抽出
      if (['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
        tableOfContentsBlocks.push(block)
      }
      
      /// OG情報を取得する
      if (block.type === 'paragraph' 
          && block.paragraph.text.length == 1
          && block.paragraph.text[0].type === 'text'
          && block.paragraph.text[0].text.link?.url
          ) {
          const richText = block.paragraph.text[0] as { type: 'text'; text: { link: { url: string } } }
          block.ogpData = await getOgpData(richText.text.link.url)
      } else if (block.type === 'bookmark') {
        block.ogpData = await getOgpData(block.bookmark.url)
      } else if (block.type === 'link_preview') {
        block.ogpData = await getOgpData(block.link_preview.url)
      }
  
      blocksWithOGP[index] = block
    })
  )

  return {
    props: {
      title,
      blocks: blocksWithOGP,
      tableOfContentsBlocks: tableOfContentsBlocks,
      publishDate,
      imageSizeMap,
    },
    revalidate: 1,
  }
}
