import type { Metadata } from 'next'
import Reel from '@/components/Reel'

export const metadata: Metadata = { title: '데모 01 · 릴' }

export default function Demo1() {
  return (
    <main className="page page--fixed">
      <Reel />
    </main>
  )
}
