import type { Service } from '@/app/_domain/entities/service'
import { phases } from './content'
import { SectionHeading, SectionLead, containerClass, screenSectionClass } from './section-heading'

/** 02 Un solo percorso: the five phases on a brass line, then one column per area. */
export function ServicesPath({ services }: { services: Service[] }) {
  return (
    <section id="servizi" aria-labelledby="servizi-title" className={`${containerClass} ${screenSectionClass} relative pt-8 pb-16 sm:pt-16 sm:pb-28`}>
      <SectionHeading id="servizi-title" number="02" title="Un solo" accent="Percorso">
        <SectionLead>Tre competenze, un unico incarico. Ogni fase passa dalle stesse mani.</SectionLead>
      </SectionHeading>

      {/* Vertical on phones (line on the left), five columns on a top rule from 640px. */}
      <ol aria-label="Fasi" className="mb-14 grid gap-6 border-l border-ottone sm:grid-cols-5 sm:gap-0 sm:border-t sm:border-l-0">
        {phases.map((phase) => (
          <li key={phase.name} className="relative flex flex-col gap-1.5 pl-6 sm:pt-[22px] sm:pr-2 sm:pl-0">
            <span
              aria-hidden
              className="absolute top-1 -left-[6px] size-[11px] rounded-full border border-ottone bg-background sm:-top-[6px] sm:left-0"
            />
            <span className="font-heading text-lg leading-none tracking-[.14em] sm:text-[clamp(14px,1.8vw,20px)]">{phase.name}</span>
            <span className="text-xs leading-[1.4] text-muted-foreground">{phase.detail}</span>
          </li>
        ))}
      </ol>

      {/* Each card spans three subgrid rows (title, description, list) so the lists line up across columns. */}
      <div className="grid border-t border-border sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-0">
        {services.map((service) => (
          <article
            key={service.id}
            className="row-span-3 grid grid-rows-subgrid gap-y-3.5 border-b border-border py-8 sm:last:odd:col-span-2 lg:pr-7 lg:last:odd:col-span-1"
          >
            <h3 className="font-heading text-[28px] leading-[1.1] tracking-[.04em] text-ottone">{service.title}</h3>
            <p className="text-base leading-[1.6] text-muted-foreground">{service.description}</p>
            {service.items.length > 0 && (
              <ul className="flex flex-col">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-3 border-t border-border py-2.5 text-[15px]">
                    <span aria-hidden className="text-ottone">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
