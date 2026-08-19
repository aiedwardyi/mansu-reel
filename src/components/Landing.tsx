'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import HouseMark from './HouseMark'
import { FILMS, src, timecode, TOTAL_SECONDS } from '@/lib/films'
import s from './Landing.module.css'

const DOORS = [
  {
    href: '/demo-1',
    n: '01',
    name: 'The Reel',
    blurb: 'One house at a time. Flick through it and the mark turns with the film.',
    poster: 'chanel-n5',
  },
  {
    href: '/demo-2',
    n: '02',
    name: 'Marquee',
    blurb: 'Edge to edge and dark. Drag sideways through the houses.',
    poster: 'lv-ombres',
  },
  {
    href: '/demo-3',
    n: '03',
    name: 'The Cut',
    blurb: 'All eleven end to end, on a timeline you can jump around.',
    poster: 'lamer-cream',
  },
]

const SPEC = [
  ['Films', String(FILMS.length)],
  ['Format', '21:9 · 1440 × 618'],
  ['Rate', '24 fps'],
  ['Running', timecode(TOTAL_SECONDS)],
  ['Year', '2026'],
]

const HERO_MS = 4600

export default function Landing() {
  const [hero, setHero] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const peek = useRef<HTMLDivElement>(null)
  const heroVideos = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const t = setInterval(() => setHero((i) => (i + 1) % FILMS.length), HERO_MS)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    heroVideos.current.forEach((v, i) => {
      if (!v) return
      if (i === hero) {
        v.currentTime = 0
        void v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [hero])

  useEffect(() => {
    const el = peek.current
    if (!el) return
    let raf = 0
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  const heroFilm = FILMS[hero]
  const near = (i: number) => i === hero || i === (hero + 1) % FILMS.length

  return (
    <div className={s.page}>
      <section className={s.masthead}>
        <h1 className={s.headline}>
          <span>One performer.</span>
          <span>Eleven houses.</span>
          <span>Fifteen seconds each.</span>
        </h1>
      </section>

      <section className={s.mastAside}>
        <p className={s.lede}>
          A commercial reel built to test what a commercial has to get right: skin, hair, fabric,
          glass, weight, and behaviour that comes from the scene rather than the lens.
        </p>
        <dl className={s.spec}>
          {SPEC.map(([k, v]) => (
            <div key={k} className={s.specRow}>
              <dt className="u-data u-dim">{k}</dt>
              <dd className="u-data">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={s.hero} aria-label="Reel preview">
        <div className={s.heroFrame}>
          {FILMS.map((f, i) => (
            <video
              key={f.slug}
              ref={(el) => {
                heroVideos.current[i] = el
              }}
              className={`${s.heroVideo} ${i === hero ? s.heroOn : ''}`}
              poster={src.poster(f.slug)}
              src={near(i) ? src.lo(f.slug) : undefined}
              preload={near(i) ? 'auto' : 'none'}
              muted
              playsInline
              loop
              aria-hidden={i !== hero}
            />
          ))}
        </div>
        <div className={s.heroCaption}>
          <span className="u-data">{String(hero + 1).padStart(2, '0')}</span>
          <HouseMark film={heroFilm} scale="inline" className={s.heroMark} />
          <span className="u-data u-dim">{heroFilm.product}</span>
        </div>
      </section>

      <section className={s.index} aria-labelledby="index-h">
        <header className={s.sectionHead}>
          <h2 id="index-h" className="u-label">
            The index
          </h2>
          <span className="u-data u-dim">Pick a row</span>
        </header>
        <ol className={s.rows}>
          {FILMS.map((f, i) => (
            <li key={f.slug}>
              <Link
                href="/demo-1"
                className={s.row}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                onFocus={() => setHover(i)}
                onBlur={() => setHover((h) => (h === i ? null : h))}
              >
                <span className={`u-data ${s.rowN}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.rowHouse}>{f.house}</span>
                <span className={s.rowProduct}>{f.product}</span>
                <span className={`u-data u-dim ${s.rowCat}`}>{f.category}</span>
                <span className={`u-data u-dim ${s.rowDur}`}>00:15</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.doors} aria-labelledby="doors-h">
        <header className={s.sectionHead}>
          <h2 id="doors-h" className="u-label">
            Three ways to watch
          </h2>
          <span className="u-data u-dim">Same eleven films</span>
        </header>
        <div className={s.doorGrid}>
          {DOORS.map((d) => (
            <Link key={d.href} href={d.href} className={s.door}>
              <div className={s.doorImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src.poster(d.poster)} alt="" loading="lazy" />
              </div>
              <div className={s.doorMeta}>
                <span className={`u-data ${s.doorN}`}>Demo {d.n}</span>
                <h3 className={s.doorName}>{d.name}</h3>
                <p className={s.doorBlurb}>{d.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className={s.foot}>
        <p className={`u-data u-dim ${s.disclaimer}`}>
          Every film here is generated. The houses named are not involved: no affiliation, no
          endorsement, no commercial use. Private demo.
        </p>
      </footer>

      <div
        ref={peek}
        className={`${s.peek} ${hover !== null ? s.peekOn : ''}`}
        aria-hidden="true"
      >
        {hover !== null && (
          <video
            key={FILMS[hover].slug}
            className={s.peekVideo}
            src={src.lo(FILMS[hover].slug)}
            poster={src.poster(FILMS[hover].slug)}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>
    </div>
  )
}
