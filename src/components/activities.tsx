import Image from 'next/image'
import homeStyles from '../styles/home/home.module.css'
import styles from '../styles/home/activities.module.css'

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
        <a href="https://www.shetommy.com/articles/11%E5%B9%B4%E6%9B%B8%E3%81%8D%E7%B6%9A%E3%81%91%E3%81%9F%E3%81%AF%E3%81%A6%E3%81%AA%E3%83%96%E3%83%AD%E3%82%B0%E5%9B%9B%E5%8D%81%E4%B8%89%E5%BA%B5%E3%82%92%E9%9D%9E%E5%85%AC%E9%96%8B%E3%81%AB%E3%81%97%E3%81%9F%E3%81%AE%E3%81%A7%E6%80%9D%E3%81%84%E5%87%BA%E3%81%A8%E3%81%9D%E3%81%93%E3%81%8B%E3%82%89%E5%AD%A6%E3%82%93%E3%81%A0%E3%81%93%E3%81%A8%E3%82%92%E6%9B%B8%E3%81%8D%E3%81%BE%E3%81%99">
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
