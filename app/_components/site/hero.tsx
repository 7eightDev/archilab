'use client'

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import Crosshair from '@/app/_components/ui/crosshair'
import type { HeroSlide } from './content'
import { pad } from './format'
import { ctaLinkClass, textLinkClass } from './link-styles'
import { containerClass, screenHeightClass } from './section-heading'

const SWIPE_THRESHOLD_PX = 50

// Hex of --ottone: the canvas cannot resolve CSS variables.
const CROSSHAIR_COLOR = '#bc9a62'

const carouselButtonClass =
  'flex size-11 cursor-pointer items-center justify-center border border-input transition-colors hover:border-foreground'


/** Full-bleed opening: three photos that cross-fade, with the studio's promise over them. */
export function Hero({ slides, showProjectLink }: { slides: HeroSlide[]; showProjectLink: boolean }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const slide = slides[index]
  const go = (step: number) => setIndex((current) => (current + step + slides.length) % slides.length)

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Apertura"
      aria-roledescription="carosello"
      className={`${screenHeightClass} relative flex overflow-hidden bg-background`}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const distance = event.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) go(distance < 0 ? 1 : -1)
      }}
    >
      {slides.map((item, itemIndex) => (
        <div
          key={item.image.src}
          aria-hidden={itemIndex !== index}
          data-active={itemIndex === index}
          className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out data-[active=true]:opacity-100"
        >
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="100vw"
            preload={itemIndex === 0}
            className="object-cover"
          />
        </div>
      ))}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,57,71,.92)_0%,rgba(10,57,71,.7)_45%,rgba(10,57,71,.25)_100%)] mask-[linear-gradient(to_bottom,#000_80%,transparent_96%)] max-sm:bg-[linear-gradient(180deg,rgba(10,57,71,.55)_0%,rgba(10,57,71,.85)_55%,rgba(10,57,71,.95)_100%)]"
      />
      {/* Drafting-table crosshair: drawn under the content (z-10) so it never covers text or the sticky header. */}
      <Crosshair
        containerRef={sectionRef}
        color={CROSSHAIR_COLOR}
        opacity={0.6}
        fade={0.6}
        smoothing={0.35}
        style={{ zIndex: 5 }}
      />

      <div className={`${containerClass} relative z-10 flex flex-col justify-between gap-10 pt-12 pb-14 lg:gap-12`}>
        {/* Margin note of the drawing sheet: kept out of the flow so it does not push the content below the fold. */}
        <span className="absolute top-12 right-6 hidden rotate-180 text-[11px] leading-none font-medium tracking-[.24em] text-muted-foreground [writing-mode:vertical-rl] sm:block">
          ARCHITETTO · FONDI (LT)
        </span>
        <div>
          <p className="flex items-start gap-2" aria-label={`Immagine ${index + 1} di ${slides.length}`}>
            <span aria-hidden className="font-heading text-5xl leading-[.9] font-light text-ottone sm:text-[clamp(48px,7vw,84px)]">
              {pad(index + 1)}
            </span>
            <span aria-hidden className="mt-1.5 font-heading text-sm leading-none text-muted-foreground">
              / {pad(slides.length)}
            </span>
          </p>
        </div>

        <div className="flex max-w-[700px] flex-col gap-[22px]">
          <span className="font-heading text-[13px] leading-[1.3] tracking-[.2em] text-ottone">{slide.kicker}</span>
          <h1 className="font-heading text-[clamp(34px,5.2vw,64px)] leading-[1.06] font-light tracking-[.02em]">
            Dal progetto alle pratiche in Comune, un solo architetto per tutta la casa.
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-testo-3">
            A Fondi e dintorni seguo architettura, interni e pratiche urbanistiche. Un unico incarico, dalla prima idea
            alla consegna delle chiavi.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#contatti" className={`${ctaLinkClass} max-sm:w-full`}>
              Raccontami la tua idea <ArrowRightIcon aria-hidden />
            </a>
            {showProjectLink && (
              <a href="#progetti" className={`${textLinkClass} inline-flex min-h-11 items-center text-[15px] font-medium`}>
                Guarda un progetto
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => go(-1)} aria-label="Immagine precedente" className={carouselButtonClass}>
            <ArrowLeftIcon aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Immagine successiva" className={carouselButtonClass}>
            <ArrowRightIcon aria-hidden className="size-5" />
          </button>
          <span aria-live="polite" className="text-[13px] text-muted-foreground max-sm:basis-full sm:ml-3">
            {slide.caption}
          </span>
        </div>
      </div>
    </section>
  )
}
