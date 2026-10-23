import { ChevronLeftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { AreaFigure } from './area-figure'
import { BeforeAfter } from './before-after'
import { GridLines } from './grid-lines'
import { PAGE_INTRO_ID } from './mobile-contact-bar'
import { PhaseStrip } from './phase-strip'
import { ProjectCard } from './project-card'
import { categoryLabels } from './project-labels'
import { ProjectPager } from './project-pager'
import { containerClass, microLabelClass } from './section-heading'
import { ServiceList } from './service-list'
import { TitleBlock } from './title-block'

const sectionTitleClass = 'font-heading text-2xl leading-[1.1] font-light tracking-[.24em] lg:text-[32px]'

/** "IL" + "RACCONTO": wide-tracked Oswald with the second word in brass. */
function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className={sectionTitleClass}>
      {title} <span className="text-ottone">{accent}</span>
    </h2>
  )
}

/** "Passa sopra una fase…" when some phase has a description to uncover, otherwise the number of photos. */
function phasesHint(project: Project): string {
  const { gallery } = project
  if (gallery.some((image) => image.description)) return 'Passa sopra una fase per leggere com’è andata.'
  return gallery.length === 1 ? '1 immagine' : `${gallery.length} immagini`
}

/** Says whether "Altri progetti" are all of the same category, or filled up with recent ones. */
function relatedNote(project: Project, related: Project[]): string {
  const category = categoryLabels[project.category]
  const sameCategory = related.filter((other) => other.category === project.category).length
  return sameCategory >= 3 ? `Della stessa categoria: ${category}` : `${category} e altri progetti recenti`
}

/** Desktop: the cover across the page under a petrolio veil, the text over it · phones: a 4:3 cover, the text below. */
function Opening({ project }: { project: Project }) {
  return (
    <div id={PAGE_INTRO_ID} className="lg:relative lg:h-[640px] lg:overflow-hidden">
      <div className="relative aspect-[4/3] bg-secondary lg:absolute lg:inset-0 lg:aspect-auto">
        <Image src={project.coverImage.src} alt={project.coverImage.alt} fill priority sizes="100vw" className="object-cover" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,57,71,.94)_0%,rgba(10,57,71,.72)_40%,rgba(10,57,71,0)_78%)] lg:block"
        />
      </div>
      <div className={`${containerClass} relative flex flex-col gap-3.5 pt-7 lg:h-full lg:justify-end lg:gap-5 lg:pt-0 lg:pb-16`}>
        <div className="flex flex-wrap items-center gap-3">
          {project.featured && <span className={`${microLabelClass} border border-ottone px-2 py-1.5`}>CASO STUDIO</span>}
          <span className={microLabelClass}>{`${categoryLabels[project.category].toUpperCase()} · ${project.year}`}</span>
        </div>
        <h1 className="max-w-[820px] font-heading text-[32px] leading-[1.1] font-light tracking-[.01em] text-balance lg:text-[60px] lg:leading-[1.06]">
          {project.title}
        </h1>
        <p className="max-w-[600px] text-[15px] leading-[1.6] text-pretty lg:text-[17px]">{project.summary}</p>
      </div>
    </div>
  )
}

