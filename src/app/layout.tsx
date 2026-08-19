import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, IBM_Plex_Mono, Jost } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const serif = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MANSU 광고영상 릴',
  description: '열한 편의 광고영상.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
