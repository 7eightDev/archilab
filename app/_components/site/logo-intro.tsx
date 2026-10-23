'use client'

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Logo } from './logo'

export const INTRO_STORAGE_KEY = 'archilab:intro-seen'
// The last lettering in logo.tsx ends at 2.9s; the finished mark holds for a second, then the screen fades.
export const INTRO_FADE_AT_MS = 3900
const FADE_MS = 800
const SKIPPED_FADE_MS = 400
const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchmove'] as const

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// Runs while the HTML is parsed, so the overlay is shown before the first paint.
const decideScript = `try{if(!localStorage.getItem("${INTRO_STORAGE_KEY}")&&!matchMedia("${REDUCED_MOTION}").matches)document.documentElement.setAttribute("data-intro","play")}catch(e){}`

function shouldPlay() {
  try {
    return !localStorage.getItem(INTRO_STORAGE_KEY) && !window.matchMedia(REDUCED_MOTION).matches
  } catch {
    return false
  }
}

// The stored flag only changes when the intro itself ends, and that re-renders through `done`.
const subscribeToNothing = () => () => {}

/**
 * First-visit intro: the mark draws itself on an empty petrolio screen, holds, then the whole screen
 * fades over the hero. Any key, click or scroll skips ahead to the fade.
 */
export function LogoIntro() {
  // The server always renders the overlay (CSS keeps it hidden until the inline script asks for it);
  // after hydration the client drops it for returning visitors.
  const play = useSyncExternalStore(subscribeToNothing, shouldPlay, () => true)
  const [done, setDone] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Asked directly: on hydration this effect runs before `play` switches to the client value.
    if (!shouldPlay()) return
    const root = document.documentElement
    // React's dev remount clears the attribute the inline script set on <html>.
    root.setAttribute('data-intro', 'play')

    let fading = false
    const finish = () => {
      try {
        localStorage.setItem(INTRO_STORAGE_KEY, '1')
      } catch {}
      root.removeAttribute('data-intro')
      setDone(true)
    }
    const fade = (duration: number) => {
      if (fading) return
      fading = true
      stopListening()
      const overlay = overlayRef.current
      if (!overlay || typeof overlay.animate !== 'function') return finish()

      // Completes any stroke still being drawn, so a skipped mark fades whole.
      overlay.dataset.skipped = ''
      overlay
        .animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in-out', fill: 'forwards' })
        .finished.then(finish, finish)
    }

    const timer = setTimeout(() => fade(FADE_MS), INTRO_FADE_AT_MS)
    const skip = () => fade(SKIPPED_FADE_MS)
    const stopListening = () => {
      clearTimeout(timer)
      for (const type of SKIP_EVENTS) window.removeEventListener(type, skip)
    }
    for (const type of SKIP_EVENTS) window.addEventListener(type, skip, { passive: true })
    return stopListening
  }, [])

  if (done || !play) return null

  return (
    <>
      <div ref={overlayRef} aria-hidden className="logo-intro fixed inset-0 z-50 items-center justify-center bg-background">
        <div className="w-[min(84vw,720px)]">
          {/* The viewBox leaves empty room right of the lettering: nudged so the drawing itself is centred. */}
          <Logo drawing className="relative left-[5%] block h-auto w-full" />
        </div>
      </div>
      {/* text/plain on the client: React only runs it from the server HTML, and warns about client-rendered scripts. */}
      <script
        type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: decideScript }}
      />
    </>
  )
}
