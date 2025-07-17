import '../styles/globals.css'
import usePageView from '../components/hooks/usePageView'
import GoogleAnalytics from '../components/GoogleAnalytics'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  usePageView()

  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
