'use client'

import { ArrowRightIcon, MapPinIcon, XIcon } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/app/_components/ui/dialog'
import { studio } from './content'
import { microLabelClass } from './section-heading'

/**
 * "Vieni a trovarmi": opens the studio map over the page. The Google Maps iframe is
 * mounted only while the dialog is open, so the page loads nothing from Google until asked.
 */
export function StudioMapDialog() {
  return (
    <Dialog>
      <DialogTrigger
        data-crosshair-target
        render={<Button variant="outline" size="sm" className="h-8 cursor-pointer gap-1.5 rounded-none px-3 text-[13px]" />}
      >
        <MapPinIcon aria-hidden className="size-3.5 text-ottone" />
        Vieni a trovarmi
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="inset-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-5 bg-background p-5 ring-0 sm:max-w-none sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className={microLabelClass}>LO STUDIO</p>
            <DialogTitle className="text-[26px] leading-[1.2] font-normal tracking-[.04em]">Ti aspetto a Fondi</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {studio.street}, {studio.postalCode} {studio.city} ({studio.province})
            </DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon-lg" className="-mt-1 -mr-2 size-11" />}>
            <XIcon aria-hidden className="size-6" />
            <span className="sr-only">Chiudi la mappa</span>
          </DialogClose>
        </div>
        <iframe
          title={`Mappa dello studio: ${studio.street}, ${studio.city}`}
          src={studio.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="min-h-0 w-full flex-1 border border-border"
        />
        <a
          href={studio.mapsUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center self-start font-medium transition-colors hover:text-ottone"
        >
          Apri in Google Maps <ArrowRightIcon aria-hidden className="ml-2 size-4" />
        </a>
      </DialogContent>
    </Dialog>
  )
}
