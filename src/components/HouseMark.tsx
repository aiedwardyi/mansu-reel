import type { Film } from '@/lib/films'
import s from './HouseMark.module.css'

function Monogram({ kind }: { kind: 'chanel' | 'lv' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 4.2,
    strokeLinecap: 'round' as const,
  }
  return (
    <svg className={s.monogram} viewBox="0 0 110 64" aria-hidden="true">
      {kind === 'chanel' ? (
        <>
          <path d="M 26.6 54.3 A 26 30 0 1 0 26.6 9.7" {...common} />
          <path d="M 83.4 9.7 A 26 30 0 1 0 83.4 54.3" {...common} />
        </>
      ) : (
        <>
          <path d="M 32 12 L 32 52 L 62 52" {...common} />
          <path d="M 44 12 L 62 52 L 80 12" {...common} />
        </>
      )}
    </svg>
  )
}

type Props = {
  film: Film
  /** hero = the rotating drum face. inline = caption scale. */
  scale?: 'hero' | 'inline'
  className?: string
}

/** Wordmarks are set to a common measure, not a common point size - the way a lockup sheet does it. */
export default function HouseMark({ film, scale = 'hero', className = '' }: Props) {
  const advance = film.face === 'sans' ? 0.66 : 0.7
  const fit = film.house.length * (advance + film.track)

  return (
    <div className={`${s.box} ${className}`}>
      <div
        className={`${s.mark} ${scale === 'hero' ? s.hero : s.inline}`}
        style={{ ['--track' as string]: `${film.track}em`, ['--fit' as string]: fit }}
      >
        {scale === 'hero' && film.monogram && <Monogram kind={film.monogram} />}
        <span className={`${s.word} ${film.face === 'serif' ? s.serif : s.sans}`}>{film.house}</span>
        {film.line && (
          <span className={s.line}>
            <i className={s.tick} aria-hidden="true" />
            {film.line}
          </span>
        )}
      </div>
    </div>
  )
}
