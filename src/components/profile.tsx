import Image from 'next/image'
import { useRouter } from 'next/router'
import BuyMeACoffeeWidget from '../components/coffee'
import OtherSites from '../components/otherSites'
import styles from '../styles/home/profile.module.css'

export default function Profile() {
  const { locale } = useRouter()
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
        <div className={styles.name}>{locale === 'ja' ? '蔀' : 'Shetommy'}</div>
        {locale === 'ja' ? '（しとみ）' : ''}
        <ul>
          <li>iOSエンジニア</li>
          <li>楽天イーグルスファン</li>
          <br></br>
          <li>
            個人開発の成果物とWeb上に公開した文章のなかでよかったものを残していきます
          </li>
          <li>ポートフォリオサイト + 個人ブログ + Web技術の実験場</li>
          <li>年に一個大きな成果が出せるようにがんばっています</li>
        </ul>
      </div>
    </div>
  )
}
