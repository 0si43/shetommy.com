import Image from 'next/image'
import Header from '../components/header'
import OtherSites from '../components/otherSites'
import styles from '../styles/home.module.css'

export default function Home() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.profileImage}>
            <Image src="/profile.png" alt="Avatar" width={200} height={200} />
          </div>
          <h2 className={styles.text}>
            蔀<br></br>
          </h2>
          （しとみ）
          <OtherSites />
          <h2 className={styles.text}>
            ソフトウェアエンジニア<br></br>
            楽天イーグルスファン<br></br>
          </h2>
        </main>

        <footer className={styles.footer}>
          Copyright © Shetommy All Rights Reserved.
        </footer>
      </div>
    </>
  )
}
