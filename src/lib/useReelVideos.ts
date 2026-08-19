'use client'

import { useEffect, type RefObject } from 'react'

const NEAR = '600px 0px'
const PLAY = 0.35

/**
 * Gates every `video[data-src]` under `root` on visibility.
 * iOS caps concurrent hardware decoders and fails silently to black rather than erroring,
 * so clips that drift far off screen hand their src back instead of merely pausing.
 */
export function useReelVideos(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const host = root.current
    if (!host || !enabled) return

    const vids = Array.from(host.querySelectorAll<HTMLVideoElement>('video[data-src]'))
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const attach = (v: HTMLVideoElement) => {
      if (v.getAttribute('src')) return
      const want = v.dataset.src
      if (want) v.setAttribute('src', want)
    }

    const detach = (v: HTMLVideoElement) => {
      if (!v.getAttribute('src')) return
      v.pause()
      v.removeAttribute('src')
      v.load()
    }

    const near = new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? attach(e.target as HTMLVideoElement) : detach(e.target as HTMLVideoElement))),
      { rootMargin: NEAR },
    )

    const live = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const v = e.target as HTMLVideoElement
          if (e.isIntersecting && e.intersectionRatio >= PLAY) {
            attach(v)
            if (!still) void v.play().catch(() => {})
          } else if (!v.paused) {
            v.pause()
          }
        }),
      { threshold: [0, PLAY] },
    )

    vids.forEach((v) => {
      near.observe(v)
      live.observe(v)
    })

    return () => {
      near.disconnect()
      live.disconnect()
    }
  }, [root, enabled])
}
