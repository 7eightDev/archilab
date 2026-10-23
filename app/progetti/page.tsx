import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ClosingCta } from '@/app/_components/site/closing-cta'
import { FilterChips } from '@/app/_components/site/filter-chips'
import { GridLines } from '@/app/_components/site/grid-lines'
import { textLinkClass } from '@/app/_components/site/link-styles'
import { PAGE_INTRO_ID } from '@/app/_components/site/mobile-contact-bar'
import { FeaturedProjectRow, ProjectCard } from '@/app/_components/site/project-card'
import { categoryLabels } from '@/app/_components/site/project-labels'
import { containerClass } from '@/app/_components/site/section-heading'
import { type Project, type ProjectCategory, ProjectCategorySchema } from '@/app/_domain/entities/project'
import { listProjects } from '@/app/_infrastructure/container'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const description = 'Case, locali e una sala civica tra Fondi e il mare. Li ho seguiti tutti io, dal rilievo alla consegna.'

const gridClass = 'grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'

/** The category in `?categoria=`, when it names one exactly; anything else shows every project. */
export function parseCategory(value: string | string[] | undefined): ProjectCategory | undefined {
  const result = ProjectCategorySchema.safeParse(value)
  return result.success ? result.data : undefined
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const category = parseCategory((await searchParams).categoria)
  return {
    title: category ? `Progetti di ${categoryLabels[category]} · Archilab` : 'Progetti · Archilab',
    description,
  }
}

/** "10 progetti · 2018–2026", with the category in the middle when the list is filtered. */
function countLine(projects: Project[], category: ProjectCategory | undefined): string {
  const years = projects.map((project) => project.year)
  const [first, last] = [Math.min(...years), Math.max(...years)]
  return [
    projects.length === 1 ? '1 progetto' : `${projects.length} progetti`,
    category && categoryLabels[category],
    first === last ? String(first) : `${first}–${last}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Count, filter and projects: the part of the page that depends on the address. */
export async function ProjectsList({ searchParams }: { searchParams: SearchParams }) {
  const category = parseCategory((await searchParams).categoria)
  const { projects, counts, total } = await listProjects.execute({ category })
  const featured = projects.find((project) => project.featured)
  const others = projects.filter((project) => project !== featured)

  return (
    <>
      <div className={`${containerClass} relative flex flex-col items-center gap-6 pb-14 text-center`}>
        {projects.length > 0 && (
          <p data-testid="project-count" className="text-[13px] text-muted-foreground">
            {countLine(projects, category)}
          </p>
        )}
        <FilterChips counts={counts} total={total} active={category} />
      </div>
      <div className={`${containerClass} relative flex flex-col gap-18 pb-28`}>
        {projects.length === 0 ? (
          <p className="flex flex-col items-center gap-4 py-12 text-center text-[17px] text-muted-foreground">
            Non ci sono ancora progetti in questa categoria.
            <Link href="/progetti" className={textLinkClass}>
              Tutti i progetti
            </Link>
          </p>
        ) : (
          <>
            {featured && <FeaturedProjectRow project={featured} />}
            {others.length > 0 && (
              <ul className={gridClass}>
                {others.map((project) => (
                  <li key={project.id}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  )
}

/** Shown while the list waits for the address: six blocks shaped like the cards. */
function ProjectsListFallback() {
  return (
    <div className={`${containerClass} relative pt-[124px] pb-28`}>
      <div className={gridClass}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-[4/3] bg-secondary" />
        ))}
      </div>
    </div>
  )
}

export default function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <div className="relative">
        <GridLines />
        <div id={PAGE_INTRO_ID} className={`${containerClass} relative flex flex-col items-center gap-[18px] pt-16 pb-8 text-center sm:pt-26`}>
          <h1 className="font-heading text-[26px] leading-[1.1] font-light tracking-[.24em] sm:text-[40px]">
            TUTTI I <span className="text-ottone">PROGETTI</span>
          </h1>
          <p className="max-w-[760px] font-heading text-[19px] leading-[1.4] font-light tracking-[.01em] text-balance sm:text-2xl">{description}</p>
        </div>
        <Suspense fallback={<ProjectsListFallback />}>
          <ProjectsList searchParams={searchParams} />
        </Suspense>
      </div>
      <ClosingCta title="Hai un progetto simile?" />
    </>
  )
}
