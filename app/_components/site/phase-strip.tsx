'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { GalleryImage } from '@/app/_domain/entities/shared'
import { microLabelClass } from './section-heading'

// Desktop photo heights: the project page gives few photos more room; the home preview is shorter.
const photoHeightClass = {
  detail: { few: 'lg:h-[560px]', many: 'lg:h-[500px]' },
  home: { few: 'lg:h-[460px]', many: 'lg:h-[460px]' },
}

/**
 * The project's phases, from one to eight photos. Phones: a vertical timeline · tablet: two columns ·
 * desktop: one row whose hovered or focused column widens and lifts its description over the photo.
 */
export function PhaseStrip({ images, height = 'detail' }: { images: GalleryImage[]; height?: 'detail' | 'home' }) {
  const [active, setActive] = useState<number | null>(null)
  if (images.length === 0) return null

  const few = images.length <= 2
  const activeGrow = few ? 1.4 : 2.2
  const heightClass = photoHeightClass[height][few ? 'few' : 'many']

  return (
    <div className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:flex lg:gap-0 lg:pt-1.5" onMouseLeave={() => setActive(null)}>
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          data-active={active === index}
          // Focusable when it has a description, so the keyboard can open it too.
          tabIndex={image.description ? 0 : undefined}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onBlur={() => setActive(null)}
          style={{ flexGrow: active === index ? activeGrow : 1 }}
          className="group relative grid outline-none max-sm:border-l max-sm:border-ottone max-sm:pl-5 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-inset lg:min-w-0 lg:basis-0 lg:grid-rows-[56px_auto_auto] lg:border-r lg:border-background motion-safe:lg:transition-[flex-grow] motion-safe:lg:duration-450 motion-safe:lg:ease-in-out"
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
            // Desktop: clipped to its own height in the photo's cell and slid out of view until the phase is active,
            // so it stays in the document for screen readers. Elsewhere it simply follows the caption.
            <div className="relative z-10 lg:col-start-1 lg:row-start-2 lg:self-end lg:overflow-hidden">
              <p className="pt-2 text-[15px] leading-[1.55] text-testo-3 sm:px-4 lg:translate-y-full lg:border-t lg:border-border lg:bg-background lg:px-[22px] lg:pt-[22px] lg:pb-6 motion-safe:lg:transition-transform motion-safe:lg:duration-450 motion-safe:lg:ease-in-out lg:group-data-[active=true]:translate-y-0">
                {image.description}
              </p>
            </div>
          )}
        </figure>
      ))}
    </div>
  )
}
