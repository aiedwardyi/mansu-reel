'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Options = {
  count: number
  axis?: 'y' | 'x'
  /** Wrap past the ends instead of stopping. */
  loop?: boolean
  /** Called every frame with the continuous position. Write styles here, never setState. */
  onFrame: (pos: number) => void
}

/** Shortest signed distance from pos to slide i on a ring of n. */
export function ringDelta(i: number, pos: number, n: number) {
  const d = (((i - pos) % n) + n) % n
  return d > n / 2 ? d - n : d
}

const STIFF = 150
const DAMP = 24
const IDLE_MS = 110

/**
 * Continuous slide position with spring snapping, driven by wheel, drag and keys.
 * Any deliberate gesture advances at least one slide - a hesitant nudge springs back.
 */
export function useFlick({ count, axis = 'y', loop = false, onFrame }: Options) {
  const [index, setIndex] = useState(0)
  const pos = useRef(0)
  const vel = useRef(0)
  const target = useRef(0)
  const frame = useRef(onFrame)
  const dragging = useRef(false)
  const scrubbing = useRef(false)
  const reduced = useRef(false)

  frame.current = onFrame

  const goTo = useCallback(
    (i: number) => {
      if (loop) {
        const base = Math.round(target.current)
        target.current = base + ringDelta(i, base, count)
      } else {
        target.current = Math.max(0, Math.min(count - 1, i))
      }
    },
    [count, loop],
  )

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let last = performance.now()
    let lastEmit = -1

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      if (!dragging.current && !scrubbing.current) {
        if (reduced.current) {
          pos.current = target.current
          vel.current = 0
        } else {
          const a = -STIFF * (pos.current - target.current) - DAMP * vel.current
          vel.current += a * dt
          pos.current += vel.current * dt
          if (Math.abs(pos.current - target.current) < 0.0004 && Math.abs(vel.current) < 0.004) {
            pos.current = target.current
            vel.current = 0
          }
        }
      }

      frame.current(pos.current)

      const raw = Math.round(pos.current)
      const near = loop ? ((raw % count) + count) % count : raw
      if (near !== lastEmit) {
        lastEmit = near
        setIndex(near)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, loop])

  /** Attach to the interactive surface. */
  const bind = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return

      const max = count - 1
      const clampSoft = (p: number) => {
        if (loop) return p
        if (p < 0) return p * 0.32
        if (p > max) return max + (p - max) * 0.32
        return p
      }
      const settleClamp = (v: number) => (loop ? v : Math.max(0, Math.min(max, v)))

      let idle: ReturnType<typeof setTimeout> | null = null
      let gestureStart = 0
      let gesturing = false

      const settle = () => {
        gesturing = false
        scrubbing.current = false
        const moved = pos.current - gestureStart
        target.current =
          Math.abs(moved) > 0.1
            ? Math.round(gestureStart) + Math.sign(moved) * Math.max(1, Math.round(Math.abs(moved)))
            : Math.round(pos.current)
        target.current = settleClamp(target.current)
      }

      const onWheel = (e: WheelEvent) => {
        const d = axis === 'y' ? e.deltaY : e.deltaX || e.deltaY
        if (!d) return
        e.preventDefault()
        if (!gesturing) {
          gesturing = true
          gestureStart = pos.current
        }
        scrubbing.current = true
        const px = e.deltaMode === 1 ? d * 22 : e.deltaMode === 2 ? d * 420 : d
        pos.current = clampSoft(pos.current + px / 330)
        vel.current = 0
        if (idle) clearTimeout(idle)
        idle = setTimeout(settle, IDLE_MS)
      }

      let pid = -1
      let startCoord = 0
      let startPos = 0
      let lastCoord = 0
      let lastT = 0
      let flickVel = 0
      let moved = false

      const span = () =>
        Math.max(240, axis === 'y' ? el.clientHeight * 0.62 : el.clientWidth * 0.62)

      const onDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        if ((e.target as HTMLElement).closest('[data-no-drag]')) return
        pid = e.pointerId
        dragging.current = true
        moved = false
        startCoord = lastCoord = axis === 'y' ? e.clientY : e.clientX
        startPos = pos.current
        lastT = performance.now()
        flickVel = 0
        el.setPointerCapture(pid)
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerId !== pid || !dragging.current) return
        const c = axis === 'y' ? e.clientY : e.clientX
        const now = performance.now()
        const dt = Math.max(now - lastT, 1)
        flickVel = ((lastCoord - c) / span() / dt) * 1000
        lastCoord = c
        lastT = now
        if (Math.abs(c - startCoord) > 4) moved = true
        pos.current = clampSoft(startPos + (startCoord - c) / span())
      }

      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pid) return
        dragging.current = false
        pid = -1
        if (!moved) return
        const projected = pos.current + flickVel * 0.16
        target.current = settleClamp(Math.round(projected))
        vel.current = 0
      }

      const onKey = (e: KeyboardEvent) => {
        const k = e.key
        const fwd = axis === 'y' ? ['ArrowDown', 'PageDown', ' '] : ['ArrowRight', 'PageDown', ' ']
        const back = axis === 'y' ? ['ArrowUp', 'PageUp'] : ['ArrowLeft', 'PageUp']
        if (fwd.includes(k)) {
          e.preventDefault()
          goTo(Math.round(target.current) + 1)
        } else if (back.includes(k)) {
          e.preventDefault()
          goTo(Math.round(target.current) - 1)
        } else if (k === 'Home') {
          e.preventDefault()
          target.current = 0
        } else if (k === 'End') {
          e.preventDefault()
          target.current = max
        }
      }

      el.addEventListener('wheel', onWheel, { passive: false })
      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
      el.addEventListener('keydown', onKey)

      return () => {
        if (idle) clearTimeout(idle)
        scrubbing.current = false
        el.removeEventListener('wheel', onWheel)
        el.removeEventListener('pointerdown', onDown)
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointercancel', onUp)
        el.removeEventListener('keydown', onKey)
      }
    },
    [count, axis, loop, goTo],
  )

  return { index, goTo, bind, pos }
}
