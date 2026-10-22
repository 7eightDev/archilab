'use client'

import { MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Logo } from './logo'
import { containerClass } from './section-heading'

export interface NavLink {
  href: string
  label: string
}

const contactButtonClass =
  'inline-flex min-h-11 items-center bg-primary px-[18px] text-[13px] font-medium tracking-[.08em] text-primary-foreground transition-colors hover:bg-white'
const navLinkClass = 'py-3 font-heading text-[13px] tracking-[.22em] transition-colors hover:text-ottone'

/**
 * Sticky header. From 1024px the section links sit in the bar; below that they move into a
 * disclosure menu, and on phones "Contattami" moves into it as well.
 */
export function SiteHeader({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className={`${containerClass} flex min-h-[var(--header-height)] items-center justify-between gap-6`}>
        <a href="#top" aria-label="Archilab, torna all'inizio" className="flex items-center py-2">
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
      <div id={menuId} hidden={!open} className="border-t border-border lg:hidden">
        <ul className={`${containerClass} flex flex-col py-4`}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className={`${navLinkClass} flex min-h-11 items-center`}>
                {link.label.toUpperCase()}
              </a>
            </li>
          ))}
          <li className="pt-3 sm:hidden">
            <a href="#contatti" onClick={() => setOpen(false)} className={contactButtonClass}>
              Contattami
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
