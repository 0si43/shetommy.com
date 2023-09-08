import BuyMeACoffeeWidget from '../components/coffee'
import Image from 'next/image'
import Link from 'next/link'
import OtherSites from '../components/otherSites'
import styles from '../styles/home/profile.module.css'

export default function Profile() {
  return (
    <div className={styles.profile}>
      <div className={styles.left}>
        <div className={styles.image}>
          <Image src="/profile.png" alt="Avatar" width={200} height={200} />
        </div>
        <OtherSites />
        <BuyMeACoffeeWidget />
      </div>
      <div className={styles.right}>
        <div className={styles.name}>蔀（しとみ）</div>
        <div className={styles.name}>Shetommy</div>
        <ul>
          <li>iOSエンジニア</li>
          <li>楽天イーグルスファン</li>
          <br></br>
          <li>ポートフォリオサイト + 個人ブログ</li>
          <li>個人開発の成果物とよかった文章を残していきます</li>
        </ul>
      </div>
    </div>
  )
}
