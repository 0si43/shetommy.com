import Apple from '../svgs/apple'
import Unity from '../svgs/unity'
import Nextjs from '../svgs/nextjs'
import styles from '../styles/home/skills.module.css'

export default function Works() {
  return (
    <>
      <div className={styles.skillRow}>
        <div className={styles.skill}>
          <Apple />
          <p>iOS</p>
        </div>

        <div className={styles.skill}>
          <Unity />
          <p>Unity</p>
        </div>

        <div className={styles.skill}>
          <Nextjs />
          <p>Next.js</p>
        </div>
      </div>
    </>
  )
}
