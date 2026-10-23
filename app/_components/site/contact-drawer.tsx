'use client'

import { XIcon } from 'lucide-react'
import { createContext, type MouseEvent, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTitle } from '@/app/_components/ui/dialog'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { ContactForm } from './contact-form'
import { studio } from './content'
import { WhatsappIcon } from './whatsapp-icon'

interface ContactDrawerContextValue {
  open: (opener?: HTMLElement | null) => void
}

const ContactDrawerContext = createContext<ContactDrawerContextValue | null>(null)

/** Same look as the links in the contact section: no underline, brass on hover, 44px tall. */
const valueLinkClass = 'inline-flex items-center -my-2.5 py-2.5 transition-colors hover:text-ottone'

export function useContactDrawer(): { open: () => void } {
  const context = useContext(ContactDrawerContext)
  if (!context) throw new Error('useContactDrawer must be used inside ContactDrawerProvider')
  return { open: () => context.open() }
}

/**
 * Holds the contact drawer of the project pages. The panel stays mounted while closed, so a draft
 * survives closing it, and the focus goes back to whatever opened it.
 */
export function ContactDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)
  const open = useCallback((opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    setIsOpen(true)
  }, [])
  const value = useMemo(() => ({ open }), [open])

  return (
    <ContactDrawerContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal keepMounted>
          <DialogOverlay className="bg-[rgba(10,57,71,.7)] supports-backdrop-filter:backdrop-blur-none" />
          <DialogPrimitive.Popup
            finalFocus={openerRef}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col gap-10 overflow-y-auto overscroll-contain border-l border-border bg-background px-6 pt-6 pb-[max(32px,env(safe-area-inset-bottom))] outline-none transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full motion-reduce:transition-none sm:px-10"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-3 pt-2">
                {/* The label keeps the accent span from splitting the name into "Scrivi mi". */}
                <DialogTitle aria-label="Scrivimi" className="font-heading text-[40px] leading-none font-light tracking-[.04em]">
                  Scrivi<span className="text-ottone">mi</span>
                </DialogTitle>
                <p className="text-base leading-[1.6] text-muted-foreground">
                  Scrivimi due righe, anche se l’idea è ancora confusa.
                </p>
              </div>
              <DialogClose aria-label="Chiudi" className="-mr-2.5 flex size-11 shrink-0 items-center justify-center transition-colors hover:text-ottone">
                <XIcon aria-hidden className="size-6" />
              </DialogClose>
            </div>
            <div className="flex flex-wrap gap-x-6 text-base">
              <a href={studio.phoneHref} className={valueLinkClass}>
                {studio.phone}
              </a>
              <a href={studio.whatsappHref} target="_blank" rel="noopener" aria-label="Scrivimi su WhatsApp" className={valueLinkClass}>
                <span className="inline-flex items-center gap-2">
                  <WhatsappIcon className="size-5 text-ottone" />
                  WhatsApp
                </span>
              </a>
            </div>
            <ContactForm />
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </ContactDrawerContext.Provider>
  )
}

/**
 * A link to the contact form of the home that opens the drawer instead once JavaScript runs.
 * Clicks with a modifier key or a middle button keep the link's own behaviour (a new tab).
 */
export function ContactDrawerTrigger({
  className,
  onClick,
  children,
}: {
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  const context = useContext(ContactDrawerContext)

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!context || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onClick?.()
    context.open(event.currentTarget)
  }

  return (
    <a href="/#contatti" onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
