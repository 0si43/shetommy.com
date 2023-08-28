import Image from 'next/image'
import homeStyles from '../styles/home/home.module.css'
import styles from '../styles/home/works.module.css'

export default function Works() {
  return (
    <div className={homeStyles.cardsRow}>
      <a className={styles.work}　href="https://apps.apple.com/app/wristcounter-watch-app/id6448880587">
        <Image
          src="/wrist_counter.png"
          alt="WristCounter's app icon"
          width={100}
          height={100}
        />
        <div className={styles.content}>
          <p>WristCounter</p>
          <p className={homeStyles.subText}>2023</p>
          <p className={styles.description}>
            Apple Watchのカウンターアプリをつくりました。
          </p>
        </div>
      </a>

      <a className={styles.work}　href="https://github.com/0si43/shetommy.com">
        <Image
          src="/profile.png"
          alt="Shetommy.com"
          width={100}
          height={100}
        />
        <div className={styles.content}>
          <p>Shetommy.com</p>
          <p className={homeStyles.subText}>2021</p>
          <p className={styles.description}>
            このWebサイトそのものです。Next.jsを使って開発しました。
          </p>
        </div>
      </a>

      <a className={styles.work}　href="https://github.com/0si43/PiecesOfPaper">
        <Image
          src="/pieces_of_paper.png"
          alt="Pieces of Paper's app icon"
          width={100}
          height={100}
        />
        <div className={styles.content}>
          <p>Pieces of Paper</p>
          <p className={homeStyles.subText}>2020</p>
          <p className={styles.description}>
            はじめて個人開発でApp StoreにリリースしたiOSアプリ。ノートアプリです。「紙にペンで書きこむ感覚」に限りなく近い操作感を目指しました。
          </p>
        </div>
      </a>
    </div>
  )
}
