import Image from 'next/image'
import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { BeforeAfter } from './before-after'
import { SectionHeading, SectionLead, containerClass, microLabelClass } from './section-heading'

/** Title block entries ("cartiglio") derived from the project; missing data leaves its cell out. */
function technicalSheet(project: Project, services: Service[]) {
  const serviceTitles = project.serviceIds
    .map((id) => services.find((service) => service.id === id)?.title)
    .filter((title) => title !== undefined)

  return [
    { label: 'LUOGO', value: project.location },
    { label: 'SUPERFICIE', value: project.areaSqm && `${project.areaSqm} m²` },
    { label: 'INTERVENTO', value: project.scope ?? project.summary },
    { label: 'SERVIZI', value: serviceTitles.join(' · ') },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value))
}

/** 03 Il progetto: photo strip, before/after slider, area figure and title block. */
export function FeaturedProject({ project, services }: { project: Project; services: Service[] }) {
  const sheet = technicalSheet(project, services)
  const { beforeImage, afterImage } = project

  return (
    <section id="progetti" aria-labelledby="progetti-title" className="pb-16 sm:pb-28">
      <SectionHeading id="progetti-title" number="03" title="Il" accent="Progetto" className={`${containerClass} pt-16 sm:mb-12`}>
        <SectionLead display>{project.title}</SectionLead>
      </SectionHeading>

      {project.gallery.length > 0 && (
        // Phones: stacked 4:3 · tablet: 2×2 grid · desktop: one row whose hovered column widens.
        <div className="grid sm:grid-cols-2 lg:flex">
          {project.gallery.map((image) => (
            <figure
              key={image.src}
              className="relative aspect-[4/3] overflow-hidden border-background sm:aspect-auto sm:min-h-80 lg:min-h-[440px] lg:flex-1 lg:border-r lg:transition-[flex-grow] lg:duration-300 lg:ease-in-out lg:hover:grow-[1.7]"
            >
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-linear-to-b from-[rgba(10,57,71,.85)] to-transparent" />
              {(image.tag || image.caption) && (
                <figcaption className="pointer-events-none absolute top-6 right-5 left-6 flex flex-col items-start gap-2.5">
                  {/* Solid chip: the tag stays legible on light photos too. */}
                  {image.tag && <span className={`${microLabelClass} bg-background px-2 py-1.5`}>{image.tag}</span>}
                  {image.caption && <span className="font-heading text-[19px] leading-[1.2] tracking-[.02em]">{image.caption}</span>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      <div className={`${containerClass} grid items-start gap-12 pt-16 sm:pt-24 lg:grid-cols-2`}>
        {beforeImage && afterImage && (
          <div className="flex flex-col gap-3">
            <BeforeAfter before={beforeImage} after={afterImage} />
            <p className="text-[13px] text-muted-foreground">
              Trascina il cursore per confrontare prima e dopo · foto provvisorie, da sostituire con quelle del cantiere
            </p>
          </div>
        )}
        <div className="flex flex-col gap-7">
          {project.areaSqm && (
            <p className="flex items-end gap-4">
              <span className="bg-[linear-gradient(135deg,#ECE5DA_10%,var(--ottone)_55%,#D8CDBF_90%)] inline-block bg-clip-text pt-[.06em] font-heading text-[clamp(96px,12vw,150px)] leading-none font-medium text-transparent">
                {project.areaSqm}
              </span>
              <span className="pb-1.5 font-heading text-[15px] leading-normal tracking-[.16em]">
                <span className="text-ottone">M² RIPENSATI</span>
                <br />
                DA ZERO
              </span>
            </p>
          )}
          {sheet.length > 0 && (
            <dl aria-label="Scheda tecnica" className="grid grid-cols-2 border border-input">
              {sheet.map((entry) => (
                <div key={entry.label} className="-mr-px -mb-px border-r border-b border-input px-4 py-3.5">
                  <dt className={`${microLabelClass} mb-2`}>{entry.label}</dt>
                  <dd className="text-[15px] leading-[1.4]">{entry.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {project.description && <p className="text-[17px] leading-[1.6] text-muted-foreground">{project.description}</p>}
        </div>
      </div>
    </section>
  )
}
