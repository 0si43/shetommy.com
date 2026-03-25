import styles from '../../styles/articles/post.module.css'
import type { ExtendNotionBlock } from '../Notion'
import type { ImageSizeMap } from './saveImageIfNeeded'
import type { GetBlockResponse } from '@notionhq/client/build/src/api-endpoints'
import LinkCard, { AmazonCard } from '../LinkCard'
import { Fragment } from 'react'
import Image from 'next/image'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const notionLangMap: Record<string, string> = {
  'plain text': 'text',
  'c++': 'cpp',
  'c#': 'csharp',
  'f#': 'fsharp',
  'java/c/c++/c#': 'java',
  'objective-c': 'objectivec',
  'vb.net': 'vbnet',
  'visual basic': 'visual-basic',
  'shell': 'bash',
  'docker': 'docker',
  'webassembly': 'wasm',
}

const mapLanguage = (lang: string): string => notionLangMap[lang] ?? lang

// Notion SDK の型定義から RichText 型を導出する
// RichTextItemResponse は非公開型なので、公開型 GetBlockResponse 経由でアクセスする
type BlockObjectResponse = Extract<GetBlockResponse, { type: string }>
type ParagraphBlock = Extract<BlockObjectResponse, { type: 'paragraph' }>
type RichTextItemResponse = ParagraphBlock['paragraph']['text'][number]
export type RichText = Extract<RichTextItemResponse, { type: 'text' }>

const TEXT_BLOCK_TAGS = {
  paragraph: 'p',
  heading_1: 'h1',
  heading_2: 'h2',
  heading_3: 'h3',
} as const satisfies Record<string, keyof JSX.IntrinsicElements>

type TextBlockType = keyof typeof TEXT_BLOCK_TAGS

type ExtendParagraphBlock = Extract<ExtendNotionBlock, { type: 'paragraph' }>
type ExtendHeading1Block = Extract<ExtendNotionBlock, { type: 'heading_1' }>
type ExtendHeading2Block = Extract<ExtendNotionBlock, { type: 'heading_2' }>
type ExtendHeading3Block = Extract<ExtendNotionBlock, { type: 'heading_3' }>
type TextBlock = ExtendParagraphBlock | ExtendHeading1Block | ExtendHeading2Block | ExtendHeading3Block

const isTextBlock = (block: ExtendNotionBlock): block is TextBlock =>
  block.type in TEXT_BLOCK_TAGS

const getTextBlockContent = (block: TextBlock): RichText[] => {
  switch (block.type) {
    case 'paragraph': return block.paragraph.text as RichText[]
    case 'heading_1': return block.heading_1.text as RichText[]
    case 'heading_2': return block.heading_2.text as RichText[]
    case 'heading_3': return block.heading_3.text as RichText[]
  }
}

