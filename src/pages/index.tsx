import Link from 'next/link'
import Header from '../components/header'

import Profile from '../components/profile'
import Works from '../components/works'
import Activities from '../components/activities'
import Skills from '../components/skills'
import Career from '../components/career'

import Footer from '../components/footer'
import styles from '../styles/home/home.module.css'

export default function Home() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.contents}>
            <Profile />
            <h1>Skill Set</h1>
            <p>メインはiOS開発。Unity / Next.jsがすこしできます</p>
            <Skills />
            <h1>Career</h1>
            <p>2014年に新卒で金融系の会社に就職、<a href="https://www.shetommy.com/articles/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A05%E5%B9%B4%E3%81%AE%E7%B5%8C%E9%A8%93%E3%81%97%E3%81%8B%E3%81%AA%E3%81%84%E9%87%91%E8%9E%8D%E7%B3%BBSE%E3%81%8CiOS%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%81%A8%E3%81%97%E3%81%A6%E8%BB%A2%E8%81%B7%E3%81%97%E3%81%9F%E8%A9%B1">2019年にiOSエンジニアとしてキャリアチェンジ</a>しました</p>
            <Career />
            <h1>Works</h1>
            <p>個人開発の成果です</p>
          </div>
          <div className={styles.cardsRow}>
              <Works />
          </div>
          <div className={styles.contents}>
            <h1>Activities</h1>
            <p>カンファレンス登壇と過去のブログです</p>
          </div>
          <div className={styles.cardsRow}>
            <Activities />
          </div>
          <div className={styles.contents}>
            <h1>Development</h1>
            <Link href="/dev">
              実験場
            </Link>
            <p>技術検証のためのページです。といってもプライバシーポリシーしか置いてませんが……</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
