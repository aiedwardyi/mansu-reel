'use client'

import { useEffect, useState } from 'react'

/** Null until mounted, so no video src is emitted server-side and the phone never starts the 1440p fetch. */
export function useSmallScreen() {
  const [small, setSmall] = useState<boolean | null>(null)
  useEffect(() => setSmall(window.matchMedia('(max-width: 820px)').matches), [])
  return small
}
