import Image from 'next/image'
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
      </div>
      <div className={styles.right}>
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
  )
}
