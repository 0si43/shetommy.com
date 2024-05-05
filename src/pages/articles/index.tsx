import Header from '../../components/header'
import {
  getDatabase,
  getPageTitle,
  getPageDate,
  getLocaleDateString,
  getOpeningSentence,
  isPublishDate,
  type NotionPage
} from '../../components/notion'
import styles from '../../styles/articles/index.module.css'
import Footer from '../../components/footer'

import { useEffect, useState } from 'react'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'


export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  // データベースから「publish date」とタイトルがないものを除いて、降順にソートする
  const database = (await getDatabase(databaseId))
    .filter(
      (page) => isPublishDate(page as NotionPage) && getPageTitle(page as NotionPage) !== ''
    )
    .sort(
      (page, page2) =>
        getPageDate(page2 as NotionPage).getTime() - getPageDate(page as NotionPage).getTime()
    )

  const openingSentences = await Promise.all(
    database.map((page) => getOpeningSentence(page.id))
  )

  return {
    props: {
      db: database,
      openingSentences: openingSentences,
    },
    revalidate: 1,
  }
}

export default function Home({ db, openingSentences }: Props) {
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

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
    <div>
      <main className={styles.container}>
        <Header titlePre="Articles" />
        <h2 className={styles.heading}>All Posts</h2>
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
      </main>
      <Footer />
    </div>
  )
}