/** Area figure and title block beside the story; without a story the data take the whole row. */
function DataAndStory({ project, services }: { project: Project; services: Service[] }) {
  const story = project.description?.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()) ?? []
  const hasStory = story.length > 0

  return (
    <section aria-label="Dati e racconto" className="relative">
      <GridLines />
      <div className={`${containerClass} relative grid items-start gap-x-6 gap-y-12 py-12 lg:grid-cols-12 lg:py-28`}>
        <div className={`flex flex-col gap-8 ${hasStory ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <AreaFigure project={project} />
          {hasStory ? (
            <TitleBlock project={project} services={services} columns={2} />
          ) : (
            // Four columns are too narrow for a phone, which keeps two.
            <>
              <div className="max-lg:hidden">
                <TitleBlock project={project} services={services} columns={4} />
              </div>
              <div className="lg:hidden">
                <TitleBlock project={project} services={services} columns={2} />
              </div>
            </>
          )}
        </div>
        {hasStory && (
          <div className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7 lg:gap-[22px]">
            <SectionTitle title="IL" accent="RACCONTO" />
            {story.map((paragraph, index) => (
              <p key={index} className="text-base leading-[1.65] text-pretty lg:text-[17px] lg:leading-[1.7]">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface ProjectDetailProps {
  project: Project
  /** Every service; the title block and "Cosa ho seguito" pick the project's own. */
  services: Service[]
  previous: Project | null
  next: Project | null
  related: Project[]
}

/** The project page told as a case study, from the opening photo to the links to the neighbours. */
export function ProjectDetail({ project, services, previous, next, related }: ProjectDetailProps) {
  const projectServices = project.serviceIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service) => service !== undefined)
  const { beforeImage, afterImage } = project

  return (
    <article>
      <div className={`${containerClass} py-1 lg:py-3`}>
        <Link href="/progetti" className="-ml-2 inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium transition-colors hover:text-ottone">
          <ChevronLeftIcon aria-hidden strokeWidth={1.5} className="size-[18px]" />
          Tutti i progetti
        </Link>
      </div>

      <Opening project={project} />
      <DataAndStory project={project} services={services} />

      {project.gallery.length > 0 && (
        <section aria-labelledby="fasi-title" className="pb-16 lg:pb-28">
          <div className={`${containerClass} flex items-end justify-between gap-6 pb-6 lg:pb-10`}>
            <h2 id="fasi-title" className={sectionTitleClass}>
              LE <span className="text-ottone">FASI</span>
            </h2>
            <span className="text-[13px] text-muted-foreground max-lg:hidden">{phasesHint(project)}</span>
          </div>
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
            <PhaseStrip images={project.gallery} />
          </div>
        </section>
      )}

      {beforeImage && afterImage && (
        <section aria-labelledby="prima-dopo-title" className="border-y border-border bg-secondary">
          <div className={`${containerClass} grid items-center gap-6 py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12 lg:py-28`}>
            <div className="flex flex-col gap-4 lg:gap-[18px]">
              <h2 id="prima-dopo-title" className={sectionTitleClass}>
                PRIMA E <span className="text-ottone">DOPO</span>
              </h2>
              <p className="text-[15px] leading-[1.6] text-muted-foreground lg:text-[17px]">
                Stesso punto di vista, prima del cantiere e il giorno della consegna.
              </p>
              <span className="text-[13px] text-muted-foreground max-lg:hidden">Trascina il cursore per confrontare.</span>
            </div>
            <BeforeAfter before={beforeImage} after={afterImage} />
          </div>
        </section>
      )}

      {projectServices.length > 0 && (
        <section aria-labelledby="seguito-title" className={`${containerClass} flex flex-col gap-4 pt-16 lg:gap-8 lg:pt-28`}>
          <h2 id="seguito-title" className={sectionTitleClass}>
            COSA HO <span className="text-ottone">SEGUITO</span>
          </h2>
          <ServiceList services={projectServices} />
        </section>
      )}

      <section aria-labelledby={related.length > 0 ? 'altri-title' : undefined} className={`${containerClass} flex flex-col gap-8 py-16 lg:py-28`}>
        {related.length > 0 && (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <h2 id="altri-title" className={sectionTitleClass}>
                ALTRI <span className="text-ottone">PROGETTI</span>
              </h2>
              <span className="text-[13px] text-muted-foreground">{relatedNote(project, related)}</span>
            </div>
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <li key={other.id}>
                  <ProjectCard project={other} size="small" />
                </li>
              ))}
            </ul>
          </>
        )}
        <div className={related.length > 0 ? 'mt-6' : undefined}>
          <ProjectPager previous={previous} next={next} />
        </div>
      </section>
    </article>
  )
}
