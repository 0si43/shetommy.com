import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/header'
import OtherSites from '../components/otherSites'
import Works from '../components/works'
import Footer from '../components/footer'
import styles from '../styles/home.module.css'

export default function Home() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.profile}>
            <div className={styles.profileLeftColumn}>
              <div className={styles.image}>
                <Image
                  src="/profile.png"
                  alt="Avatar"
                  width={200}
                  height={200}
                />
              </div>
              <OtherSites />
            </div>
            <div className={styles.profileRightColumn}>
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
          <div className={styles.contents}>
            <h1>Works</h1>
            <Works />
            <h1>Activities</h1>
            <div className={styles.cardsRow}>
              <div className={styles.activity}>
                <a href="https://fortee.jp/iosdc-japan-2020/proposal/348c2d74-7855-4d8b-8457-db9df25f9a7c">
                  <Image
                    src="/iosdc2020.png"
                    alt="iOSDC 2020"
                    width={300}
                    height={150}
                  />
                </a>
                <p className={styles.subText}>2020</p>
                <p>iOSDC 2020登壇</p>
                <p className={styles.description}>
                  「Apple pencil対応の勘所を話します」というテーマで登壇しました
                </p>
              </div>

              <div className={styles.activity}>
                <a href="https://zenn.dev/st43">
                  <Image src="/zenn.jpg" alt="Zenn" width={300} height={150} />
                </a>
                <p className={styles.subText}>2020 - </p>
                <p>Zenn</p>
                <p className={styles.description}>技術記事を書いています</p>
              </div>

              <div className={styles.activity}>
                <a href="https://note.com/st43">
                  <Image src="/note.svg" alt="note" width={300} height={150} />
                </a>
                <p className={styles.subText}>2020 -</p>
                <p>note</p>
                <p className={styles.description}>実用的な記事を書いています</p>
              </div>

              <div className={styles.activity}>
                <a href="https://qiita.com/st43">
                  <Image
                    src="/qiita.png"
                    alt="Qiita"
                    width={320}
                    height={150}
                  />
                </a>
                <p className={styles.subText}>2019 - 2020</p>
                <p>Qiita</p>
                <p className={styles.description}>
                  以前は技術記事はQiitaに書いていましたが、Zennに移行しました
                </p>
              </div>

              <div className={styles.activity}>
                <a href="https://note.com/st43/n/n42ecbdd9aaaf">
                  <Image
                    src="/hatena.svg"
                    alt="Hatena"
                    width={300}
                    height={150}
                  />
                </a>
                <p className={styles.subText}>2009 - 2020</p>
                <p>個人ブログ</p>
                <p className={styles.description}>
                  学生時代から四十三庵という名前の個人ブログを公開していました。雑記ブログで、11年継続しました。過去の記事の内容のアップデートが追いつかなくなったのを感じて、非公開にしました。
                </p>
              </div>
            </div>

            <h1>Skill Set</h1>
            <div className={styles.cardsRow}>
              <div className={styles.skill}>
                <Image src="/apple.svg" alt="Apple" width={24} height={24} />
                <p>iOS</p>
              </div>

              <div className={styles.skill}>
                <Image src="/unity.svg" alt="Unity" width={24} height={24} />
                <p>Unity</p>
              </div>
            </div>
            <h1>Career</h1>
            <div className={styles.career}>
              <table>
                <tr>
                  <th>Start(year)</th>
                  <th>End(year)</th>
                  <th>Role</th>
                </tr>
                <tr>
                  <td>2019</td>
                  <td>-</td>
                  <td>iOSエンジニア</td>
                </tr>
                <tr>
                  <td>2014</td>
                  <td>2019</td>
                  <td>金融系システムエンジニア</td>
                </tr>
              </table>
            </div>

            <h1>Development</h1>
            <Link href="/dev">
              <a>実験場</a>
            </Link>
            <p>※個人的な技術検証のためのページです</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
