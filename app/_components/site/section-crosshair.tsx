'use client'

import { useEffect, useRef, useState } from 'react'
import Crosshair from '@/app/_components/ui/crosshair'

// Hex of --ottone: the canvas cannot resolve CSS variables.
const CROSSHAIR_COLOR = '#bc9a62'

/**
 * The hero's drafting-table crosshair for a server-rendered section: it tracks the parent element
 * (which must be `relative`) and locks only onto elements marked `data-crosshair-target`.
 */
export function SectionCrosshair() {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const hostRef = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hostRef.current = anchorRef.current?.parentElement ?? null
    setReady(hostRef.current !== null)
  }, [])

  return (
    <>
      <span ref={anchorRef} hidden />
      {ready && (
        <Crosshair
          containerRef={hostRef}
          color={CROSSHAIR_COLOR}
          opacity={0.6}
          fade={0.6}
          smoothing={0.35}
          targetSelector="[data-crosshair-target]"
          style={{ zIndex: 5 }}
        />
      )}
    </>
  )
}
