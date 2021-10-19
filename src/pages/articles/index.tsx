import Header from '../../components/header'
import { getDatabase, getPageTitle, getPageDate } from '../../components/notion'
import styles from '../../styles/articles/index.module.css'
import Footer from '../../components/footer'

import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'

export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId)

  return {
    props: {
      db: database,
    },
    revalidate: 1,
  }
}

export default function Home({ db }: Props) {
  return (
    <div>
      <main className={styles.container}>
        <Header titlePre="Articles" />
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {db.map((post) => {
            const title = getPageTitle(post.properties)
            const date = getPageDate(post)

            return (
              <li key={title} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/articles/${title}`}>
                    <a>
                      {/* <TextComponent richTexts={post.properties.Name} /> */}
                      {title}
                    </a>
                  </Link>
                </h3>
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
