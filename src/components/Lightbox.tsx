import { useEffect, useState } from 'react'
import styles from '../styles/Lightbox.module.css'

type Props = {
  src: string
  alt: string
  onClose: () => void
}

const ZOOM_STEP = 0.25
const MIN_SCALE = 0.5
const MAX_SCALE = 3

export default function Lightbox({ src, alt, onClose }: Props) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE))
  }

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation()
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_SCALE))
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
        ×
      </button>
      <div className={styles.imageWrapper} onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.image}
          src={src}
          alt={alt}
          style={{ transform: `scale(${scale})` }}
        />
        <div className={styles.zoomControls}>
          <button className={styles.zoomButton} onClick={zoomOut} aria-label="縮小">
            −
          </button>
          <button className={styles.zoomButton} onClick={zoomIn} aria-label="拡大">
            ＋
          </button>
        </div>
      </div>
    </div>
  )
}
