import { methodSteps } from './content'
import { pad } from './format'
import { SectionHeading, SectionLead, containerClass, screenSectionClass } from './section-heading'

/** 04 Come lavoro: four numbered steps on the alternate band. */
export function Method() {
  return (
    <section id="metodo" aria-labelledby="metodo-title" className={`${screenSectionClass} border-t border-border bg-secondary`}>
      <div className={`${containerClass} py-16 sm:py-24`}>
        <SectionHeading id="metodo-title" number="04" title="Come" accent="Lavoro">
          <SectionLead>Se sei all’inizio va benissimo: si parte da una chiacchierata.</SectionLead>
        </SectionHeading>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {methodSteps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2.5 border-t border-input pt-5">
              <span className="font-heading text-[44px] leading-none font-light text-ottone">{pad(index + 1)}</span>
              <h3 className="font-heading text-xl leading-[1.2] tracking-[.02em]">{step.title}</h3>
              <p className="text-[15px] leading-[1.6] text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
