import Image from 'next/image'
import homeStyles from '../styles/home.module.css'
import styles from '../styles/activities.module.css'

export default function Activities() {
  return (
    <div className={homeStyles.cardsRow}>
      <div className={styles.activity}>
        <a href="https://fortee.jp/iosdc-japan-2020/proposal/348c2d74-7855-4d8b-8457-db9df25f9a7c">
          <Image
            src="/iosdc2020.png"
            alt="iOSDC 2020"
            width={300}
            height={150}
          />
        </a>
        <p className={homeStyles.subText}>2020</p>
        <p>iOSDC 2020登壇</p>
        <p className={styles.description}>
          「Apple pencil対応の勘所を話します」というテーマで登壇しました
        </p>
      </div>

      <div className={styles.activity}>
        <a href="https://zenn.dev/st43">
          <Image src="/zenn.jpg" alt="Zenn" width={300} height={150} />
        </a>
        <p className={homeStyles.subText}>2020 - </p>
        <p>Zenn</p>
        <p className={styles.description}>技術記事を書いています</p>
      </div>

      <div className={styles.activity}>
        <a href="https://note.com/st43">
          <Image src="/note.svg" alt="note" width={300} height={150} />
        </a>
        <p className={homeStyles.subText}>2020 -</p>
        <p>note</p>
        <p className={styles.description}>実用的な記事を書いています</p>
      </div>

      <div className={styles.activity}>
        <a href="https://qiita.com/st43">
          <Image src="/qiita.png" alt="Qiita" width={320} height={150} />
        </a>
        <p className={homeStyles.subText}>2019 - 2020</p>
        <p>Qiita</p>
        <p className={styles.description}>
          以前は技術記事はQiitaに書いていましたが、Zennに移行しました
        </p>
      </div>

      <div className={styles.activity}>
        <a href="https://note.com/st43/n/n42ecbdd9aaaf">
          <Image src="/hatena.svg" alt="Hatena" width={300} height={150} />
        </a>
        <p className={homeStyles.subText}>2009 - 2020</p>
        <p>個人ブログ</p>
        <p className={styles.description}>
          学生時代から四十三庵という名前の個人ブログを公開していました。雑記ブログで、11年継続しました。過去の記事の内容のアップデートが追いつかなくなったのを感じて、非公開にしました。
        </p>
      </div>
    </div>
  )
}
