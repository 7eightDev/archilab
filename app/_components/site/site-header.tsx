'use client'

import { ArrowRightIcon, MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { studio } from './content'
import { Logo } from './logo'
import { containerClass } from './section-heading'

export interface NavLink {
  href: string
  label: string
}

const contactButtonClass =
  'inline-flex min-h-11 items-center bg-primary px-[18px] text-[13px] font-medium tracking-[.08em] text-primary-foreground transition-colors hover:bg-white'
const navLinkClass = 'py-3 font-heading text-[13px] tracking-[.16em] transition-colors hover:text-ottone'

/**
 * Sticky header. From 1024px the section links sit in the bar; below that they move into a
 * menu that covers the whole viewport under the header, with "Contattami" and WhatsApp at the end.
 */
export function SiteHeader({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    // The menu exists only below 1024px: widening the window closes it.
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => desktop.matches && setOpen(false)
    // The page underneath must not scroll while the menu covers it.
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    menuRef.current?.querySelector('a')?.focus()
    return () => {
      document.documentElement.style.overflow = overflow
      document.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className={`${containerClass} flex min-h-[var(--header-height)] items-center justify-between gap-6`}>
        {/* data-intro-target: where the first-visit intro lands the mark (logo-intro.tsx). */}
        <a href="#top" aria-label="Archilab, torna all'inizio" data-intro-target className="flex items-center py-2">
          <Logo className="h-10 w-auto sm:h-[52px]" />
        </a>
        <nav aria-label="Principale" className="flex items-center gap-7">
          <ul className="hidden gap-7 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={navLinkClass}>
                  {link.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contatti" className={`${contactButtonClass} max-sm:hidden`}>
            Contattami
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => setOpen((isOpen) => !isOpen)}
            className="-mr-2.5 flex size-11 items-center justify-center lg:hidden"
          >
            {open ? <XIcon aria-hidden className="size-6" /> : <MenuIcon aria-hidden className="size-6" />}
          </button>
        </nav>
      </div>
      <div
        ref={menuRef}
        id={menuId}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-height)] bottom-0 overflow-y-auto overscroll-contain bg-background lg:hidden"
      >
        <div className={`${containerClass} flex min-h-full flex-col justify-between gap-12 pt-6 pb-[max(32px,env(safe-area-inset-bottom))]`}>
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href} className="border-b border-border">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-18 items-center justify-between font-heading text-[28px] font-light tracking-[.16em] transition-colors hover:text-ottone"
                >
                  {link.label.toUpperCase()}
                  <ArrowRightIcon aria-hidden className="size-5 text-ottone" />
                </a>
              </li>
            ))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="#contatti"
              onClick={() => setOpen(false)}
              className="flex min-h-13 items-center justify-center bg-primary text-[15px] font-medium tracking-[.04em] text-primary-foreground transition-colors hover:bg-white"
            >
              Contattami
            </a>
            <a
              href={studio.whatsappHref}
              target="_blank"
              rel="noopener"
              className="flex min-h-13 items-center justify-center border border-input text-[15px] font-medium tracking-[.04em] transition-colors hover:border-foreground"
            >
              Scrivimi su WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
