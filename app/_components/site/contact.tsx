import { ContactForm } from './contact-form'
import { studio } from './content'
import { SectionCrosshair } from './section-crosshair'
import { SectionHeading, SectionLead, containerClass, microLabelClass, screenSectionClass } from './section-heading'
import { StudioMapDialog } from './studio-map-dialog'
import { WhatsappIcon } from './whatsapp-icon'

const labelClass = `${microLabelClass} mb-2.5`
/** Contact links without underline: they brighten to brass on hover instead. */
const plainLinkClass = 'inline-flex items-center transition-colors hover:text-ottone'
// 44px touch target that does not push the value away from its label.
const valueLinkClass = `${plainLinkClass} -my-2.5 py-2.5`

/** 05 Scrivimi: studio details beside the contact form (stacked below 1024px). */
export function Contact() {
  return (
    <section id="contatti" aria-labelledby="contatti-title" className={`${screenSectionClass} relative overflow-hidden border-t border-border`}>
      {/* Same crosshair as the hero, under the content (z-10); it locks onto WhatsApp, the map and send buttons. */}
      <SectionCrosshair />
      <div className={`${containerClass} relative z-10 pt-16 pb-16 sm:pt-28 sm:pb-24`}>
        <SectionHeading id="contatti-title" number="05" title="Scrivi" accent="mi" joiner="">
          <SectionLead display>Scrivimi due righe, anche se l’idea è ancora confusa.</SectionLead>
        </SectionHeading>
        <div className="grid items-start gap-x-12 gap-y-14 lg:grid-cols-3">
          <address className="flex flex-col gap-9 text-base leading-[1.6] not-italic">
            <div>
              <p className={labelClass}>STUDIO</p>
              {studio.street}
              <br />
              {studio.postalCode} {studio.city} ({studio.province})
              <div className="mt-3">
                <StudioMapDialog />
              </div>
            </div>
            <div>
              <p className={labelClass}>TELEFONO E WHATSAPP</p>
              <div className="flex flex-wrap gap-x-6">
                <a href={studio.phoneHref} className={valueLinkClass}>
                  {studio.phone}
                </a>
                {/* The icon says WhatsApp on screen; the label says it to screen readers. */}
                <a
                  href={studio.whatsappHref}
                  target="_blank"
                  rel="noopener"
                  aria-label="Scrivimi su WhatsApp"
                  className={valueLinkClass}
                >
                  {/* Crosshair target on the visible text, not on the taller touch area that reaches the label. */}
                  <span data-crosshair-target className="inline-flex items-center gap-2">
                    <WhatsappIcon className="size-5 text-ottone" />
                    Scrivimi
                  </span>
                </a>
              </div>
            </div>
            <div>
              <p className={labelClass}>EMAIL</p>
              {/* Plain text on purpose: the form beside it is the way to write. */}
              {studio.email}
            </div>
          </address>
          <div className="min-w-0 lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
