import Header from '../../components/header'
import Link from 'next/link'
import { getDatabase } from '../../components/notion'
import { Text } from './[title]'
import styles from './index.module.css'
import Footer from '../../components/footer'

export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

export default function Home({ posts }) {
  return (
    <div>
      <main className={styles.container}>
        <header className={styles.header}>
          <Header titlePre="Articles" />
        </header>

        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleDateString()
            // FIXME: もっとキレイに取得する
            const title: string = post.properties.Name.title[0].plain_text
            return (
              <li key={title} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/articles/${title}`}>
                    <a>
                      <Text text={post.properties.Name.title} />
                    </a>
                  </Link>
                </h3>

                <p className={styles.postDescription}>{date}</p>
                <Link href={`/articles/${title}`}>
                  <a> Read post →</a>
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

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId)

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  }
}
