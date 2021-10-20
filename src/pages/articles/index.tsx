import Header from '../../components/header'
import {
  getDatabase,
  getPageTitle,
  getPageDate,
  getOpeningSentence,
  isPublishDate,
} from '../../components/notion'
import styles from '../../styles/articles/index.module.css'
import Footer from '../../components/footer'

import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'

export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  // データベースから「publish date」がないものを除いて、降順にソートする
  const database = (await getDatabase(databaseId))
    .filter((page) => isPublishDate(page))
    .sort(
      (page, page2) =>
        getPageDate(page2).getTime() - getPageDate(page).getTime()
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
  return (
    <div>
      <main className={styles.container}>
        <Header titlePre="Articles" />
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {db.map((post, index) => {
            const title = getPageTitle(post.properties)
            const date = getPageDate(post).toLocaleDateString()

            return (
              <li key={title} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/articles/${title}`}>
                    <a>{title}</a>
                  </Link>
                </h3>
                <p className={styles.postDescription}>
                  {openingSentences[index]}
                </p>
                <p className={styles.postDescription}>{date}</p>
              </li>
            )
          })}
        </ol>
      </main>
      <Footer />
    </div>
  )
}
