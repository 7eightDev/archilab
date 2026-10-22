import Image from 'next/image'
import { studio } from './content'
import { SectionHeading, containerClass } from './section-heading'

/** 01 Lo studio: who Maria is, with her portrait once the studio provides it. */
export function Studio() {
  const { portrait } = studio
  const signature = studio.registrationNumber
    ? `${studio.architect} · Iscritta all’${studio.order} n. ${studio.registrationNumber}`
    : `${studio.architect} · ${studio.order}`

  const heading = (
    <h3 className="font-heading text-[26px] leading-[1.2] tracking-[.02em] lg:text-[32px]">
      Sono Maria, architetto a Fondi. Ti seguo dalla prima idea alle chiavi.
    </h3>
  )
  const body = (
    <div className="flex max-w-[62ch] flex-col gap-[18px]">
      <p className="text-[17px] leading-[1.6] text-muted-foreground">
        Non devi cercare un tecnico per i permessi e un designer per gli spazi. Progetto la casa o il locale, scelgo con
        te materiali e luci, e porto io le pratiche all’Ufficio Tecnico del Comune.
      </p>
      <p className="text-[17px] leading-[1.6] text-muted-foreground">
        Hai sempre un solo referente, che conosce il tuo progetto in ogni dettaglio.
      </p>
      <p className="border-t border-border pt-3.5 text-[13px] text-muted-foreground">{signature}</p>
    </div>
  )

  return (
    <section id="studio" aria-labelledby="studio-title" className={`${containerClass} relative pt-16 pb-16 sm:pt-28 sm:pb-24`}>
      <SectionHeading id="studio-title" number="01" title="Lo" accent="Studio" className="sm:mb-16" />
      {portrait ? (
        <div className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="flex flex-col gap-[18px] lg:col-span-7">
            {heading}
            {body}
          </div>
          <figure className="flex flex-col gap-2.5 sm:max-w-[420px] lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[4/5] bg-secondary">
              <Image src={portrait.src} alt={portrait.alt} fill sizes="(min-width: 640px) 420px, 100vw" className="object-cover" />
            </div>
            <figcaption className="text-[13px] text-muted-foreground">Maria Pezzella nello studio di Fondi</figcaption>
          </figure>
        </div>
      ) : (
        // Without the portrait the section reads like a drawing sheet: statement on the left, text on the right.
        <div className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-5">{heading}</div>
          <div className="lg:col-span-6 lg:col-start-7">{body}</div>
        </div>
      )}
    </section>
  )
}
