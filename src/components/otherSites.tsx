import otherSiteStyles from '../styles/home/other_sites.module.css'

import Twitter from '../svgs/twitter'
import GitHub from '../svgs/github'
import Zenn from '../svgs/zenn'
import Note from '../svgs/note'

const otherSites = [
  {
    Comp: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/0si43',
  },
  {
    Comp: GitHub,
    alt: 'github icon',
    link: 'https://github.com/0si43',
  },
  {
    Comp: Zenn,
    alt: 'Zenn icon',
    link: 'https://zenn.dev/st43',
  },
  {
    Comp: Note,
    alt: 'note icon',
    link: 'https://note.com/st43',
  },
]

export default function OtherSites() {
  return (
    <div className={otherSiteStyles.links}>
      {otherSites.map(({ Comp, link, alt }) => {
        return (
          <a key={link} href={link} aria-label={alt}>
            <Comp height={32} />
          </a>
        )
      })}
    </div>
  )
}
