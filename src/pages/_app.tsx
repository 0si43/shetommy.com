import '../styles/globals.css'
import usePageView from '../components/hooks/usePageView'
import GoogleAnalytics from '../components/googleAnalytics'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../context/ThemeContext'

function MyApp({ Component, pageProps }: AppProps) {
  usePageView()

  return (
    <ThemeProvider>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default MyApp
