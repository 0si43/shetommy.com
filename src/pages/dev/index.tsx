import Link from 'next/link'
import styles from '../../styles/dev/dev.module.css'

export default function Dev() {
  return (
    <div className={styles.contents}>
      <h1>お試しページ</h1>
      <ul>
        <li>
          <Link href="/dev/sakura">Sakura</Link>
        </li>
      </ul>
      <h1>プライバシーポリシー(WristCounter)</h1>
      <ul>
        <li>
          <Link href="/privacy_policy/wristcounter.html">英語版</Link>
        </li>
        <li>
          <Link href="/privacy_policy/wristcounter_jp.html">日本語版</Link>
        </li>
      </ul>
    </div>
  )
}
