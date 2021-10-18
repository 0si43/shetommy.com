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
  RichTextText,
} from '@notionhq/client/build/src/api-types'

export const TextComponent = ({ richTexts }: { richTexts: RichTextText[] }) => {
  if (!richTexts) {
    return null
  }

  const elements = richTexts.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value
    return (
      <>
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
          {text.link ? (
            <a href={text.link.url}>{text.content}</a>
          ) : (
            text.content
          )}
        </span>
      </>
    )
  })

  return <>{elements}</>
}

const renderBlock = (block: Block) => {
  const { type, id } = block
  const texts = block[type].text as RichTextText[]

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <TextComponent richTexts={texts} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <TextComponent richTexts={texts} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <TextComponent richTexts={texts} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <TextComponent richTexts={texts} />
        </h3>
      )
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li>
          <TextComponent richTexts={texts} />
        </li>
      )
    case 'to_do':
      const toDoValue = block[type]
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={toDoValue.checked} />{' '}
            <TextComponent richTexts={texts} />
          </label>
        </div>
      )
    case 'toggle':
      const blockValue = block[type]
      return (
        <details>
          <summary>
            <TextComponent richTexts={texts} />
          </summary>
          <>
            {blockValue.children?.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </>
        </details>
      )
    case 'child_page':
      const childPageValue = block[type]
      return <p>{childPageValue.title}</p>
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
          <TextComponent richTexts={titleRichText} />
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
