import { ArrowRightIcon } from 'lucide-react'
import { ContactDrawerTrigger } from './contact-drawer'
import { studio } from './content'
import { ctaLinkClass } from './link-styles'
import { PAGE_CTA_ID } from './mobile-contact-bar'
import { containerClass } from './section-heading'
import { WhatsappIcon } from './whatsapp-icon'

/** Band that closes the project pages: "Scrivimi" opens the contact drawer, WhatsApp opens a chat. */
export function ClosingCta({ title }: { title: string }) {
  return (
    <section id={PAGE_CTA_ID} aria-labelledby={`${PAGE_CTA_ID}-title`} className="border-t border-border bg-secondary">
      <div className={`${containerClass} grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12`}>
        <div className="flex flex-col gap-3.5 lg:col-span-7">
          <h2 id={`${PAGE_CTA_ID}-title`} className="font-heading text-[28px] leading-[1.15] font-light tracking-[.01em] text-balance sm:text-[40px]">
            {title}
          </h2>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-muted-foreground">
            Raccontami in due righe cosa hai in mente, anche se l’idea è ancora confusa. Ti rispondo io.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-7 lg:col-span-5 lg:justify-end">
          <ContactDrawerTrigger className={`${ctaLinkClass} max-sm:w-full`}>
            Scrivimi <ArrowRightIcon aria-hidden />
          </ContactDrawerTrigger>
          <a
            href={studio.whatsappHref}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-medium transition-colors hover:text-ottone"
          >
            <WhatsappIcon className="size-[18px] text-ottone" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
