import Header from '../../../components/header'
import {
  getDatabaseWithPagination,
  getPageTitle,
  getPageDate,
  getOpeningSentence,
  isPublishDate,
  type NotionPage,
  type PaginatedDatabaseResponse
} from '../../../components/notion'
import styles from '../../../styles/articles/index.module.css'
import Footer from '../../../components/footer'

import { useEffect, useState } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext, GetStaticPathsResult } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const pageSize = 30
  let allResults: NotionPage[] = []
  let hasMore = true
  let nextCursor: string | undefined = undefined

  // 全ページを取得してページ数を計算
  while (hasMore) {
    const response: PaginatedDatabaseResponse = await getDatabaseWithPagination(databaseId, nextCursor, pageSize)
    const filteredResults = response.results.filter(
      (page) => isPublishDate(page as NotionPage) && getPageTitle(page as NotionPage) !== ''
    )
    allResults = [...allResults, ...filteredResults]
    hasMore = response.hasMore
    nextCursor = response.nextCursor || undefined
  }

  const totalPages = Math.ceil(allResults.length / pageSize)
  const paths = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    params: { page: String(i + 2) } // page 2から開始
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const page = context.params?.page as string
  const pageNumber = parseInt(page, 10)
  const pageSize = 30

  if (isNaN(pageNumber) || pageNumber < 1) {
    return {
      notFound: true,
    }
  }

  // 指定されたページの記事を取得
  let allResults: NotionPage[] = []
  let hasMore = true
  let nextCursor: string | undefined = undefined
  let currentPage = 1

  while (hasMore && currentPage <= pageNumber) {
    const response: PaginatedDatabaseResponse = await getDatabaseWithPagination(databaseId, nextCursor, pageSize)
    const filteredResults = response.results.filter(
      (page) => isPublishDate(page as NotionPage) && getPageTitle(page as NotionPage) !== ''
    )

    if (currentPage === pageNumber) {
      allResults = filteredResults
      hasMore = response.hasMore
      break
    }

    hasMore = response.hasMore
    nextCursor = response.nextCursor || undefined
    currentPage++
  }

  if (allResults.length === 0 && pageNumber > 1) {
    return {
      notFound: true,
    }
  }

  // 日付でソート
  const sortedDatabase = allResults.sort(
    (page, page2) =>
      getPageDate(page2 as NotionPage).getTime() - getPageDate(page as NotionPage).getTime()
  )

  const openingSentences = await Promise.all(
    sortedDatabase.map((page) => getOpeningSentence(page.id))
  )

  return {
    props: {
      db: sortedDatabase,
      openingSentences: openingSentences,
      hasMore: hasMore,
      currentPage: pageNumber,
    },
    revalidate: 1,
  }
}

export default function ArticlePage({ db, openingSentences, hasMore, currentPage }: Props) {
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const dates = db.map((page) => {
      const date = new Date(getPageDate(page as NotionPage))
      return date.toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    })
    setFormattedDates(dates)
  }, [db])

  return (
    <>
      <Header titlePre="Articles" />
      <main className={styles.container}>   
        <h2>All Posts</h2>
        <ol className={styles.posts}>
          {db.map((post, index) => {
            const title = getPageTitle(post as NotionPage)

            if (title.length <= 0) {
              return <></>
            }

            return (
              <li key={title} className={styles.post}>
                <Link href={`/articles/${title}`}>
                  <h3 className={styles.postTitle}> 
                    {title}
                  </h3>
                  <p className={styles.postDescription}>
                    {formattedDates[index]}
                  </p>
                  <p className={styles.postDescription}>
                    {openingSentences[index]}
                  </p>
                </Link>
              </li>
            )
          })}
        </ol>
        
        {/* ページング UI */}
        <div className={styles.pagination}>
          <div className={styles.navigationButtons}>
            {currentPage > 1 && (
              <button 
                onClick={() => {
                  if (currentPage === 2) {
                    router.push('/articles')
                  } else {
                    router.push(`/articles/page/${currentPage - 1}`)
                  }
                }}
                className={styles.navButton}
              >
                前のページ
              </button>
            )}
            
            <div className={styles.pageInfo}>
              Page {currentPage}
            </div>
            
            {hasMore && (
              <button 
                onClick={() => router.push(`/articles/page/${currentPage + 1}`)}
                className={styles.navButton}
              >
                次のページ
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}