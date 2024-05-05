import styles from '../styles/articles/post.module.css'
import type { NotionBlockWithChildren } from './notion'
import linkCard from './linkCard'
import { Fragment } from 'react'
import Image from 'next/image'


export type RichText = {
  type: 'text'
  text: {
    content: string
    link: {
      url: string
    } | null
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color:
      | 'default'
      | 'gray'
      | 'brown'
      | 'orange'
      | 'yellow'
      | 'green'
      | 'blue'
      | 'purple'
      | 'pink'
      | 'red'
      | 'gray_background'
      | 'brown_background'
      | 'orange_background'
      | 'yellow_background'
      | 'green_background'
      | 'blue_background'
      | 'purple_background'
      | 'pink_background'
      | 'red_background'
  }
  plain_text: string
  href: string | null
}

/// 子ブロックを含めたブロックをHTML要素にレンダリングする
export const renderBlock = (
  { block, tableOfContents }: {
    block: NotionBlockWithChildren,
    tableOfContents: NotionBlockWithChildren[]
  }
) => {
  if (block.ogpData?.requestUrl) {
    return linkCard(block.ogpData.requestUrl, block.ogpData)
  }

  const { type, id } = block
  switch (type) {
    case 'paragraph':
      return (
        <p>
          <TextComponent richTexts={block.paragraph.text as RichText[]} />
        </p>
      )
    case 'heading_1':
      return (
        <h1 id={block.id}>
          <TextComponent richTexts={block.heading_1.text as RichText[]} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2 id={block.id}>
          <TextComponent richTexts={block.heading_2.text as RichText[]} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3 id={block.id}>
          <TextComponent richTexts={block.heading_3.text as RichText[]} />
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li>
          <TextComponent
            richTexts={block.bulleted_list_item.text as RichText[]}
          />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <TextComponent
            richTexts={block.numbered_list_item.text as RichText[]}
          />
        </li>
      )
    case 'to_do':
      const toDoValue = block[type]
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={toDoValue.checked} />{' '}
            <TextComponent richTexts={toDoValue.text as RichText[]} />
          </label>
        </div>
      )
    case 'toggle':
      const blockValue = block[type]
      return (
        <details>
          <summary>
            <TextComponent richTexts={blockValue.text as RichText[]} />
          </summary>
          <>
            {block.children?.map((block) => (
              <Fragment key={block.id}>{renderBlock({ block: block, tableOfContents: tableOfContents })}</Fragment>
            ))}
          </>
        </details>
      )
    case 'child_page':
      const childPageValue = block[type]
      return <p>{childPageValue.title}</p>
    case 'image':
      const imageValue = block.image
      const caption =
        imageValue.caption?.length > 0 ? imageValue.caption[0].plain_text : ''
      if (imageValue.type === 'file') {
        return (
          <figure>
            <Image
              src={'/blogImages/' + block.id + '.png'}
              alt={caption}
              width={480}
              height={320}
            />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )
      } else {
        const src = imageValue.external.url
        return (
          <figure>
            <img src={src} alt={caption} />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )
      }
    case 'quote':
      const quoteValue = block.quote
      return (
        <blockquote>
          <TextComponent richTexts={quoteValue.text as RichText[]} />
        </blockquote>
      )
    // OGP情報が取れていたら来ない
    case 'bookmark':
      return (
        <p>
          {block.bookmark.url}
        </p>
      )
    // OGP情報が取れていたら来ない
    case 'link_preview':
      return (
        <p>
          {block.link_preview.url}
        </p>
      )
    case 'divider':
      return <hr></hr>
    case 'table_of_contents':
      return (<TableOfContentsComponent tableOfContents={tableOfContents}/>)
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`
  }
}

/// Notionの1ブロックのテキストをReactのコンポーネント要素として返す
const TextComponent = ({ richTexts }: { richTexts: RichText[] }) => {
  if (!richTexts) {
    return null
  }

  const elements = richTexts.map((value, index) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value
    return (
      <span
        key={index}
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

  return <>{elements}</>
}

const TableOfContentsComponent = ({ tableOfContents }: { tableOfContents: NotionBlockWithChildren[] }) => {
  if (tableOfContents.length === 0) {
    return null
  }

  const renderTableOfContents = (blocks: NotionBlockWithChildren[]) => {
    const groupedBlocks: NotionBlockWithChildren[][] = []
    const sameHeadingBlocks: NotionBlockWithChildren[] = []

    blocks.forEach((block, index) => {
      if (sameHeadingBlocks[sameHeadingBlocks.length - 1] &&
          block.type != sameHeadingBlocks[sameHeadingBlocks.length - 1].type) {
        groupedBlocks.push([...sameHeadingBlocks])
        sameHeadingBlocks.length = 0
      }
      
      sameHeadingBlocks.push(block)
      
      if (index == blocks.length - 1) {
        groupedBlocks.push([...sameHeadingBlocks])
      }  
    })
    
    return (
      <ol>
        {groupedBlocks.map((blocks) => {
          switch (blocks[0]?.type) {
            case 'heading_1':
              return (<>{blocks.flatMap((block) => renderBlock(block))}</>)
            case 'heading_2':
              return (<ol>{blocks.flatMap((block) => renderBlock(block))}</ol>)
            case 'heading_3':
              return (<ol><ol>{blocks.flatMap((block) => renderBlock(block))}</ol></ol>)
            default:
              return null
          }
        })}
      </ol>
    )
  }

  const renderBlock = (block: NotionBlockWithChildren) => {
      switch (block.type) {
        case 'heading_1':
          return (
            <li key={block.id}>
              <a href={`#${block.id}`}>{block.heading_1.text[0].plain_text}</a>
            </li>
          )
        case 'heading_2':
          return (
            <li key={block.id}>
              <a href={`#${block.id}`}>{block.heading_2.text[0].plain_text}</a>
            </li>
          )
        case 'heading_3':
          return (
            <li key={block.id}>
              <a href={`#${block.id}`}>{block.heading_3.text[0].plain_text}</a>
            </li>
          )
          
        default:
          return null
    }
  }

  return (
    <nav>
      <h1>目次</h1>
      {renderTableOfContents(tableOfContents)}
    </nav>
  )
}
