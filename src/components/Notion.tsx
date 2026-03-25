import { Client, isNotionClientError } from '@notionhq/client'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'
import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

const Notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export declare type NotionPage = Extract<QueryDatabaseResponse['results'][number], { properties: Record<string, any> }>
type NotionBlock = Extract<ListBlockChildrenResponse['results'][number], { type: string }>
export type ExtendNotionBlock = NotionBlock & {
  // 番号付きリストの1階層目要素
  numberedListBlocks?: ExtendNotionBlock[],
  children?: ExtendNotionBlock[],
  ogpData?: OgObject,
  isAmazon?: boolean,
  amazonUrl?: string,
}

export type PaginatedDatabaseResponse = {
  results: NotionPage[]
  hasMore: boolean
  nextCursor: string | null
}

/// Blog記事のデータベースを取得する
export const getDatabase = async (databaseId: string) => {
  try {
    const response = await Notion.databases.query({
      database_id: databaseId,
    })
    return response.results
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      console.log(error.message)
    }
    return []
  }
}

/// ページング対応でBlog記事のデータベースを取得する
export const getDatabaseWithPagination = async (databaseId: string, startCursor?: string, pageSize: number = 100): Promise<PaginatedDatabaseResponse> => {
  try {
    const response = await Notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: pageSize,
      sorts: [
        {
          property: 'publish date',
          direction: 'descending',
        },
      ],
    })
    return {
      results: response.results as NotionPage[],
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      console.log(error.message)
    }
    return {
      results: [],
      hasMore: false,
      nextCursor: null,
    }
  }
}

/// publish dateが設定されていないページをfilterする
export const filterPages = (pages: NotionPage[]) => {
  return pages.filter((page) => page.properties['publish date'] !== null)
}

export const sanitizeForUrl = (title: string): string => {
  return title.replace(/[?#/&%]/g, '')
};

export const getPageTitle = (page: NotionPage) => {
  if (page.properties == undefined) {
    return ''
  }

  if (page.properties.Name.type === 'title' && page.properties.Name.title[0]) {
    return page.properties.Name.title[0].plain_text
  }
  return ''
}

/// 「publish date」で指定された日時を返す。存在しない場合はページの作成日時を返す
export const getPageDate = (page: NotionPage) => {
  let dateString = page.last_edited_time
  if (
    page.properties['publish date'].type == 'date' &&
    page.properties['publish date'].date !== null
  ) {
    dateString = page.properties['publish date'].date.start
  }
  return new Date(dateString)
}

/// 「publish date」が存在するかどうかを返す
export const isPublishDate = (page: NotionPage) => {
  if (
    page.properties['publish date'].type == 'date' &&
    page.properties['publish date'].date !== null
  ) {
    return true
  }
  return false
}

export const getPage = async (pageId: string) => {
  const response = await Notion.pages.retrieve({ page_id: pageId })
  return response
}

/// 冒頭140字を返す。存在しなかったらnullを返す
export const getOpeningSentence = async (blockId: string) => {
  let openingSentence = ''
  let cursor: undefined | string = undefined

  while (true) {
    const block = await Notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
      page_size: 10,
    })

    for (const result of block.results) {
      if ('type' in result && result.type === 'paragraph') {
        result.paragraph.text.forEach((textObject) => {
          openingSentence += textObject.plain_text
        })
      }
      if (openingSentence.length >= 140) break
    }

    const next_cursor = block.next_cursor as string | null
    if (openingSentence.length >= 140 || !next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return openingSentence.substring(0, 140)
}

/// 指定されたページ（ここではブロックID = ページID）のブロックをすべて返す
export const getBlocks = async (blockId: string) => {
  const blocks: ExtendNotionBlock[] = []
  let cursor: undefined | string = undefined

  while (true) {
    const blocksList = await Notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })
    const extendNotionBlock = await Promise.all(
      blocksList.results.filter(
        (block): block is ExtendNotionBlock => {
          return 'type' in block
        }
      )
      .map(
        (block) => {
          return appendChildren(block)
        }
      )
    )

    blocks.push(...extendNotionBlock)

    const next_cursor = blocksList.next_cursor as string | null
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  // 番号付きリストの順序性を保つためにリスト1ブロック目に全てのブロックを保持させる
  var numberedListItems: ExtendNotionBlock[] = []
  blocks.forEach((block, index) => {
    if (block.type == 'numbered_list_item') {
      numberedListItems.push(block)
      if (blocks[index + 1]?.type != 'numbered_list_item') {
        blocks[index - numberedListItems.length + 1] = {
          ...blocks[index - numberedListItems.length + 1],
          numberedListBlocks: numberedListItems
        }
        numberedListItems = []
      }
    }
  })

  return blocks
}

/// 公開済み・タイトルありの記事のみに絞り込み、新しい順にソートする
export const filterAndSortPages = (
  results: QueryDatabaseResponse['results']
): NotionPage[] => {
  return results
    .filter((page): page is NotionPage =>
      'properties' in page && isPublishDate(page as NotionPage) && getPageTitle(page as NotionPage) !== ''
    )
    .sort((page, page2) => getPageDate(page2).getTime() - getPageDate(page).getTime())
}

/// 記事データをUI用の形式に整形する
export const formatArticle = (page: NotionPage, openingSentence: string) => ({
  id: page.id,
  title: getPageTitle(page),
  date: getPageDate(page).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }),
  openingSentence,
})

/// ブロックに子ブロックがあれば付与する（リストブロック・トグルブロック）
const appendChildren = async (block: ExtendNotionBlock): Promise<ExtendNotionBlock> => {
  if (block.has_children) {
    const childBlocks = await getBlocks(block.id)
    const childrenWithNestedBlocks = await Promise.all(
      childBlocks.map(childBlock => 
        appendChildren(childBlock)
      )
    )
    
    return {
      ...block,
      children: childrenWithNestedBlocks
    }
  }
  return block 
}