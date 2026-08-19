'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HouseMark from './HouseMark'
import { FILMS, clip, src, timecode } from '@/lib/films'
import { useSmallScreen } from '@/lib/useSmallScreen'
import s from './Reel.module.css'
import { ringDelta, useFlick } from '@/lib/useFlick'

const N = FILMS.length
const WINDOW = 2.2

export default function Reel() {
  const plates = useRef<(HTMLElement | null)[]>([])
  const faces = useRef<(HTMLElement | null)[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const shown = useRef<boolean[]>(new Array(N).fill(false))
  const played = useRef(-1)

  const small = useSmallScreen()
  const [sound, setSound] = useState(false)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1, N - 1]))

  const onFrame = useCallback((p: number) => {
    for (let i = 0; i < N; i++) {
      const d = ringDelta(i, p, N)
      const near = Math.abs(d) <= WINDOW
      if (near) {
        const v = d.toFixed(4)
        plates.current[i]?.style.setProperty('--d', v)
        faces.current[i]?.style.setProperty('--d', v)
      }
      if (near !== shown.current[i]) {
        shown.current[i] = near
        plates.current[i]?.classList.toggle(s.off, !near)
        faces.current[i]?.classList.toggle(s.off, !near)
      }
    }
  }, [])

  const { index, goTo, bind } = useFlick({ count: N, loop: true, onFrame })

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
        // only a change of film rewinds; toggling sound mid-clip used to snap it back to frame one
        if (played.current !== index && v.currentTime > 0.06) v.currentTime = 0
        void v.play().catch(() => {})
      } else if (!v.paused) {
        v.pause()
      }
    })
    played.current = index
    // `small` is a dep because src only attaches after it resolves; without it nothing ever starts
  }, [index, sound, small])

  const film = FILMS[index] ?? FILMS[0]
  const isNear = (i: number) => Math.abs(ringDelta(i, index, N)) <= 1

  return (
    <div
      className={s.wrap}
      ref={bind}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Commercial films. Scroll, drag or use the arrow keys."
    >
      <div className={s.stage}>
        <div className={s.gate}>
            {FILMS.map((f, i) => (
              <figure
                key={f.slug}
                ref={(el) => {
                  plates.current[i] = el
                }}
                className={`${s.plate} ${s.off}`}
                aria-hidden={i !== index}
              >
                <video
                  ref={(el) => {
                    videos.current[i] = el
                  }}
                  className={s.video}
                  poster={src.poster(f.slug)}
                  src={small !== null && loaded.has(i) ? clip(f.slug, small) : undefined}
                  preload={isNear(i) ? 'auto' : 'none'}
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                />
              </figure>
            ))}
        </div>

        <div className={s.drumCol}>
          <div className={s.drum}>
            {FILMS.map((f, i) => (
              <div
                key={f.slug}
                ref={(el) => {
                  faces.current[i] = el
                }}
                className={`${s.face} ${s.off}`}
                aria-hidden={i !== index}
              >
                <HouseMark film={f} />
              </div>
            ))}
          </div>
        </div>

        <div className={s.caption}>
          <div className={s.captionMain}>
            <div className={s.captionRow}>
              <span className="u-data">
                {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </span>
              <span className="u-data u-dim">{film.category}</span>
              <span className="u-data u-dim">{timecode(15.09)}</span>
              <span className="u-data u-dim">21:9</span>
              <span className="u-data u-dim">24 fps</span>
            </div>
            <p className={s.product}>{film.product}</p>
          </div>
          <div className={s.captionSide}>
            <p className={`u-data ${s.location}`}>{film.location}</p>
            <p className={s.craft}>{film.craft}</p>
          </div>
        </div>

        <nav className={s.rail} aria-label="Jump to film" data-no-drag>
          {FILMS.map((f, i) => (
            <button
              key={f.slug}
              className={`${s.tick} ${i === index ? s.tickOn : ''}`}
              onClick={() => goTo(i)}
              aria-label={`${f.house} ${f.line}`.trim()}
              aria-current={i === index ? 'true' : undefined}
            >
              <span className={`u-data ${s.tickName}`}>{f.house}</span>
              <span className={s.tickBar} />
            </button>
          ))}
        </nav>
      </div>

      <footer className={s.foot}>
        <span className="u-data u-dim">Swipe, scroll or drag</span>
        <button
          className={`u-data ${s.sound} ${sound ? s.soundOn : ''}`}
          onClick={() => setSound((v) => !v)}
          data-no-drag
        >
          <span className={s.soundDot} aria-hidden="true" />
          Sound {sound ? 'on' : 'off'}
        </button>
      </footer>
    </div>
  )
}
