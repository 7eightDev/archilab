'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { GalleryImage } from '@/app/_domain/entities/shared'
import { microLabelClass } from './section-heading'

// Desktop photo heights: the project page gives few photos more room; the home preview is shorter.
const photoHeightClass = {
  detail: { few: 'lg:h-[560px]', many: 'lg:h-[500px]' },
  home: { few: 'lg:h-[460px]', many: 'lg:h-[460px]' },
}

/**
 * The project's phases, from one to eight photos. Phones: a vertical timeline · tablet: two columns ·
 * desktop: one row whose hovered or focused column widens and slides its description over the photo from the right.
 */
export function PhaseStrip({ images, height = 'detail' }: { images: GalleryImage[]; height?: 'detail' | 'home' }) {
  const [active, setActive] = useState<number | null>(null)
  // Desktop: while a phase is open the strip keeps its resting height. The narrowed neighbours rewrap their captions
  // onto an extra line, which would otherwise push the rest of the page down; those lines spill into the gap below.
  const [lockedHeight, setLockedHeight] = useState<number>()
  const stripRef = useRef<HTMLDivElement>(null)
  if (images.length === 0) return null

  const open = (index: number) => {
    if (active === null && stripRef.current && window.matchMedia?.('(min-width: 1024px)').matches) {
      setLockedHeight(stripRef.current.offsetHeight)
    }
    setActive(index)
  }
  const close = () => {
    setActive(null)
    setLockedHeight(undefined)
  }

  const few = images.length <= 2
  const activeGrow = few ? 1.4 : 2.2
  const heightClass = photoHeightClass[height][few ? 'few' : 'many']

  return (
    <div
      ref={stripRef}
      style={lockedHeight ? { height: lockedHeight } : undefined}
      className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:flex lg:gap-0 lg:pt-1.5"
      onMouseLeave={close}
    >
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          data-active={active === index}
          // Focusable when it has a description, so the keyboard can open it too.
          tabIndex={image.description ? 0 : undefined}
          onMouseEnter={() => open(index)}
          onFocus={() => open(index)}
          onBlur={close}
          style={{ flexGrow: active === index ? activeGrow : 1 }}
          className="group relative grid outline-none max-sm:border-l max-sm:border-ottone max-sm:pl-5 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-inset lg:min-w-0 lg:basis-0 lg:grid-rows-[56px_auto_1fr] lg:border-r lg:border-background motion-safe:lg:transition-[flex-grow] motion-safe:lg:duration-450 motion-safe:lg:ease-in-out"
        >
          <div className="relative pb-4 sm:h-14 sm:border-t sm:border-ottone sm:px-4 sm:pt-[22px] sm:pb-0">
            <span
              aria-hidden
              className="absolute top-0 -left-[26px] size-[11px] rounded-full border border-ottone bg-background sm:-top-1.5 sm:left-0"
            />
            {image.tag && <span className={`${microLabelClass} whitespace-nowrap`}>{image.tag}</span>}
          </div>
          <div className={`relative aspect-[4/3] overflow-hidden bg-secondary lg:col-start-1 lg:row-start-2 lg:aspect-auto ${heightClass}`}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {image.caption && (
            <figcaption className="pt-3.5 text-sm leading-[1.45] text-muted-foreground sm:px-4 lg:row-start-3">
              {image.caption}
            </figcaption>
          )}
          {image.description && (
            // Desktop: a full-height drawer, two thirds of the photo wide, clipped to the photo's cell and slid in from
            // the right once the phase is active, so it stays in the document for screen readers. Translucent petrolio
            // plus blur keeps the text legible over any photo. Absolute, so its text never stretches the photo's row and
            // pushes the caption down. Elsewhere it simply follows the caption.
            <div className="relative z-10 lg:col-start-1 lg:row-start-2 lg:overflow-hidden">
              <p className="pt-2 text-[15px] leading-[1.55] text-testo-3 sm:px-4 lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:w-2/3 lg:translate-x-full lg:flex-col lg:justify-end lg:border-l lg:border-ottone/50 lg:bg-[rgba(10,57,71,.7)] lg:px-[22px] lg:pt-[22px] lg:pb-8 lg:text-foreground lg:backdrop-blur-md motion-safe:lg:transition-transform motion-safe:lg:duration-450 motion-safe:lg:ease-out lg:group-data-[active=true]:translate-x-0 motion-safe:lg:group-data-[active=true]:delay-150">
                {image.description}
              </p>
            </div>
          )}
        </figure>
      ))}
    </div>
  )
}
