import Header from '../../components/header'
import Link from 'next/link'
import { getDatabase } from '../../components/notion'
import { TextComponent } from './[title]'
// import type {
//   DatePropertyValue,
//   TitlePropertyValue,
//   RichTextText,
// } from '@notionhq/client/build/src/api-types'
import styles from '../../styles/articles/index.module.css'
import Footer from '../../components/footer'
import { InferGetStaticPropsType } from 'next'

export const databaseId = process.env.NOTION_DATABASE_ID
  ? process.env.NOTION_DATABASE_ID
  : ''

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId)

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  }
}

export default function Home(props: Props) {
  return (
    <div>
      <main className={styles.container}>
        <Header titlePre="Articles" />
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {props.posts.map((post) => {
            const titleProperty = post.properties.Name
            let title = ''
            if (titleProperty.type == 'title') {
              const titleRichText = titleProperty.title
              title = titleRichText[0].plain_text
            }

            let dateString = post.last_edited_time
            const publishDateObject = post.properties['publish date']
            if (publishDateObject.type == 'date') {
              dateString = publishDateObject.date.start
            }
            const date = new Date(dateString).toLocaleDateString()

            return (
              <li key={title} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/articles/${title}`}>
                    <a>
                      <TextComponent richTexts={titleRichText} />
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
