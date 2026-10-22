'use client'

import { useEffect, useState } from 'react'
import { studio } from './content'

/**
 * Phones only: once the visitor has scrolled past the hero, keep "Scrivimi" and WhatsApp one tap
 * away. The bar steps aside as soon as the contact section reaches the screen, so it never covers
 * the form or the footer.
 */
export function MobileContactBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const contact = document.getElementById('contatti')
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
  }, [])

  return (
    <div
      data-visible={visible}
      inert={!visible}
      className="fixed inset-x-0 bottom-0 z-30 translate-y-full border-t border-border bg-background px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out data-[visible=true]:translate-y-0 sm:hidden"
    >
      <div className="grid grid-cols-2 gap-3">
        <a
          href="#contatti"
          className="flex min-h-12 items-center justify-center bg-primary text-[15px] font-medium tracking-[.04em] text-primary-foreground"
        >
          Scrivimi
        </a>
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
