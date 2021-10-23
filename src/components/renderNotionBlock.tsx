import styles from '../styles/articles/post.module.css'
import type { blockWithChildren } from './notion'
import { Fragment } from 'react'
import Image from 'next/image'

type richText = {
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
export const renderBlock = (block: blockWithChildren) => {
  const { type, id } = block

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <TextComponent richTexts={block.paragraph.text as richText[]} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <TextComponent richTexts={block.heading_1.text as richText[]} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <TextComponent richTexts={block.heading_2.text as richText[]} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <TextComponent richTexts={block.heading_3.text as richText[]} />
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li>
          <TextComponent
            richTexts={block.bulleted_list_item.text as richText[]}
          />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <TextComponent
            richTexts={block.numbered_list_item.text as richText[]}
          />
        </li>
      )
    case 'to_do':
      const toDoValue = block[type]
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={toDoValue.checked} />{' '}
            <TextComponent richTexts={toDoValue.text as richText[]} />
          </label>
        </div>
      )
    case 'toggle':
      const blockValue = block[type]
      return (
        <details>
          <summary>
            <TextComponent richTexts={blockValue.text as richText[]} />
          </summary>
          <>
            {block.children?.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
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
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`
  }
}

/// Notionの1ブロックのテキストをReactのコンポーネント要素として返す
const TextComponent = ({ richTexts }: { richTexts: richText[] }) => {
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
