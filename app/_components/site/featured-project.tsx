import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/app/_components/ui/button'
import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { AreaFigure } from './area-figure'
import { textLinkClass } from './link-styles'
import { PhaseStrip } from './phase-strip'
import { SectionHeading, SectionLead, containerClass, screenSectionClass } from './section-heading'
import { TitleBlock } from './title-block'

// Wider than the other sections on desktop, so the area figure and the title block fit side by side.
const wideContainerClass = `${containerClass} lg:max-w-[1440px]`

// The home shows the first phases only; the project page tells the rest.
const PREVIEW_PHASES = 4

/** 03 Caso studio: a preview of the featured project that leads to its page and to all projects. */
export function FeaturedProject({ project, services, total }: { project: Project; services: Service[]; total: number }) {
  return (
    <section id="progetti" aria-labelledby="progetti-title" className={`${screenSectionClass} pb-16 sm:pb-28`}>
      <SectionHeading id="progetti-title" number="03" title="Caso" accent="Studio" className={`${wideContainerClass} pt-16 sm:mb-12`}>
        <SectionLead display>{project.title}</SectionLead>
      </SectionHeading>

      <div className={wideContainerClass}>
        <PhaseStrip images={project.gallery.slice(0, PREVIEW_PHASES)} height="home" />
      </div>

      <div className={`${wideContainerClass} grid gap-12 pt-16 sm:pt-24 lg:grid-cols-12`}>
        <div className="flex flex-wrap items-start gap-x-8 gap-y-7 lg:col-span-5">
          <AreaFigure project={project} />
          <div className="flex-1 basis-64">
            <TitleBlock project={project} services={services} columns={2} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-7 lg:col-span-6 lg:col-start-7">
          <p className="text-[17px] leading-[1.6] text-muted-foreground">{project.summary}</p>
          <a href={`/progetti/${project.slug}`} className={buttonVariants({ variant: 'outline', size: 'cta' })}>
            Leggi il caso studio <ArrowRightIcon aria-hidden />
          </a>
          <Link href="/progetti" className={`${textLinkClass} text-[15px]`}>
            Tutti i progetti · {total}
          </Link>
        </div>
      </div>
    </section>
  )
}
