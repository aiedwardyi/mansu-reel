import type { Metadata } from 'next'
import Reel from '@/components/Reel'

export const metadata: Metadata = { title: 'Demo 01 — The Reel' }

export default function Demo1() {
  return (
    <main className="page page--fixed">
      <Reel />
    </main>
  )
}
