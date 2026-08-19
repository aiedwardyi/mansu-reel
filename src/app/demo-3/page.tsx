import type { Metadata, Viewport } from 'next'
import Cut from '@/components/Cut'

export const metadata: Metadata = { title: '데모 03 · 이어보기' }
export const viewport: Viewport = { themeColor: '#08080a' }

export default function Demo3() {
  return (
    <main className="page page--fixed">
      <Cut />
    </main>
  )
}
