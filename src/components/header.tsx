import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAppearance } from './hooks/useAppearance'
import styles from '../styles/header.module.css'

const navigationItems: { name: string; path: string }[] = [
  { name: 'Home', path: '/' },
  { name: 'Articles', path: '/articles' },
]

const Header = ({ titlePre = '' }) => {
  const { pathname } = useRouter()
  const { appearance, changeAppearance, getAppearanceLabel } = useAppearance();

  return (
    <header className={styles.header}>
      <Head>
        <link rel="icon" href="/profile.png" />
        <title>{`${titlePre}`}</title>
        <meta
          name="description"
          content="Shetommy's portfolio website and personal blog"
        />
        <meta property="og:title" content={titlePre} />
        <meta
          property="og:type"
          content={titlePre == 'Home' ? 'website' : 'article'}
        />
        <meta
          property="og:description"
          content={
            titlePre == 'Home'
              ? '蔀のポートフォリオサイト'
              : titlePre == 'Articles'
              ? '蔀の個人ブログ'
              : 'Written by 蔀'
          }
        />
        <meta
          property="og:image"
          content="https://www.shetommy.com/_next/image?url=%2Fprofile.png&w=640&q=75"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="Hatena::Bookmark" content="nocomment" />
      </Head>
      <div className={styles.navigationContainer}>
        {navigationItems.map(({ name, path }) => (
          <Link href={path} className={pathname === path ? styles.active : styles.inactive}>
            <button>{name}</button>
          </Link>
        ))}
      </div>
      <div className={styles.actionButtonContainer}>
        <button onClick={changeAppearance}>
          {getAppearanceLabel(appearance)}
        </button>
      </div>
    </header>
  )
}

export default Header
