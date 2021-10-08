import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Articles', page: '/articles' },
]

const Header = ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <Head>
        <link rel="icon" href="/profile.png" />
        <title>{titlePre} </title>
        <meta
          name="description"
          content="Shetommy's portfolio website and personal blog"
        />
        <meta name="og:title" content="蔀のポートフォリオサイト&ブログ" />
        <meta property="og:title" content={titlePre} />
        <meta property="og:description" content="蔀のブログです" />
        <meta property="og:image" content="/profile.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <br></br>
            )}
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
