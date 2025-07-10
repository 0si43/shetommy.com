import Image from 'next/image'
import OtherSites from '../components/otherSites'
import styles from '../styles/home/profile.module.css'

export default function Profile() {
  return (
    <div className={styles.profile}>
      <div className={styles.image}>
        <Image src="/profile.png" alt="Tsubakuro icon" width={140} height={140} />
      </div>
      <p>
        本サイトshetommy.comは蔀（しとみ）の個人サイトです。<br />
      </p>
        <ul>
          <li>Home: ソフトウェアエンジニアとしてのポートフォリオサイト</li>
          <li>Articles: 雑多なネタを扱う<a href="https://www.shetommy.com/articles" className={styles.link}>個人ブログ</a>。学生時代に書いた記事も一部公開しています</li>
        </ul>
      <p>
        インターネット上に公開した成果物が、様々なプラットフォームに散らばっているので、このサイトに集約します。<br />
      </p>
      <h1>各種アカウント一覧</h1>
      <p>
        下記が他サイトで動かしているアカウントです。
      </p>
      <OtherSites />
      <ul>
        <li>TwitterがメインのSNSです。もし連絡取りたい方はリプライいただければDM開放します。</li>
        <li>GitHubアカウントで個人開発のソースコードを公開しています。</li>
        <li>
          Zennで技術記事の公開を行っています。<br />
          （昔はQiitaに書いていましたが、移行しました。<a href="https://qiita.com/st43" className={styles.link}>過去記事</a>はQiitaに残っています）
        </li>
        <li>
          noteはなるべく誰にでも読める記事（not技術記事）を書いています。<br />
          noteにはたくさん読まれたい内容を書き、そうでないときは個人ブログに書くという運用にしております。
        </li>
      </ul>
    </div>
  )
}
