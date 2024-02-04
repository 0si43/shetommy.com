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
          <Profile />
          <div className={styles.contents}>
            <h1>Works</h1>
            <Works />

            <h1>Activities</h1>
            <Activities />

            <h1>Skill Set</h1>
            <Skills />

            <h1>Career</h1>
            <Career />

            <h1>Development</h1>
            <Link href="/dev">
              実験場
            </Link>
            <p>※個人的な技術検証のためのページです</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
