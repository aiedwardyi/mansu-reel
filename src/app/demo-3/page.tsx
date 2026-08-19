import type { Metadata, Viewport } from 'next'
import Cut from '@/components/Cut'

export const metadata: Metadata = { title: 'Demo 03 — The Cut' }
export const viewport: Viewport = { themeColor: '#08080a' }

export default function Demo3() {
  return (
    <main className="page page--fixed">
      <Cut />
    </main>
  )
}
