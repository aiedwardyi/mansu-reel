'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './Nav.module.css'

const LINKS = [
  { href: '/', label: 'Home', short: '' },
  { href: '/demo-1', label: 'Demo 01', short: '01' },
  { href: '/demo-2', label: 'Demo 02', short: '02' },
  { href: '/demo-3', label: 'Demo 03', short: '03' },
  { href: '/about', label: 'About', short: 'About' },
]

export default function Nav() {
  const path = usePathname()
  const dark = path === '/demo-2' || path === '/demo-3'

  return (
    <header className={`${s.nav} ${dark ? s.dark : ''}`}>
      <Link href="/" className={s.brand} aria-label="MANSU — home">
        <span className={s.brandMark}>MANSU</span>
        <span className={`u-data ${s.brandSub}`}>Commercial film</span>
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
