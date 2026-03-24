import Header from '../../components/Header'
import {
  getDatabase,
  sanitizeForUrl,
  getPageTitle,
  getBlocks,
  isPublishDate,
  getPageDate,
  type NotionPage,
  ExtendNotionBlock,
  TocEntry,
  SlimOgpData
} from '../../components/Notion'
import { renderBlock } from '../../components/utils/renderNotionBlock'
import getOgpData from '../../components/utils/getOgpData'
import saveImageIfNeeded from '../../components/utils/saveImageIfNeeded'
import { databaseId } from './index'
import styles from '../../styles/articles/post.module.css'
import Footer from '../../components/Footer'

import { Fragment } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

export default function Post({ title, blocks, tableOfContentsBlocks, publishDate, imageSizeMap }: Props) {
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
            <Fragment key={block.id}>{renderBlock({ block: block, tableOfContents: tableOfContentsBlocks, imageSizeMap: imageSizeMap })}</Fragment>
          ))}
        </section>
      </article>
      <Footer />
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
  const tableOfContentsBlocks: TocEntry[] = []

  await Promise.all(
    blocks.map(async (block, index) => {
      /// 目次用のブロックを抽出
      if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
        const headingKey = block.type as 'heading_1' | 'heading_2' | 'heading_3'
        tableOfContentsBlocks.push({
          id: block.id,
          type: headingKey,
          text: (block as any)[headingKey]?.text[0]?.plain_text ?? '',
        })
      }
      
      /// OG情報を取得する
      const toSlimOgp = async (url: string): Promise<SlimOgpData> => {
        const ogp = await getOgpData(url)
        const slim: SlimOgpData = {}
        if (ogp.ogTitle != null) slim.ogTitle = ogp.ogTitle
        if (ogp.ogDescription != null) slim.ogDescription = ogp.ogDescription
        if (ogp.ogImage?.[0]?.url != null) slim.ogImageUrl = ogp.ogImage[0].url
        if (ogp.ogUrl != null) slim.ogUrl = ogp.ogUrl
        return slim
      }
      if (block.type === 'paragraph'
          && block.paragraph.text.length == 1
          && block.paragraph.text[0].type === 'text'
          && block.paragraph.text[0].text.link?.url
          ) {
          const richText = block.paragraph.text[0] as { type: 'text'; text: { link: { url: string } } }
          block.ogpData = await toSlimOgp(richText.text.link.url)
      } else if (block.type === 'bookmark') {
        block.ogpData = await toSlimOgp(block.bookmark.url)
      } else if (block.type === 'link_preview') {
        block.ogpData = await toSlimOgp(block.link_preview.url)
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
