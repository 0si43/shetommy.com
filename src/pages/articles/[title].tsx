import Header from '../../components/Header'
import {
  getDatabase,
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

import { Fragment } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

export default function Post({ title, blocks, tableOfContentsBlocks, publishDate }: Props) {
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
            <Fragment key={block.id}>{renderBlock({ block: block, tableOfContents: tableOfContentsBlocks })}</Fragment>
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
      return {
        params: {
          title: title,
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
  title: string
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { title } = context.params as IParams
  const database = await getDatabase(databaseId)
  const page = database.find((page) => getPageTitle(page as NotionPage) == title)
  // NotionのDB上にあったタイトルをパスにしているので、存在は保証されている
  const id = page!.id
  const blocks = await getBlocks(id)
  saveImageIfNeeded(blocks)

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
    },
    revalidate: 1,
  }
}
