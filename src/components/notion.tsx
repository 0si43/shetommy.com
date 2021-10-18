import { Client } from '@notionhq/client'
import type { Page, Block } from '@notionhq/client/build/src/api-types'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const getDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  const pages: Page[] = response.results
  return pages
}

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  const page: Page = response
  return page
}

export const getBlocks = async (blockId: string) => {
  const blocks: Block[] = []
  let cursor: undefined | string = undefined

  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })
    blocks.push(...results)
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return blocks
}
