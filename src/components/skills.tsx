import Image from 'next/image'
import styles from '../styles/home/skills.module.css'

export default function Works() {
  return (
    <>
      <div className={styles.skillRow}>
        <div className={styles.skill}>
          <Image src="/apple.svg" alt="Apple" width={24} height={24} />
          <p>iOS</p>
        </div>

        <div className={styles.skill}>
          <Image src="/unity.svg" alt="Unity" width={24} height={24} />
          <p>Unity</p>
        </div>

        <div className={styles.skill}>
        <Image src="/nextjs.svg" alt="Next.js" width={24} height={24} />
        <p>Next.js</p>
        </div>
      </div>
    </>
  )
}
