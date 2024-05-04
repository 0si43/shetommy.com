import { Client, isNotionClientError } from '@notionhq/client'
import { type OgObject } from 'open-graph-scraper/dist/lib/types.d'
import type {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.d'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export declare type NotionPage = Extract<QueryDatabaseResponse['results'][number], { properties: Record<string, any> }>
type NotionBlock = Extract<ListBlockChildrenResponse['results'][number], { type: string }>
export type NotionBlockWithChildren = NotionBlock & {
  children?: NotionBlockWithChildren[],
  ogpData?: OgObject 
}

/// Blog記事のデータベースを取得する
export const getDatabase = async (databaseId: string) => {
  try {
    const response = await notion.databases.query({
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

/// publish dateが設定されていないページをfilterする
export const filterPages = (pages: NotionPage[]) => {
  return pages.filter((page) => page.properties['publish date'] !== null)
}

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
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

/// 冒頭80字を返す。存在しなかったらnullを返す
export const getOpeningSentence = async (blockId: string) => {
  let openingSentence = ''
  let cursor: undefined | string = undefined

  while (true) {
    const block = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
      page_size: 1,
    })

    if (block.results[0] && 'type' in block.results[0]) {
      const blockType = block.results[0].type
      if (blockType === 'paragraph') {
        block.results[0].paragraph.text.forEach((textObject) => {
          openingSentence += textObject.plain_text
        })
      }
    }

    const next_cursor = block.next_cursor as string | null
    if (openingSentence.length >= 80 || !next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return openingSentence.substring(0, 80)
}

/// 指定されたページ（ここではブロックID = ページID）のブロックをすべて返す
export const getBlocks = async (blockId: string) => {
  const blocks: NotionBlockWithChildren[] = []
  let cursor: undefined | string = undefined

  while (true) {
    const blocksList = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })
    const notionBlocks = blocksList.results.filter(
      (block): block is NotionBlockWithChildren => {
        return 'type' in block
      }
    )
    blocks.push(...notionBlocks)

    const next_cursor = blocksList.next_cursor as string | null
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return blocks
}
