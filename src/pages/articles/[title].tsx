import Header from '../../components/header'
import {
  getDatabase,
  getPageTitle,
  getBlocks,
  isPublishDate,
} from '../../components/notion'
import { renderBlock } from '../../components/renderNotionBlock'
import { databaseId } from './index'
import styles from '../../styles/articles/post.module.css'
import Footer from '../../components/footer'

import { Fragment } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import fs from 'fs'

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

  const paths = pages
    .filter(
      (page) => isPublishDate(page) && getPageTitle(page.properties) !== ''
    )
    .map((page) => {
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

  /// ブロックに子ブロックがあった場合に全て付与する
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children) {
      block.children = childBlocks.find((x) => x.id === block.id)?.children
    }
    return block
  })

  const path = 'public/blogImages'

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  fs.writeFile(
    'public/blogImages/output.txt',
    'テキストファイルの中身2',
    (err) => {
      // 書き出しに失敗した場合
      if (err) {
        console.log('エラーが発生しました。' + err)
        throw err
      }
      // 書き出しに成功した場合
      else {
        console.log('ファイルが正常に書き出しされました')
      }
    }
  )

  return {
    props: {
      title,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  }
}
