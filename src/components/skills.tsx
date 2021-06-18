import Image from 'next/image'
import homeStyles from '../styles/home.module.css'
import styles from '../styles/skills.module.css'

export default function Works() {
  return (
    <div className={homeStyles.cardsRow}>
      <div className={styles.skill}>
        <Image src="/apple.svg" alt="Apple" width={24} height={24} />
        <p>iOS</p>
      </div>

      <div className={styles.skill}>
        <Image src="/unity.svg" alt="Unity" width={24} height={24} />
        <p>Unity</p>
      </div>
    </div>
  )
}
