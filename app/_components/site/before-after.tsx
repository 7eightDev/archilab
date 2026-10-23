'use client'

import { ChevronsLeftRightIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { Image as ImageData } from '@/app/_domain/entities/shared'

const badgeClass = 'pointer-events-none absolute top-3.5 px-2.5 py-1.5 text-[11px] leading-none font-medium tracking-[.16em]'
const sizes = '(min-width: 1024px) 560px, 100vw'

/** Before/after comparison: an invisible range input drives how much of the "after" photo is uncovered. */
export function BeforeAfter({ before, after }: { before: ImageData; after: ImageData }) {
  const [position, setPosition] = useState(50)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
        <Image src={before.src} alt={before.alt} fill sizes={sizes} className="object-cover" />
        <div data-testid="after-layer" className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <Image src={after.src} alt={after.alt} fill sizes={sizes} className="object-cover" />
        </div>
        <span className={`${badgeClass} left-3.5 bg-background`}>PRIMA</span>
        <span className={`${badgeClass} right-3.5 bg-primary text-primary-foreground`}>DOPO</span>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 -ml-px w-0.5 bg-primary" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 -left-[22px] -mt-[22px] flex size-11 items-center justify-center rounded-full bg-primary text-base text-primary-foreground">
            <ChevronsLeftRightIcon aria-hidden className="size-5" />
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Confronta prima e dopo"
          aria-valuetext={`${position}% dopo`}
          className="peer absolute inset-x-0 top-1/2 -mt-[22px] h-11 w-full cursor-ew-resize opacity-0"
        />
        {/* The range itself is invisible, so its keyboard focus is drawn on the frame. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-foreground" />
      </div>
      <p className="text-center text-xs text-muted-foreground">Trascina il cursore per confrontare</p>
    </div>
  )
}
