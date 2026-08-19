import type { Metadata } from 'next'
import { FILMS } from '@/lib/films'
import s from './about.module.css'

export const metadata: Metadata = { title: 'About — MANSU' }

const METHOD = [
  [
    'One reference, one variable',
    'Every film runs off a single locked identity reference. When a take drifts, the fix is to simplify the shot, never to add more control words.',
  ],
  [
    'The package is checked, not guessed',
    'Product geometry, shade names and reference codes were read off each manufacturer\u2019s own current product page before the film was written.',
  ],
  [
    'Identity is gate zero',
    'A take is graded on likeness first. Stable staging and good light do not rescue a face that has drifted.',
  ],
  [
    'Behaviour over expression',
    'Nobody performs an emotion. Somebody wants something, something gets in the way, and the camera stays on the result.',
  ],
]

export default function About() {
  return (
    <main className="page">
      <div className={s.wrap}>
        <header className={s.head}>
          <p className="u-data u-dim">About the reel</p>
          <h1 className={s.title}>
            Eleven commercial films, made to find out what still breaks.
          </h1>
          <p className={s.lede}>
            Every film here stars my mother. They were shot over August 2026 as a private study
            slate: fifteen seconds, 21:9, 24 frames a second, one house at a time. The point was
            never to finish eleven adverts. It was to find the exact places a commercial falls
            apart, and then to stop them falling apart.
          </p>
        </header>

        <section className={s.block} aria-labelledby="method-h">
          <h2 id="method-h" className={`u-label ${s.blockHead}`}>
            Method
          </h2>
          <div className={s.methodGrid}>
            {METHOD.map(([t, b], i) => (
              <article key={t} className={s.method}>
                <span className={`u-data ${s.methodN}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.methodTitle}>{t}</h3>
                <p className={s.methodBody}>{b}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={s.block} aria-labelledby="tested-h">
          <h2 id="tested-h" className={`u-label ${s.blockHead}`}>
            What each film was testing
          </h2>
          <dl className={s.tested}>
            {FILMS.map((f) => (
              <div key={f.slug} className={s.testedRow}>
                <dt className={s.testedHouse}>
                  <span>{f.house}</span>
                  {f.line && <span className="u-data u-dim">{f.line}</span>}
                </dt>
                <dd className={s.testedCraft}>{f.craft}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={s.block} aria-labelledby="rights-h">
          <h2 id="rights-h" className={`u-label ${s.blockHead}`}>
            Rights and use
          </h2>
          <div className={s.rights}>
            <p>
              Every film on this site is generated. None of it is footage of a real campaign, and
              none of it was commissioned, reviewed or approved by the houses named.
            </p>
            <p>
              The house names and products appear because each film was built to reproduce a
              specific real object accurately. That is a craft exercise, not a claim. There is no
              affiliation, no endorsement, and nothing here is for sale or for commercial use.
            </p>
            <p>
              The performer appears with her consent, for this demonstration only. This site is
              unlisted and carries no search indexing.
            </p>
          </div>
        </section>

        <footer className={s.colophon}>
          <span className="u-data u-dim">
            Set in Bodoni Moda, Jost and IBM Plex Mono. Built with Next.js.
          </span>
          <span className="u-data u-dim">Private demo · 2026</span>
        </footer>
      </div>
    </main>
  )
}
