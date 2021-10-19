import styles from '../styles/articles/post.module.css'

import { Fragment } from 'react'

export const renderBlock = (block) => {
  const { type, id } = block

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <TextComponent richTexts={block.paragraph.text as RichTextText[]} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <TextComponent richTexts={block.heading_1.text as RichTextText[]} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <TextComponent richTexts={block.heading_2.text as RichTextText[]} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <TextComponent richTexts={block.heading_3.text as RichTextText[]} />
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li>
          <TextComponent
            richTexts={block.bulleted_list_item.text as RichTextText[]}
          />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <TextComponent
            richTexts={block.numbered_list_item.text as RichTextText[]}
          />
        </li>
      )
    case 'to_do':
      const toDoValue = block[type]
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={toDoValue.checked} />{' '}
            <TextComponent richTexts={toDoValue.text as RichTextText[]} />
          </label>
        </div>
      )
    case 'toggle':
      const blockValue = block[type]
      return (
        <details>
          <summary>
            <TextComponent richTexts={blockValue.text as RichTextText[]} />
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

const TextComponent = ({ richTexts }: { richTexts: RichTextText[] }) => {
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
