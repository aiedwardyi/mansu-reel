'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import HouseMark from './HouseMark'
import { FILMS, TOTAL_SECONDS, clip, src, timecode } from '@/lib/films'
import { useReelVideos } from '@/lib/useReelVideos'
import { useSmallScreen } from '@/lib/useSmallScreen'
import s from './Studio.module.css'

const N = FILMS.length
/** A client roster lists each house once, even though two of them have two films. */
const HOUSES = FILMS.filter((f, i) => FILMS.findIndex((g) => g.house === f.house) === i)

/** Reveals once and unobserves. IntersectionObserver rather than a scroll timeline, because Firefox still lacks one. */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current
    if (!host) return
    const marks = Array.from(host.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      marks.forEach((m) => m.classList.add(s.in))
      return
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add(s.in)
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )
    marks.forEach((m) => io.observe(m))
    return () => io.disconnect()
  }, [root])
}

export default function Studio() {
  const root = useRef<HTMLDivElement>(null)
  const small = useSmallScreen()

  useReveal(root)
  useReelVideos(root, small !== null)

  return (
    <div className={s.wrap} ref={root}>
      <header className={s.hero}>
        <p className={`u-data ${s.kicker}`} data-reveal>
          광고영상 · 서울
        </p>
        <h1 className={s.statement} data-reveal>
          <span className={s.lineBox}>
            <span className={s.lineIn}>15초.</span>
          </span>
          <span className={s.lineBox}>
            <span className={s.lineIn}>믿게 만드는 데</span>
          </span>
          <span className={s.lineBox}>
            <span className={s.lineIn}>주어진 시간.</span>
          </span>
        </h1>

        <div className={s.heroFoot} data-reveal>
          <p className={s.performer}>
            <span className={s.han}>박만수</span>
            <span className={`u-data ${s.performerRole}`}>출연</span>
          </p>
          <Link href="/demo-3" className={`u-label ${s.cta}`}>
            릴 보기
            <span className={s.ctaRule} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className={s.spec} data-reveal>
        <span className="u-data">{N}편</span>
        <span className="u-data u-dim">총 {timecode(TOTAL_SECONDS)}</span>
        <span className="u-data u-dim">21:9 · 24 fps</span>
        <span className="u-data u-dim">2026</span>
      </div>

      <section className={s.work} aria-labelledby="work-h">
        <div className={s.sectionHead} data-reveal>
          <h2 id="work-h" className={`u-label ${s.sectionTitle}`}>
            주요 작업
          </h2>
          <span className="u-data u-dim">
            01 — {String(N).padStart(2, '0')}
          </span>
        </div>

        {FILMS.map((f, i) => (
          <article key={f.slug} className={`${s.row} ${s[`v${i % 3}`]}`}>
            <div className={s.cap}>
              <div className={s.capIn} data-reveal>
                <p className={`u-data ${s.idx}`}>
                  <span className={s.idxNum}>{String(i + 1).padStart(2, '0')}</span>
                  {f.category}
                </p>
                <h3 className={s.title}>
                  {f.house}
                  {f.line && <span className={s.sub}>{f.line}</span>}
                </h3>
                <p className={s.product}>{f.product}</p>
                <p className={s.craft}>{f.craft}</p>
                <p className={`u-data u-dim ${s.where}`}>{f.location}</p>
              </div>
            </div>

            <figure className={s.media} data-reveal>
              <div className={s.curtain}>
                <video
                  className={s.video}
                  data-src={small !== null ? clip(f.slug, small) : undefined}
                  poster={src.poster(f.slug)}
                  preload="none"
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </figure>
          </article>
        ))}
      </section>

      <section className={s.roster} aria-labelledby="roster-h">
        <div className={s.sectionHead} data-reveal>
          <h2 id="roster-h" className={`u-label ${s.sectionTitle}`}>
            브랜드
          </h2>
          <span className="u-data u-dim">릴에 수록된 브랜드</span>
        </div>
        <ul className={s.marks} data-reveal>
          {HOUSES.map((f) => (
            <li key={f.slug} className={s.mark}>
              <HouseMark film={f} scale="inline" />
            </li>
          ))}
        </ul>
      </section>

      <footer className={s.end} data-reveal>
        <p className={s.endLine}>열한 편, 한 사람. 가까이서 볼수록 분명해집니다.</p>
        <p className={`u-data u-ko u-dim ${s.disclaimer}`}>
          이 사이트의 모든 영상은 생성된 것입니다. 언급된 브랜드는 제작에 관여하지 않았으며,
          제휴나 보증, 상업적 이용 관계가 없습니다.
        </p>
      </footer>
    </div>
  )
}
