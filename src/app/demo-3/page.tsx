import type { Metadata, Viewport } from 'next'
import Cut from '@/components/Cut'

export const metadata: Metadata = { title: '이어보기 · MANSU' }
export const viewport: Viewport = { themeColor: '#08080a' }

export default function Demo3() {
  return (
    <main className="page page--fixed">
      <Cut />
    </main>
  )
}
