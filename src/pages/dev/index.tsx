import Link from 'next/link'

export default function Dev() {
  return (
    <>
      <h1>
        プライバシーポリシー
      </h1>
      <p>
        <Link href="/privacy_policy/wristcounter.html">
        <a>WristCounter</a>
        </Link>
      </p>
      <p>
        <Link href="/privacy_policy/wristcounter_jp.html">
        <a>WristCounter（日本語）</a>
        </Link>
      </p>
    </>
  )
}
