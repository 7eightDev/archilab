import Image from 'next/image'
import type { Service } from '@/app/_domain/entities/service'
import { studio } from './content'
import { pad } from './format'
import { SectionHeading, containerClass, microLabelClass } from './section-heading'

/** 01 Lo studio: who Maria is, what she covers, and her portrait. */
export function Studio({ services }: { services: Service[] }) {
  return (
    <section id="studio" aria-labelledby="studio-title" className={`${containerClass} relative pt-16 pb-16 sm:pt-28 sm:pb-24`}>
      <SectionHeading id="studio-title" number="01" title="Lo" accent="Studio" className="sm:mb-16" />
      <div className="grid items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-[18px] sm:col-span-2 lg:col-span-1">
          <h3 className="font-heading text-[26px] leading-[1.2] tracking-[.02em]">
            Sono Maria, architetto a Fondi. Ti seguo dalla prima idea alle chiavi.
          </h3>
          <p className="text-[17px] leading-[1.6] text-muted-foreground">
            Non devi cercare un tecnico per i permessi e un designer per gli spazi. Progetto la casa o il locale, scelgo
            con te materiali e luci, e porto io le pratiche all’Ufficio Tecnico del Comune.
          </p>
          <p className="text-[17px] leading-[1.6] text-muted-foreground">
            Hai sempre un solo referente, che conosce il tuo progetto in ogni dettaglio.
          </p>
          <p className="border-t border-border pt-3.5 text-[13px] text-muted-foreground">
            {studio.architect} · Iscritta all’{studio.registration}
          </p>
        </div>

        {services.length > 0 && (
          <div className="flex flex-col gap-[26px]">
            <h3 className="font-heading text-xl leading-none tracking-[.06em]">Cosa seguo:</h3>
            <ul className="flex flex-col gap-[26px]">
              {services.map((service, index) => (
                <li key={service.id} className="flex flex-col gap-1.5 border-l border-ottone pl-4">
                  <span className={microLabelClass}>{pad(index + 1)}</span>
                  <span className="text-sm leading-[1.2] font-medium tracking-[.2em] uppercase">{service.title}</span>
                  <span className="text-sm leading-normal text-muted-foreground">{service.summary ?? service.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <figure className="flex flex-col gap-2.5">
          <div className="relative aspect-[4/5] bg-secondary">
            {studio.portrait ? (
              <Image src={studio.portrait.src} alt={studio.portrait.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center p-6 text-center text-[13px] text-muted-foreground">
                Ritratto di Maria [DA FORNIRE]
              </span>
            )}
          </div>
          <figcaption className="text-[13px] text-muted-foreground">Maria Pezzella nello studio di Fondi</figcaption>
        </figure>
      </div>
    </section>
  )
}
