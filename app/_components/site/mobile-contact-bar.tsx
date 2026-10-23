'use client'

import { useEffect, useState } from 'react'
import { ContactDrawerTrigger } from './contact-drawer'
import { studio } from './content'

/** Ids the project pages give to their intro and to their closing call to action. */
export const PAGE_INTRO_ID = 'page-intro'
export const PAGE_CTA_ID = 'page-cta'

const writeClass =
  'flex min-h-12 items-center justify-center bg-primary text-[15px] font-medium tracking-[.04em] text-primary-foreground'

/**
 * Phones only: once the visitor has scrolled past the hero, keep "Scrivimi" and WhatsApp one tap
 * away. The bar steps aside as soon as the contact section reaches the screen, so it never covers
 * the form or the footer. `startId` and `endId` name those two sections on other pages; with
 * `drawer`, "Scrivimi" opens the contact drawer instead of scrolling.
 */
export function MobileContactBar({
  startId = 'top',
  endId = 'contatti',
  drawer = false,
}: {
  startId?: string
  endId?: string
  drawer?: boolean
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById(startId)
    const contact = document.getElementById(endId)
    if (!hero || !contact) return

    // Two rect reads per event are cheap, and React skips the render when the value is unchanged.
    const update = () => {
      const pastHero = hero.getBoundingClientRect().bottom < 0
      const contactInView = contact.getBoundingClientRect().top < window.innerHeight
      setVisible(pastHero && !contactInView)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [startId, endId])

  return (
    <div
      data-visible={visible}
      inert={!visible}
      className="fixed inset-x-0 bottom-0 z-30 translate-y-full border-t border-border bg-background px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out data-[visible=true]:translate-y-0 sm:hidden"
    >
      <div className="grid grid-cols-2 gap-3">
        {drawer ? (
          <ContactDrawerTrigger className={writeClass}>Scrivimi</ContactDrawerTrigger>
        ) : (
          <a href={`#${endId}`} className={writeClass}>
            Scrivimi
          </a>
        )}
        <a
          href={studio.whatsappHref}
          target="_blank"
          rel="noopener"
          className="flex min-h-12 items-center justify-center border border-input text-[15px] font-medium tracking-[.04em]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}
