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
                <li>iOSエンジニア</li>
                <li>楽天イーグルスファン</li>
                <br></br>
                <li>
                  個人開発の成果物とWeb上に公開した文章のなかでよかったものを残していきます
                </li>
                <li>年に一個大きな成果が出せるようにがんばっています</li>
              </ul>
            </div>
          </div>
          <div className={styles.contents}>
            <h1>Works</h1>
            <div className={styles.works}>
              <div className={styles.work}>
                <a href="">
                  <Image
                    src="/profile.png"
                    alt="Shetommy.com"
                    width={100}
                    height={100}
                  />
                </a>
                <div className={styles.workContent}>
                  <p>Shetommy.com</p>
                  <p className={styles.subText}>2021</p>
                  <p className={styles.description}>
                    このWebサイトそのものです。Next.jsを使って開発しました。
                  </p>
                </div>
              </div>
              <div className={styles.work}>
                <a href="https://github.com/0si43/PiecesOfPaper">
                  <Image
                    src="/pieces_of_paper.png"
                    alt="Pieces of Paper's app icon"
                    width={100}
                    height={100}
                  />
                </a>
                <div className={styles.workContent}>
                  <p>Pieces of Paper</p>
                  <p className={styles.subText}>2020</p>
                  <p className={styles.description}>
                    はじめて個人開発でApp
                    StoreにリリースしたiOSアプリ。ノートアプリです。「紙にペンで書きこむ感覚」に限りなく近い操作感を目指しました。
                  </p>
                </div>
              </div>
            </div>
            <h1>Activity</h1>
            <p>2020 iOSDC登壇</p>
            <p>2020 - note</p>
            <p>2009 - 2019 個人ブログ</p>

            <h1>Skill Set</h1>
            <p>iOS開発</p>
            <p>Unity</p>
            <h1>Career</h1>
            <h2>2019 - </h2>
            <p>iOSエンジニア</p>
            <h2>2014 - 2019</h2>
            <p> 金融系システムエンジニア</p>

            <h1>Development</h1>
            <p>色々個人的に試す環境です</p>
          </div>
        </main>

        <footer className={styles.footer}>
          Copyright © Shetommy All Rights Reserved.
        </footer>
      </div>
    </>
  )
}
