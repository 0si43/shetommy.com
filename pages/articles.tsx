import Header from '../components/header'
import styles from '../styles/articles.module.css'

function Articles() {
  return (
    <>
      <Header titlePre="Articles" />
      <div className={styles.container}>Article</div>
    </>
  )
}

export default Articles
