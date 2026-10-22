import { ArrowRightIcon } from 'lucide-react'
import { ContactForm } from './contact-form'
import { studio } from './content'
import { SectionHeading, SectionLead, containerClass, microLabelClass } from './section-heading'

const labelClass = `${microLabelClass} mb-1.5 text-[10px]`
/** Contact links without underline: they brighten to brass on hover instead. */
const plainLinkClass = 'inline-flex items-center transition-colors hover:text-ottone'
// 44px touch target that does not push the value away from its label.
const valueLinkClass = `${plainLinkClass} -my-2.5 py-2.5`

/** 05 Scrivimi: studio details beside the contact form (stacked below 1024px). */
export function Contact() {
  return (
    <section id="contatti" aria-labelledby="contatti-title" className="border-t border-border">
      <div className={`${containerClass} pt-16 pb-16 sm:pt-28 sm:pb-24`}>
        <SectionHeading id="contatti-title" number="05" title="Scrivi" accent="mi" joiner="">
          <SectionLead display>Scrivimi due righe, anche se l’idea è ancora confusa.</SectionLead>
        </SectionHeading>
        <div className="grid items-start gap-x-12 gap-y-14 lg:grid-cols-3">
          <address className="flex flex-col gap-5 text-base leading-[1.6] not-italic">
            <div>
              <p className={labelClass}>STUDIO</p>
              {studio.street}
              <br />
              {studio.postalCode} {studio.city} ({studio.province})
            </div>
            <div>
              <p className={labelClass}>TELEFONO E WHATSAPP</p>
              <div className="flex flex-wrap gap-x-6">
                <a href={studio.phoneHref} className={valueLinkClass}>
                  {studio.phone}
                </a>
                <a href={studio.whatsappHref} target="_blank" rel="noopener" className={valueLinkClass}>
                  Scrivimi su WhatsApp
                </a>
              </div>
            </div>
            <div>
              <p className={labelClass}>EMAIL</p>
              <a href={`mailto:${studio.email}`} className={valueLinkClass}>
                {studio.email}
              </a>
            </div>
            <a href={studio.mapsUrl} target="_blank" rel="noopener" className={`${plainLinkClass} min-h-11 self-start font-medium`}>
              Apri in Google Maps <ArrowRightIcon aria-hidden className="ml-2 size-4" />
            </a>
          </address>
          <div className="min-w-0 lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
