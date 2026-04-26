import Image from 'next/image'
import OtherSites from './OtherSites'
import styles from '../styles/home/profile.module.css'

export default function Profile() {
  return (
    <>
      <div className={styles.image}>
        <Image src="/profile.png" alt="Tsubakuro icon" width={140} height={140} />
      </div>
      <p>
        本サイトshetommy.comは蔀（しとみ）の個人サイトです<br />
      </p>
      <p>
        ポートフォリオサイト + 個人ブログです<br />
      </p>
      <h1>アカウント一覧</h1>
      <p>
        他サイトで動かしているアカウントがこちらです<br />
        Twitterが一番連絡取りやすいかと思います<br />
      </p>
      <OtherSites />
    </>
  )
}
