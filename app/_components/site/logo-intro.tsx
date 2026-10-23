'use client'

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Logo } from './logo'

export const INTRO_STORAGE_KEY = 'archilab:intro-seen'
// The last lettering in logo.tsx ends at 2.9s; a short hold on the finished mark, then it flies.
export const INTRO_FLY_AT_MS = 3300
const FLY_MS = 800
const SKIPPED_FLY_MS = 450
const FLY_EASING = 'cubic-bezier(.65,0,.35,1)'
const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchmove'] as const

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// Runs while the HTML is parsed, so the overlay is shown (and the header logo hidden) before the first paint.
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
 * First-visit intro: the mark draws itself on an empty petrolio screen, then shrinks into the header logo
 * while the screen fades over the hero. Any key, click or scroll skips ahead to the flight.
 */
export function LogoIntro() {
  // The server always renders the overlay (CSS keeps it hidden until the inline script asks for it);
  // after hydration the client drops it for returning visitors.
  const play = useSyncExternalStore(subscribeToNothing, shouldPlay, () => true)
  const [done, setDone] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Asked directly: on hydration this effect runs before `play` switches to the client value.
    if (!shouldPlay()) return
    const root = document.documentElement
    // React's dev remount clears the attribute the inline script set on <html>.
    root.setAttribute('data-intro', 'play')

    let flying = false
    const finish = () => {
      try {
        localStorage.setItem(INTRO_STORAGE_KEY, '1')
      } catch {}
      root.removeAttribute('data-intro')
      setDone(true)
    }
    const fly = (duration: number) => {
      if (flying) return
      flying = true
      stopListening()
      const overlay = overlayRef.current
      const mark = markRef.current
      const target = document.querySelector('[data-intro-target] svg')
      if (!overlay || !backdropRef.current || !mark || !target || typeof mark.animate !== 'function') return finish()

      // Completes any stroke still being drawn, so a skipped mark flies whole.
      overlay.dataset.skipped = ''
      const from = mark.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      const dx = to.left + to.width / 2 - (from.left + from.width / 2)
      const dy = to.top + to.height / 2 - (from.top + from.height / 2)
      const timing = { duration, easing: FLY_EASING, fill: 'forwards' } as const
      backdropRef.current.animate([{ opacity: 1 }, { opacity: 0 }], timing)
      mark
        .animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})` }], timing)
        .finished.then(finish, finish)
    }

    const timer = setTimeout(() => fly(FLY_MS), INTRO_FLY_AT_MS)
    const skip = () => fly(SKIPPED_FLY_MS)
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
      <div ref={overlayRef} aria-hidden className="logo-intro fixed inset-0 z-50 items-center justify-center">
        <div ref={backdropRef} className="absolute inset-0 bg-background" />
        <div ref={markRef} className="relative w-[min(84vw,720px)]">
          <Logo drawing className="block h-auto w-full" />
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
