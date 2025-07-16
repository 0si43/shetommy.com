import Header from '../../components/header'
import {
  getDatabaseWithPagination,
  getPageTitle,
  getPageDate,
  getOpeningSentence,
  isPublishDate,
  type NotionPage,
  type PaginatedDatabaseResponse
} from '../../components/notion'
import styles from '../../styles/articles/index.module.css'
import Footer from '../../components/footer'

import { useState } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Link from 'next/link'


export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

type ArticleData = {
  id: string
  title: string
  date: string
  openingSentence: string
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const pageSize = 30
  
  // ページング対応で記事を取得
  const response = await getDatabaseWithPagination(databaseId, undefined, pageSize)
  
  // フィルタリングとソート
  const filteredDatabase = response.results
    .filter(
      (page) => isPublishDate(page as NotionPage) && getPageTitle(page as NotionPage) !== ''
    )
    .sort(
      (page, page2) =>
        getPageDate(page2 as NotionPage).getTime() - getPageDate(page as NotionPage).getTime()
    )

  const openingSentences = await Promise.all(
    filteredDatabase.map((page) => getOpeningSentence(page.id))
  )

  // 初期記事データを整形
  const initialArticles = filteredDatabase.map((page, index) => ({
    id: page.id,
    title: getPageTitle(page as NotionPage),
    date: getPageDate(page as NotionPage).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    openingSentence: openingSentences[index],
  }))

  return {
    props: {
      initialArticles,
      hasMore: response.hasMore,
      nextCursor: response.nextCursor,
    },
    revalidate: 1,
  }
}

export default function Home({ initialArticles, hasMore: initialHasMore, nextCursor: initialNextCursor }: Props) {
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [loading, setLoading] = useState(false)

  const loadMoreArticles = async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/articles/more?cursor=${nextCursor || ''}`)
      const data = await response.json()
      
      if (data.articles) {
        setArticles(prev => [...prev, ...data.articles])
        setHasMore(data.hasMore)
        setNextCursor(data.nextCursor)
      }
    } catch (error) {
      console.error('Error loading more articles:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header titlePre="Articles" />
      <main className={styles.container}>   
        {/* h1だとHydration Errorなのでh2 */}
        <h2>All Posts</h2>
        <ol className={styles.posts}>
          {articles.map((article) => {
            if (article.title.length <= 0) {
              return <></>
            }

            return (
              <li key={article.id} className={styles.post}>
                <Link href={`/articles/${article.title}`}>
                  <h3 className={styles.postTitle}> 
                    {article.title}
                  </h3>
                  <p className={styles.postDescription}>
                    {article.date}
                  </p>
                  <p className={styles.postDescription}>
                    {article.openingSentence}
                  </p>
                </Link>
              </li>
            )
          })}
        </ol>
        
        {/* もっと読むボタン */}
        {hasMore && (
          <div className={styles.loadMore}>
            <button 
              onClick={loadMoreArticles}
              disabled={loading}
              className={styles.loadMoreButton}
            >
              {loading ? '読み込み中' : 'もっと読む'}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
