import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getDatabaseWithPagination,
  getOpeningSentence,
  filterAndSortPages,
  formatArticle,
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
    const pageSize = 10
    
    const response = await getDatabaseWithPagination(
      databaseId,
      cursor as string | undefined,
      pageSize
    )

    const filteredDatabase = filterAndSortPages(response.results)

    const articlesWithOpeningSentences = await Promise.all(
      filteredDatabase.map(async (page) => {
        const openingSentence = await getOpeningSentence(page.id)
        return formatArticle(page, openingSentence)
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