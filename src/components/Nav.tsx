'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './Nav.module.css'

const LINKS = [
  { href: '/', label: '홈', short: '' },
  { href: '/demo-1', label: '데모 01', short: '01' },
  { href: '/demo-2', label: '데모 02', short: '02' },
  { href: '/demo-3', label: '데모 03', short: '03' },
  { href: '/demo-4', label: '데모 04', short: '04' },
  { href: '/about', label: '소개', short: '소개' },
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
