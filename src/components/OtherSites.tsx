import otherSiteStyles from '../styles/home/other-sites.module.css'

import Twitter from '../svgs/twitter'
import GitHub from '../svgs/github'
import Zenn from '../svgs/zenn'
import Note from '../svgs/note'

const otherSites = [
  {
    Svg: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/0si43',
  },
  {
    Svg: GitHub,
    alt: 'github icon',
    link: 'https://github.com/0si43',
  },
  {
    Svg: Zenn,
    alt: 'Zenn icon',
    link: 'https://zenn.dev/st43',
  },
  {
    Svg: Note,
    alt: 'note icon',
    link: 'https://note.com/st43',
  },
]

export default function OtherSites() {
  return (
    <div className={otherSiteStyles.row}>
      {otherSites.map(({ Svg, link, alt }) => {
        return (
          <a key={link} href={link} aria-label={alt} className={otherSiteStyles.button}>
            <Svg />
          </a>
        )
      })}
    </div>
  )
}
