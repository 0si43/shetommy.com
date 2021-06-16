import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Articles', page: '/articles' },
  //   { label: 'Contact', page: '/contact' },
]

const Header = ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <Head>
        <link rel="icon" href="/profile.png" />
        <title>{titlePre} </title>
        <meta name="description" content="Shetommy's profile page" />
        <meta name="og:title" content="蔀のプロフィールページ" />
        {/* <meta property="og:image" content={ogImageUrl} /> */}
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
