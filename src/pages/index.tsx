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
          <div className={styles.profile}>
            <div className={styles.profileLeftColumn}>
              <div className={styles.image}>
                <Image
                  src="/profile.png"
                  alt="Avatar"
                  width={200}
                  height={200}
                />
              </div>
              <OtherSites />
            </div>
            <div className={styles.profileRightColumn}>
              <div className={styles.name}>蔀</div>
              （しとみ）
              <ul>
                <li>iOS開発がメインのソフトウェアエンジニア</li>
                <li>楽天イーグルスファン</li>
                <br></br>
                <li>Web上の成果物が散らばってきたので、ここに集約します</li>
                <li>
                  一年に一個大きなソフトウェア開発ができるようにがんばるのが目標です
                </li>
              </ul>
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
          Career<br></br>
          2019 - iOSエンジニア<br></br>
          <br></br>
          Works<br></br>
          2020 Pieces of Paper<br></br>
          <br></br>
          Skill Set<br></br>
          iOS開発<br></br>
          <br></br>
          Activity<br></br>
          2020 - note<br></br>
          2009 - 2019 個人ブログ<br></br>
          <br></br>
          Development<br></br>
          色々個人的に試す環境です<br></br>
          <br></br>
        </main>

        <footer className={styles.footer}>
          Copyright © Shetommy All Rights Reserved.
        </footer>
      </div>
    </>
  )
}
