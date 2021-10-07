export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''

// IDが取得できない場合を想定する
export const existsGaId = GA_ID !== ''

// PVを測定する
export const pageview = (path: string) => {
  window.gtag('config', GA_ID, {
    page_path: path,
  })
}
