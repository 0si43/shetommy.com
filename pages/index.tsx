import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>蔀(Shetommy)</title>
        <meta name="description" content="蔀の個人サイト" />
        <link rel="icon" href="/profile.png" />
      </Head>

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
