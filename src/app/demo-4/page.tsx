import type { Metadata } from 'next'
import Studio from '@/components/Studio'

export const metadata: Metadata = { title: '데모 04 — 스튜디오' }

export default function Demo4() {
  return (
    <main className="page">
      <Studio />
    </main>
  )
}
