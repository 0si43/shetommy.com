import Link from 'next/link'

export default function Dev() {
  return (
      <>
        <h1>
          プライバシーポリシー
        </h1>
        <p>
          <Link href="/privacy_policy/wristcounter.html">
          WristCounter
          </Link>
        </p>
        <p>
          <Link href="/privacy_policy/wristcounter_jp.html">
          WristCounter（日本語）
          </Link>
        </p>
    </>
  )
}
