'use client';

import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Crosshair from '@/app/_components/ui/crosshair';
import { pad } from './format';
import { defaultHeroSlide, type HeroSlide } from './hero-slides';
import { ctaLinkClass } from './link-styles';
import { containerClass, screenHeightClass } from './section-heading';

const SWIPE_THRESHOLD_PX = 50;
const AUTOPLAY_MS = 6000;

// Hex of --ottone: the canvas cannot resolve CSS variables.
const CROSSHAIR_COLOR = '#bc9a62';

const carouselButtonClass =
  'flex size-11 cursor-pointer items-center justify-center border border-input transition-colors hover:border-foreground';

/** Full-bleed opening: the chosen projects' photos cross-fade, with the studio's promise over them. */
export function Hero({ slides: projectSlides }: { slides: HeroSlide[] }) {
  // Without chosen projects the studio's own photo stands alone, with no link and no controls.
  const slides = projectSlides.length > 0 ? projectSlides : [defaultHeroSlide];
  const carousel = slides.length > 1;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const slide = slides[index];
  const go = (step: number) =>
    setIndex((current) => (current + step + slides.length) % slides.length);
  // Hovering or focusing the hero holds the current photo, so nothing changes under the reader.
  const [held, setHeld] = useState(false);
  const autoplay = !held && carousel;

  // Keyed on index: a manual step restarts the countdown instead of cutting the new photo short.
  useEffect(() => {
    if (
      !autoplay ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = setTimeout(
      () => setIndex((current) => (current + 1) % slides.length),
      AUTOPLAY_MS
    );
    return () => clearTimeout(timer);
  }, [autoplay, index, slides.length]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Apertura"
      aria-roledescription="carosello"
      className={`${screenHeightClass} relative flex overflow-hidden bg-background`}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) go(distance < 0 ? 1 : -1);
      }}
    >
      {slides.map((item, itemIndex) => (
        <div
          key={item.image.src}
          aria-hidden={itemIndex !== index}
          data-active={itemIndex === index}
          className="absolute inset-0 opacity-0 transition-opacity duration-1500 ease-in-out data-[active=true]:opacity-100"
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

      <div
        className={`${containerClass} relative z-10 flex flex-col justify-between gap-10 pt-12 pb-14 max-sm:pb-28 lg:gap-12`}
      >
        {/* Margin note of the drawing sheet: kept out of the flow so it does not push the content below the fold. */}
        <span className="absolute top-12 right-6 hidden rotate-180 text-[11px] leading-none font-medium tracking-[.24em] text-muted-foreground [writing-mode:vertical-rl] sm:block">
          ARCHITETTO · FONDI (LT)
        </span>
        <div>
          {carousel && (
          <p
            className="flex items-start gap-2"
            aria-label={`Immagine ${index + 1} di ${slides.length}`}
          >
            <span
              aria-hidden
              className="font-heading text-5xl leading-[.9] font-light text-ottone sm:text-[clamp(48px,7vw,84px)]"
            >
              {pad(index + 1)}
            </span>
            <span
              aria-hidden
              className="mt-1.5 font-heading text-sm leading-none text-muted-foreground"
            >
              / {pad(slides.length)}
            </span>
          </p>
          )}
        </div>

        <div className="flex max-w-[700px] flex-col gap-[22px]">
          <span className="font-heading text-[13px] leading-[1.3] tracking-[.2em] text-ottone">
            {slide.kicker}
          </span>
          <h1 className="font-heading text-[clamp(34px,5.2vw,64px)] leading-[1.06] font-light tracking-[.02em]">
            Dal progetto alle pratiche in Comune, un solo architetto per tutta
            la casa.
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-testo-3">
            A Fondi e dintorni seguo architettura, interni e pratiche
            urbanistiche. Un unico incarico, dalla prima idea alla consegna
            delle chiavi.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#contatti" className={`${ctaLinkClass} max-sm:w-full`}>
              Raccontami la tua idea <ArrowRightIcon aria-hidden />
            </a>
          </div>
        </div>

        {/* Phones: a solid band pinned to the bottom of the hero, so the controls stay legible over any photo. */}
        <div className="flex items-center gap-2 max-sm:absolute max-sm:inset-x-0 max-sm:bottom-0 max-sm:min-h-[72px] max-sm:gap-3.5 max-sm:border-t max-sm:border-border max-sm:bg-background max-sm:px-4 max-sm:py-2.5">
          {carousel && (
            <div className="flex flex-none gap-2 max-sm:gap-1.5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Immagine precedente"
                className={carouselButtonClass}
              >
                <ArrowLeftIcon aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Immagine successiva"
                className={carouselButtonClass}
              >
                <ArrowRightIcon aria-hidden className="size-5" />
              </button>
            </div>
          )}
          {/* Silent while rotating on its own, or screen readers would announce a caption every 6 seconds. */}
          <div aria-live={autoplay ? 'off' : 'polite'} className="min-w-0 max-sm:flex-1 sm:ml-1.5">
            {slide.project && (
              <a
                href={slide.project.href}
                aria-label={`Guarda il progetto: ${slide.project.title}`}
                // The text is already near white, so hover is shown by shape: the caption underlines, the rule
                // lengthens and the arrow steps out, all without giving up contrast over the photo.
                className="group flex min-h-11 flex-col justify-center gap-1 px-1.5 text-sm text-foreground outline-offset-4 focus-visible:outline-2 focus-visible:outline-foreground sm:flex-row sm:items-center sm:justify-start sm:gap-3.5"
              >
                {slide.caption && (
                  <>
                    {/* Padding below, offset by the margin, so the truncating box does not clip the underline. */}
                    <span className="-mb-2 truncate pb-2 decoration-1 underline-offset-[6px] group-hover:underline max-sm:text-xs max-sm:text-muted-foreground">
                      {slide.caption}
                    </span>
                    <span aria-hidden className="h-px w-7 flex-none bg-current transition-[width] group-hover:w-10 max-sm:hidden" />
                  </>
                )}
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="underline decoration-1 underline-offset-[6px]">Guarda il progetto</span>
                  <ArrowUpRightIcon aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
