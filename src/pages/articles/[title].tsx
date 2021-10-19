import Header from '../../components/header'
import {
  getDatabase,
  getPageTitle,
  getPage,
  getBlocks,
} from '../../components/notion'
import { renderBlock } from '../../components/renderNotionBlock'
import { databaseId } from './index'
import styles from '../../styles/articles/post.module.css'
import Footer from '../../components/footer'

import { Fragment } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

export default function Post({ title, blocks }: Props) {
  return (
    <div>
      <Header titlePre={title} />
      <article className={styles.container}>
        <h1 className={styles.name}>{title}</h1>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </section>
      </article>
      <Footer />
    </div>
  )
}

export const getStaticPaths = async () => {
  const pages = await getDatabase(databaseId)

  const paths = pages.map((page) => {
    const title = getPageTitle(page.properties)
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
  const page = database.find((page) => getPageTitle(page.properties) == title)
  // NotionのDB上にあったタイトルをパスにしているので、存在は保証されている
  const id = page!.id
  const blocks = await getBlocks(id)

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        }
      })
  )

  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children) {
      block.children = childBlocks.find((x) => x.id === block.id)?.children
    }
    return block
  })

  return {
    props: {
      title,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  }
}
