import Image from 'next/image'
import homeStyles from '../styles/home.module.css'
import styles from '../styles/works.module.css'

export default function Works() {
  return (
    <div className={homeStyles.cardsRow}>
      <div className={styles.work}>
        <a href="">
          <Image
            src="/profile.png"
            alt="Shetommy.com"
            width={100}
            height={100}
          />
        </a>
        <div className={styles.content}>
          <p>Shetommy.com</p>
          <p className={homeStyles.subText}>2021</p>
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
        <div className={styles.content}>
          <p>Pieces of Paper</p>
          <p className={homeStyles.subText}>2020</p>
          <p className={styles.description}>
            はじめて個人開発でApp
            StoreにリリースしたiOSアプリ。ノートアプリです。「紙にペンで書きこむ感覚」に限りなく近い操作感を目指しました。
          </p>
        </div>
      </div>
    </div>
  )
}
