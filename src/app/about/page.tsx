import type { Metadata } from 'next'
import { FILMS } from '@/lib/films'
import s from './about.module.css'

export const metadata: Metadata = { title: '소개 · MANSU' }

const METHOD = [
  [
    '레퍼런스 하나, 변수 하나',
    '모든 영상은 고정된 인물 레퍼런스 하나로 간다. 테이크가 흔들리면 지시어를 늘리는 게 아니라 샷을 단순하게 줄인다.',
  ],
  [
    '패키지는 확인한다, 추측하지 않는다',
    '제품의 형태와 셰이드명, 품번은 대본을 쓰기 전에 각 브랜드 공식 제품 페이지에서 직접 확인했다.',
  ],
  [
    '인물이 첫 번째 관문',
    '테이크는 닮음부터 본다. 흔들린 얼굴은 안정된 구도와 좋은 빛으로도 살아나지 않는다.',
  ],
  [
    '표정보다 행동',
    '감정을 연기하지 않는다. 원하는 게 있고, 무언가가 그것을 가로막고, 카메라는 그 결과에 머무른다.',
  ],
]

export default function About() {
  return (
    <main className="page">
      <div className={s.wrap}>
        <header className={s.head}>
          <p className="u-data u-dim">릴 소개</p>
          <h1 className={s.title}>
            어디서 무너지는지 알아내려고 만든 광고 열한 편.
          </h1>
          <p className={s.lede}>
            모든 영상의 주연은 어머니다. 15초, 21:9, 초당 24프레임, 한 번에 한 하우스씩. 광고 열한 편을
            완성하는 게 목적이 아니었다. 광고가 무너지는 정확한 지점을 찾아내고, 무너지지 않게 만드는 게
            목적이었다.
          </p>
        </header>

        <section className={s.block} aria-labelledby="method-h">
          <h2 id="method-h" className={`u-label ${s.blockHead}`}>
            방법
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
            각 편이 시험한 것
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
            권리와 사용
          </h2>
          <div className={s.rights}>
            <p>
              이 사이트의 모든 영상은 생성된 것입니다. 실제 캠페인 영상이 아니며, 언급된 하우스가
              의뢰하거나 검수하거나 승인한 적이 없습니다.
            </p>
            <p>
              하우스명과 제품명이 등장하는 것은 각 영상이 실재하는 사물을 정확히 재현하는 것을 목표로
              했기 때문입니다. 기술 연습일 뿐 어떤 주장도 아닙니다. 제휴나 보증 관계는 없으며, 판매나
              상업적 용도로 사용되지 않습니다.
            </p>
            <p>
              출연자는 본인 동의 아래 등장합니다.
            </p>
          </div>
        </section>

        <footer className={s.colophon}>
          <span className="u-data u-dim">
            본문 서체 Bodoni Moda, Jost, IBM Plex Mono. Next.js로 제작.
          </span>
          <span className="u-data u-dim">2026</span>
        </footer>
      </div>
    </main>
  )
}
