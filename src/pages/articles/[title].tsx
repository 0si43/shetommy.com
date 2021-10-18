import Header from '../../components/header'
import { Fragment } from 'react'
import { getDatabase, getPage, getBlocks } from '../../components/notion'
import { databaseId } from './index'
import styles from '../../styles/articles/post.module.css'
import Footer from '../../components/footer'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import type {
  Block,
  TitlePropertyValue,
  RichText,
  RichTextText,
} from '@notionhq/client/build/src/api-types'

export const Text = ({ text }) => {
  if (!text) {
    return null
  }
  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value
    return (
      <span
        className={[
          bold ? styles.bold : '',
          code ? styles.code : '',
          italic ? styles.italic : '',
          strikethrough ? styles.strikethrough : '',
          underline ? styles.underline : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    )
  })
}

const renderBlock = (block) => {
  const { type, id } = block
  const value = block[type]

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text text={value.text} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <Text text={value.text} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <Text text={value.text} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <Text text={value.text} />
        </h3>
      )
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li>
          <Text text={value.text} />
        </li>
      )
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
            <Text text={value.text} />
          </label>
        </div>
      )
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={value.text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      )
    case 'child_page':
      return <p>{value.title}</p>
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`
  }
}

export default function Post({ page, blocks }: Props) {
  if (!page || !blocks) {
    return <div />
  }

  const titlePropery = page.properties.Name as TitlePropertyValue
  const titleRichText = titlePropery.title as RichTextText[]
  const title = titleRichText[0].plain_text

  return (
    <div>
      <Header titlePre={title} />
      <article className={styles.container}>
        <h1 className={styles.name}>
          <Text text={titleRichText} />
        </h1>
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
    const titlePropery = page.properties.Name as TitlePropertyValue
    const titleRichText = titlePropery.title as RichTextText[]
    const title = titleRichText[0].plain_text
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

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const pageTtile = context.params?.title
  const pages = await getDatabase(databaseId)
  const page = pages.find((page) => {
    const titlePropery = page.properties.Name as TitlePropertyValue
    const titleRichText = titlePropery.title as RichTextText[]
    const searchTitle = titleRichText[0].plain_text
    return searchTitle == pageTtile
  })

  if (!page) {
    return {
      props: {
        undefined,
        blocks: undefined,
      },
      revalidate: 1,
    }
  }

  const id = page.id
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
    if (block.has_children && !block[block.type].children) {
      block[block.type]['children'] = childBlocks.find(
        (x) => x.id === block.id
      )?.children
    }
    return block
  })

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  }
}
