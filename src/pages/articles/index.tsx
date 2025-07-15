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

import { useEffect, useState } from 'react'
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'


export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

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

  return {
    props: {
      db: filteredDatabase,
      openingSentences: openingSentences,
      hasMore: response.hasMore,
      nextCursor: response.nextCursor,
      currentPage: 1,
    },
    revalidate: 1,
  }
}

export default function Home({ db, openingSentences, hasMore, nextCursor, currentPage }: Props) {
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
        {/* h1だとHydration Errorなのでh2 */}
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
          <div className={styles.pageInfo}>
            Page {currentPage}
          </div>
          
          {hasMore && (
            <div className={styles.loadMore}>
              <button 
                onClick={() => router.push(`/articles/page/2`)}
                className={styles.loadMoreButton}
              >
                次のページ
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
