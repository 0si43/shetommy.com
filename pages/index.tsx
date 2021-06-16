import Image from 'next/image'
import Header from '../components/header'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header titlePre="Home" />

      <div className={styles.profileImage}>
        <Image src="/profile.png" alt="Avatar" width={200} height={200} />
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>蔀のページへようこそ</h1>
      </main>

      <footer className={styles.footer}>
        Copyright © Shetommy All Rights Reserved.
      </footer>
    </div>
  )
}
