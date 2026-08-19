'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HouseMark from './HouseMark'
import { FILMS, clip, src } from '@/lib/films'
import { useSmallScreen } from '@/lib/useSmallScreen'
import s from './Marquee.module.css'
import { ringDelta, useFlick } from '@/lib/useFlick'

const N = FILMS.length
const WINDOW = 2.2

export default function Marquee() {
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const slots = useRef<(HTMLElement | null)[]>([])
  const fills = useRef<(HTMLElement | null)[]>([])
  const shown = useRef<boolean[]>(new Array(N).fill(false))

  const small = useSmallScreen()
  const [sound, setSound] = useState(false)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1, N - 1]))

  const onFrame = useCallback((p: number) => {
    // The bed dissolves rather than cross-fades: the lower neighbour holds at full
    // opacity underneath while the upper one fades in over it, so no frame washes out.
    const base = Math.floor(p)
    const mix = p - base
    const under = ((base % N) + N) % N
    const over = ((base + 1) % N + N) % N

    for (let i = 0; i < N; i++) {
      const d = ringDelta(i, p, N)
      const near = Math.abs(d) <= WINDOW
      if (near) {
        const v = d.toFixed(4)
        slots.current[i]?.style.setProperty('--d', v)
        fills.current[i]?.style.setProperty('--d', v)
      }
      const vid = videos.current[i]
      if (vid) {
        const o = i === under ? 1 : i === over ? mix : 0
        vid.style.opacity = o.toFixed(3)
        vid.style.zIndex = i === over ? '2' : i === under ? '1' : '0'
      }
      if (near !== shown.current[i]) {
        shown.current[i] = near
        videos.current[i]?.classList.toggle(s.off, !near)
        slots.current[i]?.classList.toggle(s.off, !near)
      }
    }
  }, [])

  const { index, goTo, bind } = useFlick({ count: N, axis: 'x', loop: true, onFrame })

  useEffect(() => {
    setLoaded((prev) => {
      const next = new Set(prev)
      for (let k = -1; k <= 1; k++) next.add((index + k + N) % N)
      return next.size === prev.size ? prev : next
    })
  }, [index])

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return
      if (i === index) {
        v.muted = !sound
        void v.play().catch(() => {})
      } else if (!v.paused) {
        v.pause()
      }
    })
    // `small` is a dep because src only attaches after it resolves; without it nothing ever starts
  }, [index, sound, small])

  const film = FILMS[index] ?? FILMS[0]
  const isNear = (i: number) => Math.abs(ringDelta(i, index, N)) <= 1

  return (
    <div
      className={s.stage}
      ref={bind}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="광고 영상. 옆으로 스크롤하거나 드래그, 또는 좌우 방향키로 넘기세요."
    >
      <div className={s.bed}>
        {FILMS.map((f, i) => (
          <video
            key={f.slug}
            ref={(el) => {
              videos.current[i] = el
            }}
            className={`${s.video} ${s.off}`}
            poster={src.poster(f.slug)}
            src={small !== null && loaded.has(i) ? src.hi(f.slug) : undefined}
            preload={isNear(i) ? 'auto' : 'none'}
            aria-hidden={i !== index}
            loop
            muted
            playsInline
            disablePictureInPicture
          />
        ))}
      </div>

      <div className={s.veil} aria-hidden="true" />

      <div className={s.ribbon}>
        {FILMS.map((f, i) => (
          <div
            key={f.slug}
            ref={(el) => {
              slots.current[i] = el
            }}
            className={`${s.slot} ${s.off}`}
            aria-hidden={i !== index}
          >
            {/* The ghost keeps the sub-line's height with a nbsp, so the stroke lands on the wordmark alone. */}
            <HouseMark film={{ ...f, line: f.line && '\u00A0' }} scale="hero" className={s.ghost} />
            <div
              ref={(el) => {
                fills.current[i] = el
              }}
              className={s.solid}
            >
              <HouseMark film={f} scale="hero" />
            </div>
          </div>
        ))}
      </div>

      <div className={s.meta}>
        <span className="u-data">
          {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
        <p className={s.product}>{film.product}</p>
        <p className={`u-data ${s.place}`}>{film.location}</p>
      </div>

      <div className={s.foot}>
        <nav className={s.strip} aria-label="영상 바로가기" data-no-drag>
          {FILMS.map((f, i) => (
            <button
              key={f.slug}
              className={`${s.cell} ${i === index ? s.cellOn : ''}`}
              onClick={() => goTo(i)}
              aria-label={`${f.house} ${f.line}`.trim()}
              aria-current={i === index ? 'true' : undefined}
            >
              <img className={s.thumb} src={src.poster(f.slug)} alt="" width={92} height={40} loading="lazy" decoding="async" />
            </button>
          ))}
        </nav>

        <button
          className={`u-data ${s.sound} ${sound ? s.soundOn : ''}`}
          onClick={() => setSound((v) => !v)}
          data-no-drag
        >
          <span className={s.soundDot} aria-hidden="true" />
          사운드 {sound ? '켜짐' : '꺼짐'}
        </button>
      </div>
    </div>
  )
}
