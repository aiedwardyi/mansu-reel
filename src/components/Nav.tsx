'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './Nav.module.css'

const LINKS = [
  { href: '/', label: '홈', short: '' },
  { href: '/demo-1', label: '릴', short: '릴' },
  { href: '/demo-2', label: '와이드', short: '와이드' },
  { href: '/demo-3', label: '이어보기', short: '이어보기' },
  { href: '/demo-4', label: '스튜디오', short: '스튜디오' },
]

export default function Nav() {
  const path = usePathname()
  const dark = path === '/demo-2' || path === '/demo-3'

  return (
    <header className={`${s.nav} ${dark ? s.dark : ''}`}>
      <Link href="/" className={s.brand} aria-label="MANSU 홈">
        <span className={s.brandMark}>MANSU</span>
        <span className={`u-data ${s.brandSub}`}>광고영상</span>
      </Link>

      <nav className={s.links}>
        {LINKS.map((l) => {
          const active = path === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`u-label ${s.link} ${l.short ? '' : s.homeLink} ${active ? s.active : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className={s.full}>{l.label}</span>
              <span className={s.short} aria-hidden="true">
                {l.short}
              </span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
