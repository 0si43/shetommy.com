import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getDatabaseWithPagination,
  getPageTitle,
  getPageDate,
  getOpeningSentence,
  isPublishDate,
} from '../../../components/Notion'

const databaseId = process.env.NOTION_DATABASE_ID || ''

type ArticleData = {
  id: string
  title: string
  date: string
  openingSentence: string
}

type ApiResponse = {
  articles: ArticleData[]
  hasMore: boolean
  nextCursor: string | null
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      articles: [],
      hasMore: false,
      nextCursor: null,
      error: 'Method not allowed'
    })
  }

  try {
    const { cursor } = req.query
    const cursorString = typeof cursor === 'string' ? cursor : undefined
    const pageSize = 10

    const response = await getDatabaseWithPagination(
      databaseId,
      cursorString,
      pageSize
    )

    // フィルタリングとソート
    const filteredDatabase = response.results
      .filter(
        (page) => isPublishDate(page) && getPageTitle(page) !== ''
      )
      .sort(
        (page, page2) =>
          getPageDate(page2).getTime() - getPageDate(page).getTime()
      )

    // 並行して冒頭文を取得
    const articlesWithOpeningSentences = await Promise.all(
      filteredDatabase.map(async (page) => {
        const openingSentence = await getOpeningSentence(page.id)
        return {
          id: page.id,
          title: getPageTitle(page),
          date: getPageDate(page).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          openingSentence,
        }
      })
    )

    res.status(200).json({
      articles: articlesWithOpeningSentences,
      hasMore: response.hasMore,
      nextCursor: response.nextCursor,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    res.status(500).json({
      articles: [],
      hasMore: false,
      nextCursor: null,
      error: 'Internal server error'
    })
  }
}