/// 子ブロックを含めたブロックをHTML要素にレンダリングする
export const renderBlock = (
  { block, tableOfContents, imageSizeMap, onImageClick }: {
    block: ExtendNotionBlock,
    tableOfContents: ExtendNotionBlock[],
    imageSizeMap: ImageSizeMap,
    onImageClick?: (src: string, alt: string) => void,
  }
) => {
  if (block.isAmazon && block.amazonUrl) {
    return AmazonCard(block.amazonUrl)
  }

  if (block.ogpData?.requestUrl) {
    return LinkCard(block.ogpData.requestUrl, block.ogpData)
  }

  const { type, id } = block

  if (isTextBlock(block)) {
    const Tag = TEXT_BLOCK_TAGS[block.type]
    const richTexts = getTextBlockContent(block)
    const headingId = block.type.startsWith('heading') ? block.id : undefined
    return (
      <Tag id={headingId}>
        <TextComponent richTexts={richTexts} />
      </Tag>
    )
  }

  switch (type) {
    case 'bulleted_list_item':
      return renderBulletedListItem(block)
    case 'numbered_list_item':
      return renderNumberedListItem(block)
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
              <Fragment key={block.id}>{renderBlock({ block: block, tableOfContents: tableOfContents, imageSizeMap: imageSizeMap, onImageClick: onImageClick })}</Fragment>
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
        const size = imageSizeMap[block.id] ?? { width: 480, height: 360, extension: 'png' }
        const src = `/blogImages/${block.id}.${size.extension}`
        return (
          <figure>
            <Image
              src={src}
              alt={caption}
              width={size.width}
              height={size.height}
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', cursor: onImageClick ? 'zoom-in' : undefined }}
              onClick={onImageClick ? () => onImageClick(src, caption) : undefined}
            />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )
      } else {
        const src = imageValue.external.url
        return (
          <figure>
            <img
              src={src}
              alt={caption}
              style={{ cursor: onImageClick ? 'zoom-in' : undefined }}
              onClick={onImageClick ? () => onImageClick(src, caption) : undefined}
            />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )
      }
    case 'quote':
      const quoteValue = block.quote
      return (
        <blockquote>
          <TextComponent richTexts={quoteValue.text as RichText[]} />
          <>
            {block.children?.map((childBlock) => (
              <Fragment key={childBlock.id}>
                {renderBlock({ block: childBlock, tableOfContents: tableOfContents, imageSizeMap: imageSizeMap, onImageClick: onImageClick })}
              </Fragment>
            ))}
          </>
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
    case 'code': {
      const codeValue = block.code
      const rawLang = codeValue.language ?? 'plain text'
      const language = mapLanguage(rawLang)
      const codeText = (codeValue.text as RichText[]).map((t) => t.text.content).join('')
      return (
        <SyntaxHighlighter language={language} style={vscDarkPlus}>
          {codeText}
        </SyntaxHighlighter>
      )
    }
    case 'video': {
      const videoValue = block.video
      if (videoValue.type === 'file') {
        return (
          <video controls style={{ width: '100%' }}>
            <source src={videoValue.file.url} />
          </video>
        )
      }
      const videoUrl = videoValue.external.url
      const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
      if (isYoutube) {
        const videoId = videoUrl.includes('youtube.com')
          ? videoUrl.split('v=')[1]?.split('&')[0]
          : videoUrl.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) {
          return (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )
        }
      }
      return (
        <video controls style={{ width: '100%' }}>
          <source src={videoUrl} />
        </video>
      )
    }
    case 'audio': {
      const audioValue = block.audio
      const url = audioValue.type === 'external' ? audioValue.external.url : audioValue.file.url
      return <audio controls src={url} style={{ width: '100%' }} />
    }
    case 'file': {
      const fileValue = block.file
      const url = fileValue.type === 'external' ? fileValue.external.url : fileValue.file.url
      const caption = (fileValue.caption as RichText[])?.[0]?.plain_text ?? url
      return <a href={url} target="_blank" rel="noopener noreferrer">{caption}</a>
    }
    case 'pdf': {
      const pdfValue = block.pdf
      const url = pdfValue.type === 'external' ? pdfValue.external.url : pdfValue.file.url
      return <iframe src={url} width="100%" height="600px" />
    }
    case 'table':
      return <TableComponent block={block} />
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

const BulletedListItem: React.FC<{ block: ExtendNotionBlock }> = ({ block }) => {
  if (block.type !== 'bulleted_list_item') {
    return null;
  }

  return (
    <li>
      <TextComponent richTexts={block.bulleted_list_item.text as RichText[]} />
      {block.has_children && block.children && (
        <ul>
          {block.children.map(childBlock => (
            <BulletedListItem key={childBlock.id} block={childBlock} />
          ))}
        </ul>
      )}
    </li>
  );
};

const renderBulletedListItem = (block: ExtendNotionBlock) => {
  if (block.type !== 'bulleted_list_item') {
    return null
  }

  return (
    <ul>
      <BulletedListItem block={block} />
    </ul>
  )
}

const NumberedListItem: React.FC<{ block: ExtendNotionBlock }> = ({ block }) => {
  if (block.type !== 'numbered_list_item') {
    return null;
  }

  return (
    <li>
      <TextComponent richTexts={block.numbered_list_item.text as RichText[]} />
      {block.has_children && block.children && (
        <ol>
          {block.children.map(childBlock => (
            <NumberedListItem key={childBlock.id} block={childBlock} />
          ))}
        </ol>
      )}
    </li>
  );
};

const renderNumberedListItem = (block: ExtendNotionBlock) => {
  if (block.type !== 'numbered_list_item' || !block.numberedListBlocks) {
    return null
  }

  return (
    <ol>
      {block.numberedListBlocks.map(block =>
        <NumberedListItem key={block.id} block={block} />
      )}
    </ol>
  )
}

const TableComponent: React.FC<{ block: ExtendNotionBlock }> = ({ block }) => {
  if (block.type !== 'table') return null

  const { has_column_header, has_row_header } = block.table
  const rows = block.children ?? []
  const headerRow = has_column_header ? rows[0] : null
  const bodyRows = has_column_header ? rows.slice(1) : rows

  const renderCell = (cell: RichText[], isHeader: boolean, scope?: 'col' | 'row', key?: number) => {
    const Tag = isHeader ? 'th' : 'td'
    return (
      <Tag key={key} className={isHeader ? styles.tableHeader : styles.tableCell} scope={scope}>
        <TextComponent richTexts={cell} />
      </Tag>
    )
  }

  const renderRow = (rowBlock: ExtendNotionBlock, isHeaderRow: boolean) => {
    if (rowBlock.type !== 'table_row') return null
    const cells = rowBlock.table_row.cells as RichText[][]
    return (
      <tr key={rowBlock.id}>
        {cells.map((cell, colIndex) => {
          if (isHeaderRow) return renderCell(cell, true, 'col', colIndex)
          if (has_row_header && colIndex === 0) return renderCell(cell, true, 'row', colIndex)
          return renderCell(cell, false, undefined, colIndex)
        })}
      </tr>
    )
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        {headerRow && <thead>{renderRow(headerRow, true)}</thead>}
        <tbody>{bodyRows.map((row) => renderRow(row, false))}</tbody>
      </table>
    </div>
  )
}

const TableOfContentsComponent = ({ tableOfContents }: { tableOfContents: ExtendNotionBlock[] }) => {
  if (tableOfContents.length === 0) {
    return null
  }

  const renderTableOfContents = (blocks: ExtendNotionBlock[]) => {
    const groupedBlocks: ExtendNotionBlock[][] = []
    const sameHeadingBlocks: ExtendNotionBlock[] = []

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
              return blocks.flatMap((block) => renderBlock(block))
            case 'heading_2':
              return (<ol key={blocks[0]?.id}>{blocks.flatMap((block) => renderBlock(block))}</ol>)
            case 'heading_3':
              return (<ol key={blocks[0]?.id}><ol>{blocks.flatMap((block) => renderBlock(block))}</ol></ol>)
            default:
              return null
          }
        })}
      </ol>
    )
  }

  const renderBlock = (block: ExtendNotionBlock) => {
      switch (block.type) {
        case 'heading_1':
          return (
            <li key={block.id}>
              <a href={`#${block.id}`}>{block.heading_1?.text[0]?.plain_text ?? ""}</a>
            </li>
          )
        case 'heading_2':
          return (
            <li key={block.id}>
              <a href={`#${block.id}`}>{block.heading_2?.text[0]?.plain_text ?? ""}</a>
            </li>
          )
        case 'heading_3':
          return (
            <li key={block.id}>
              <a href={`#${block.id}`}>{block.heading_3?.text[0]?.plain_text ?? ""}</a>
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