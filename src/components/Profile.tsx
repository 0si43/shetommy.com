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
        <ul>
          <li>Home: ソフトウェアエンジニアとしてのポートフォリオサイト</li>
          <li>Articles: 雑多なネタを扱う<a href="https://www.shetommy.com/articles">個人ブログ</a>。学生時代に書いた記事も一部サルベージしています</li>
        </ul>
      <p>
        インターネット上に散らばった成果物をこのサイトに集約します<br />
      </p>
      <h1>アカウント一覧</h1>
      <p>
        他サイトで動かしているアカウントがこちらです
      </p>
      <OtherSites />
      <ul>
        <li>TwitterはメインのSNSです。もし連絡取りたい方はリプライいただければDM開放します</li>
        <li>GitHubアカウントで個人開発のソースコードを公開しています</li>
        <li>
          Zennで技術記事の公開を行っています<br />
          （昔はQiitaに書いていましたが、移行しました。<a href="https://qiita.com/st43">過去記事</a>は残しています）
        </li>
        <li>
          noteも書いています<br />
          noteにはPV稼げそうなネタを、個人ブログには個人的なネタを書くという運用にしております
        </li>
      </ul>
    </>
  )
}
