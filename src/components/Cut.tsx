'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HouseMark from './HouseMark'
import { FILMS, REEL_SECONDS, TOTAL_SECONDS, clip, src, timecode } from '@/lib/films'
import { useSmallScreen } from '@/lib/useSmallScreen'
import s from './Cut.module.css'

const N = FILMS.length
const SPAN = N * REEL_SECONDS

function load(v: HTMLVideoElement | null, i: number, small: boolean) {
  if (!v) return
  v.poster = src.poster(FILMS[i].slug)
  v.src = clip(FILMS[i].slug, small)
  v.load()
}

export default function Cut() {
  const vids = useRef<(HTMLVideoElement | null)[]>([])
  const track = useRef<HTMLDivElement>(null)
  const clock = useRef<HTMLSpanElement>(null)

  const front = useRef(0)
  const cur = useRef(0)
  const audible = useRef(false)
  const stamp = useRef('')
  const lo = useRef(false)
  // A clip that never fires `ended` would strand the reel, so a run of failures has to give up rather than spin.
  const fails = useRef(0)
  const down = useRef<{ x: number; y: number } | null>(null)

  const small = useSmallScreen()

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [sound, setSound] = useState(false)

  const cut = useCallback((next: number) => {
    const inc = vids.current[1 - front.current]
    const out = vids.current[front.current]
    if (!inc) return
    // the incoming buffer already holds `next` with a decoded first frame, so raising it
    // before play() is what makes this a hard cut instead of a black frame
    inc.classList.add(s.live)
    out?.classList.remove(s.live)
    front.current = 1 - front.current
    cur.current = next
    inc.muted = !audible.current
    inc.currentTime = 0
    void inc.play().catch(() => setPlaying(false))
    if (out) {
      out.pause()
      load(out, (next + 1) % N, lo.current)
    }
    setIndex(next)
  }, [])

  const jump = useCallback(
    (i: number) => {
      if (i === (cur.current + 1) % N) return cut(i)
      const v = vids.current[front.current]
      cur.current = i
      setIndex(i)
      if (v) {
        load(v, i, lo.current)
        v.muted = !audible.current
        void v.play().catch(() => setPlaying(false))
      }
      load(vids.current[1 - front.current], (i + 1) % N, lo.current)
    },
    [cut],
  )

  const toggle = useCallback(() => {
    const v = vids.current[front.current]
    if (!v) return
    if (v.paused) {
      v.muted = !audible.current
      void v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [])

  useEffect(() => {
    if (small === null) return
    lo.current = small
    load(vids.current[0], 0, small)
    load(vids.current[1], 1, small)
    void vids.current[0]?.play().catch(() => {})
  }, [small])

  useEffect(() => {
    audible.current = sound
    vids.current.forEach((v, i) => {
      if (v) v.muted = !sound || i !== front.current
    })
  }, [sound])

  useEffect(() => {
    let id = 0
    const tick = () => {
      id = requestAnimationFrame(tick)
      const v = vids.current[front.current]
      if (!v) return
      const done = cur.current * REEL_SECONDS + Math.min(Math.max(v.currentTime, 0), REEL_SECONDS)
      track.current?.style.setProperty('--play', (done / SPAN).toFixed(5))
      const tc = timecode(done)
      if (tc !== stamp.current && clock.current) {
        stamp.current = tc
        clock.current.textContent = tc
      }
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        jump((cur.current + 1) % N)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        jump((cur.current - 1 + N) % N)
      } else if (e.key === ' ' && !(e.target as HTMLElement).closest('button')) {
        e.preventDefault()
        toggle()
      }
    },
    [jump, toggle],
  )

  const onDown = useCallback((e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onUp = useCallback(
    (e: React.PointerEvent) => {
      const d = down.current
      down.current = null
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) toggle()
        return
      }
      jump(dx < 0 ? (cur.current + 1) % N : (cur.current - 1 + N) % N)
    },
    [jump, toggle],
  )

  const onFail = useCallback(
    (v: HTMLVideoElement) => {
      if (!isFront(v) || fails.current >= N) return
      fails.current += 1
      cut((cur.current + 1) % N)
    },
    [cut],
  )

  const isFront = (v: HTMLVideoElement) => v === vids.current[front.current]
  const film = FILMS[index] ?? FILMS[0]

  return (
    <div
      className={s.wrap}
      tabIndex={0}
      role="region"
      aria-label="이어보기. 광고 영상 열한 편을 한 편처럼 이어서 재생합니다. 스페이스바로 재생과 정지, 방향키로 영상 이동."
      onKeyDown={onKey}
    >
      <div className={s.stage} onPointerDown={onDown} onPointerUp={onUp}>
        <div className={s.screen}>
          {[0, 1].map((b) => (
            <video
              key={b}
              ref={(el) => {
                vids.current[b] = el
              }}
              className={`${s.video} ${b === 0 ? s.live : ''}`}
              poster={src.poster(FILMS[b].slug)}
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              onEnded={(e) => isFront(e.currentTarget) && cut((cur.current + 1) % N)}
              onError={(e) => onFail(e.currentTarget)}
              onPlay={(e) => {
                if (!isFront(e.currentTarget)) return
                fails.current = 0
                setPlaying(true)
              }}
              onPause={(e) => isFront(e.currentTarget) && setPlaying(false)}
            />
          ))}

          <div className={s.meta} key={`m${index}`}>
            <p className={s.product}>{film.product}</p>
            <p className={`u-data ${s.where}`}>
              {film.category} · {film.location}
            </p>
          </div>

          <div className={s.lower} key={index} aria-hidden="true">
            <HouseMark film={film} scale="hero" />
          </div>
        </div>
      </div>

      <div className={s.rig}>
        <div className={s.timeline}>
          <div className={s.track} ref={track}>
            {FILMS.map((f, i) => (
              <button
                key={f.slug}
                className={`${s.seg} ${i === index ? s.segOn : ''}`}
                onClick={() => jump(i)}
                aria-label={`${f.house}${f.line ? ` ${f.line}` : ''} 재생`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
            <span className={s.head} aria-hidden="true" />
          </div>

          <div className={s.names} aria-hidden="true">
            {FILMS.map((f, i) => (
              <span key={f.slug} className={`u-data ${s.name} ${i === index ? s.nameOn : ''}`}>
                {f.house}
              </span>
            ))}
          </div>

          <p className={`u-data ${s.now}`} aria-hidden="true">
            {film.house}
          </p>
        </div>

        <div className={s.transport}>
          <div className={s.left}>
            <button className={`u-label ${s.play}`} onClick={toggle}>
              {playing ? '정지' : '재생'}
            </button>
            <span className={`u-data ${s.clock}`}>
              <span ref={clock}>00:00</span> / {timecode(TOTAL_SECONDS)}
            </span>
          </div>

          <button
            className={`u-data ${s.sound} ${sound ? s.soundOn : ''}`}
            onClick={() => setSound((v) => !v)}
          >
            <span className={s.soundDot} aria-hidden="true" />
            사운드 {sound ? '켜짐' : '꺼짐'}
          </button>
        </div>
      </div>
    </div>
  )
}
