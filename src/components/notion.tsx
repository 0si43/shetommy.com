import { Client, isNotionClientError } from '@notionhq/client'
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.d'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

declare type NotionPage = QueryDatabaseResponse['results'][number]

declare type NotionProperty =
  QueryDatabaseResponse['results'][number]['properties']

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

/// 型のnarrowingを行う。条件に合わないものはfilterする
export const narrowTypeDatabase = (db?: QueryDatabaseResponse) => {
  if (!db) {
    return []
  }

  return db.results.filter((post) => {
    post.properties.Name.type != 'title' ||
      post.properties['publish date'].type != 'date'
  })
}

export const getPageTitle = (property: NotionProperty) => {
  return property.Name.type == 'title' ? property.Name.title[0].plain_text : ''
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
  return new Date(dateString).toLocaleDateString()
}

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

export const getBlocks = async (blockId: string) => {
  const blocks = []
  let cursor: undefined | string = undefined

  while (true) {
    const blocksList = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })
    blocks.push(...blocksList.results)

    const next_cursor = blocksList.next_cursor as string | null
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return blocks
}
