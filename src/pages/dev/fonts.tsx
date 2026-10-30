import Head from 'next/head'
import { CSSProperties, Fragment, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import postStyles from '../../styles/articles/post.module.css'
import styles from '../../styles/dev/fonts.module.css'

type Group = 'base' | 'hand' | 'messy' | 'soft' | 'bold'

type Font = {
  id: string
  name: string
  family: string
  group: Group
  memo: string
}

const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"

const FONTS: Font[] = [
  {
    id: 'system',
    name: 'いまのフォント',
    family: SYSTEM_FONT,
    group: 'base',
    memo: 'ヒラギノ / 游ゴシック（OS 任せ）',
  },
  {
    id: 'klee',
    name: 'Klee One',
    family: "'Klee One', cursive",
    group: 'hand',
    memo: '鉛筆で丁寧に書いた教科書体',
  },
  {
    id: 'kurenaido',
    name: 'Zen Kurenaido',
    family: "'Zen Kurenaido', sans-serif",
    group: 'hand',
    memo: '細いペンのさらっとした手書き',
  },
  {
    id: 'yomogi',
    name: 'Yomogi',
    family: "'Yomogi', cursive",
    group: 'hand',
    memo: 'ゆるいノートの走り書き',
  },
  {
    id: 'yusei',
    name: 'Yusei Magic',
    family: "'Yusei Magic', sans-serif",
    group: 'hand',
    memo: '太めのマーカーで書いた感じ',
  },
  {
    id: 'hachimaru',
    name: 'Hachi Maru Pop',
    family: "'Hachi Maru Pop', cursive",
    group: 'hand',
    memo: '丸文字。かなりポップ',
  },
  {
    id: 'slackside',
    name: 'Slackside One',
    family: "'Slackside One', cursive",
    group: 'messy',
    memo: 'だらっと崩れた、いちばん雑な走り書き',
  },
  {
    id: 'daruma',
    name: 'Darumadrop One',
    family: "'Darumadrop One', cursive",
    group: 'messy',
    memo: '太いペンでぼてっと書いた字',
  },
  {
    id: 'stick',
    name: 'Stick',
    family: "'Stick', sans-serif",
    group: 'messy',
    memo: '棒を並べたようなカクカクの字',
  },
  {
    id: 'yujiboku',
    name: 'Yuji Boku',
    family: "'Yuji Boku', serif",
    group: 'messy',
    memo: 'かすれた筆文字',
  },
  {
    id: 'potta',
    name: 'Potta One',
    family: "'Potta One', cursive",
    group: 'messy',
    memo: '勢いのある筆のポップ体',
  },
  {
    id: 'kiwi',
    name: 'Kiwi Maru',
    family: "'Kiwi Maru', serif",
    group: 'soft',
    memo: '筆の入りが残る丸い明朝',
  },
  {
    id: 'zenmaru',
    name: 'Zen Maru Gothic',
    family: "'Zen Maru Gothic', sans-serif",
    group: 'soft',
    memo: 'やわらかい丸ゴシック',
  },
  {
    id: 'decol',
    name: 'Kaisei Decol',
    family: "'Kaisei Decol', serif",
    group: 'soft',
    memo: '装飾のある明朝。見出し向き',
  },
  {
    id: 'mochiy',
    name: 'Mochiy Pop One',
    family: "'Mochiy Pop One', sans-serif",
    group: 'bold',
    memo: 'もちっと太いポップ体。見出し向き',
  },
  {
    id: 'dot',
    name: 'DotGothic16',
    family: "'DotGothic16', sans-serif",
    group: 'bold',
    memo: 'ドット絵のビットマップ風',
  },
  {
    id: 'dela',
    name: 'Dela Gothic One',
    family: "'Dela Gothic One', sans-serif",
    group: 'bold',
    memo: '極太ゴシック。見出し専用',
  },
  {
    id: 'rampart',
    name: 'Rampart One',
    family: "'Rampart One', sans-serif",
    group: 'bold',
    memo: '立体的な袋文字。見出し専用',
  },
]

const GROUP_LABEL: Record<Group, string> = {
  base: '基準',
  hand: '手書き',
  messy: '雑な手書き',
  soft: 'やわらか',
  bold: '飛び道具',
}

// next/font/google would download every unicode-range chunk of all 17 Japanese families at build time
const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${[
  'Klee+One:wght@400;600',
  'Zen+Kurenaido',
  'Yomogi',
  'Yusei+Magic',
  'Hachi+Maru+Pop',
  'Slackside+One',
  'Darumadrop+One',
  'Stick',
  'Yuji+Boku',
  'Potta+One',
  'Kiwi+Maru:wght@400;500',
  'Zen+Maru+Gothic:wght@400;700',
  'Kaisei+Decol:wght@400;700',
  'Mochiy+Pop+One',
  'DotGothic16',
  'Dela+Gothic+One',
  'Rampart+One',
]
  .map((family) => `family=${family}`)
  .join('&')}&display=swap`

const SAMPLE_CODE = `AsyncImage(url: item.thumbnailURL) { image in
    image.resizable().scaledToFill()
} placeholder: {
    Color.gray.opacity(0.2)
}
.frame(width: 64, height: 64)
.clipShape(RoundedRectangle(cornerRadius: 8))`

const fontById = (id: string) =>
  FONTS.find((font) => font.id === id) ?? FONTS[0]

type ChipsProps = {
  selected: string
  onSelect: (id: string) => void
  leading?: { id: string; label: string }
}

function FontChips({ selected, onSelect, leading }: ChipsProps) {
  return (
    <div className={styles.chips}>
      {leading && (
        <button
          type="button"
          className={styles.chip}
          aria-pressed={selected === leading.id}
          onClick={() => onSelect(leading.id)}
        >
          {leading.label}
        </button>
      )}
      {FONTS.map((font, index) => (
        <Fragment key={font.id}>
          {font.group !== 'base' && FONTS[index - 1].group !== font.group && (
            <span className={styles.groupTag}>{GROUP_LABEL[font.group]}</span>
          )}
          <button
            type="button"
            className={styles.chip}
            style={{ fontFamily: font.family }}
            aria-pressed={selected === font.id}
            onClick={() => onSelect(font.id)}
          >
            {font.name}
          </button>
        </Fragment>
      ))}
    </div>
  )
}

export default function Fonts() {
  const [bodyId, setBodyId] = useState('klee')
  const [headId, setHeadId] = useState('same')
  const [size, setSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.7)

  const fontVars = {
    '--body-font': fontById(bodyId).family,
    ...(headId !== 'same' && { '--head-font': fontById(headId).family }),
  } as CSSProperties

  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </Head>
      <Header titlePre="Font Lab" />

      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.row}>
            <div className={styles.rowLabel}>本文</div>
            <FontChips selected={bodyId} onSelect={setBodyId} />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>見出し</div>
            <FontChips
              selected={headId}
              onSelect={setHeadId}
              leading={{ id: 'same', label: '本文と同じ' }}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.rowLabel}>調整</div>
            <div className={styles.sliders}>
              <label htmlFor="font-size">
                文字
                <input
                  id="font-size"
                  type="range"
                  min={14}
                  max={20}
                  step={1}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
                <output htmlFor="font-size">{size}px</output>
              </label>
              <label htmlFor="line-height">
                行間
                <input
                  id="line-height"
                  type="range"
                  min={1.4}
                  max={2.2}
                  step={0.1}
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                />
                <output htmlFor="line-height">{lineHeight.toFixed(1)}</output>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.preview} style={fontVars}>
        <article
          id="sample"
          className={postStyles.container}
          style={{ fontSize: size, lineHeight }}
        >
          <h1 className={postStyles.name}>
            SwiftUI の List を 3 年使って分かったこと
          </h1>
          <time className={postStyles.date} dateTime="2026-10-12">
            2026/10/12
          </time>
          <section>
            <nav>
              <h1>目次</h1>
              <ol>
                <li>はじめに</li>
                <li>セルの高さが揃わない問題</li>
                <li>まとめ</li>
              </ol>
            </nav>
            <h2>はじめに</h2>
            <p>
              個人開発のアプリで、一覧画面をずっと{' '}
              <span className={postStyles.code}>List</span>{' '}
              で作ってきました。最初は「とりあえず動けばいい」と思っていたのですが、iOS
              のバージョンが上がるたびに細かい挙動が変わり、そのたびに小さな修正を重ねてきました。今回はその記録です。
            </p>
            <p>
              ちなみに、この記事は朝 6
              時に近所の喫茶店で書いています。コーヒーは 2 杯目です。
            </p>
            <h2>セルの高さが揃わない問題</h2>
            <p>
              一番ハマったのは、セルの中に画像と複数行のテキストを並べたときに、高さがスクロールのたびにガタつく現象でした。原因は大きく分けて次の
              3 つです。
            </p>
            <ul>
              <li>画像の読み込み完了前後で intrinsic size が変わる</li>
              <li>
                <span className={postStyles.code}>lineLimit(nil)</span> と{' '}
                <span className={postStyles.code}>fixedSize</span> の組み合わせ
              </li>
              <li>Dynamic Type の設定が「大きい」以上のとき</li>
            </ul>
            <h3>画像は先にサイズを決める</h3>
            <p>
              結局、画像の枠を先に{' '}
              <span className={postStyles.code}>frame</span>{' '}
              で固定してしまうのが一番確実でした。
            </p>
            <SyntaxHighlighter language="swift" style={vscDarkPlus}>
              {SAMPLE_CODE}
            </SyntaxHighlighter>
            <blockquote>
              完璧なレイアウトを目指すより、「ガタつかない」を先に満たすほうが、使う人にとってはずっと大事だと思います。
            </blockquote>
            <h2>まとめ</h2>
            <p>
              派手な機能ではありませんが、毎日触る画面だからこそ、こういう地味な改善が効いてきます。同じところで悩んでいる人の参考になれば嬉しいです。
            </p>
          </section>
        </article>
      </div>

      <section className={styles.compare}>
        <h2>まとめて比較</h2>
        <p className={styles.note}>
          カードを押すと、上の記事の本文フォントがそれに切り替わります。
        </p>
        <div className={styles.grid}>
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              className={styles.card}
              aria-pressed={bodyId === font.id}
              onClick={() => {
                setBodyId(font.id)
                document
                  .getElementById('sample')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className={styles.cardMeta}>
                <span>{font.name}</span>
                <span>{GROUP_LABEL[font.group]}</span>
              </span>
              <span
                className={styles.cardHead}
                style={{ fontFamily: font.family }}
              >
                セルの高さが揃わない問題
              </span>
              <span
                className={styles.cardBody}
                style={{ fontFamily: font.family }}
              >
                朝 6 時の喫茶店で SwiftUI の List を直す。コーヒーは 2
                杯目。0123456789
              </span>
              <span className={styles.cardMeta}>{font.memo}</span>
            </button>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
