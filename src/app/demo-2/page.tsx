import type { Metadata, Viewport } from 'next'
import Marquee from '@/components/Marquee'

export const metadata: Metadata = { title: '와이드 · MANSU' }
export const viewport: Viewport = { themeColor: '#08080a' }

export default function Demo2() {
  return (
    <main className="page page--fixed">
      <Marquee />
    </main>
  )
}
