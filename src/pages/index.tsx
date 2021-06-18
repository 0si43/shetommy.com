import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/header'
import Profile from '../components/profile'
import Works from '../components/works'
import Activities from '../components/activities'
import Footer from '../components/footer'
import styles from '../styles/home.module.css'

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
