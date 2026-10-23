import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/app/_domain/entities/project'
import { categoryLabels } from './project-labels'
import { microLabelClass } from './section-heading'

const cardLinkClass =
  'group flex flex-col gap-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-foreground'
// The photo grows a little under the mouse or the keyboard focus, unless motion is reduced.
const zoomClass =
  'object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100'
const lineClass = 'border-b border-border transition-colors group-hover:border-foreground group-focus-visible:border-foreground'
const titleHoverClass = 'transition-colors group-hover:text-ottone group-focus-visible:text-ottone'

/** "Fondi (LT) · 2023", or the year alone when the place is missing. */
function placeAndYear(project: Project): string {
  return [project.location, String(project.year)].filter(Boolean).join(' · ')
}

/** A project in the grid of /progetti, or in "Altri progetti" with `size="small"`. The whole card is one link. */
export function ProjectCard({ project, size = 'default' }: { project: Project; size?: 'default' | 'small' }) {
  const small = size === 'small'
  return (
    // Fills its grid row, with the place line at the bottom, so the rules under a row of cards line up.
    <a href={`/progetti/${project.slug}`} className={`${cardLinkClass} h-full`}>
      <div className={`relative overflow-hidden bg-secondary ${small ? 'aspect-[3/2]' : 'aspect-[4/3]'}`}>
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={zoomClass}
        />
      </div>
      <div className={`flex flex-1 flex-col gap-2 pb-4 ${lineClass}`}>
        <span className={microLabelClass}>{categoryLabels[project.category].toUpperCase()}</span>
        <div className="flex items-start justify-between gap-4">
          <h3 className={`font-heading text-[21px] leading-[1.25] tracking-[.02em] text-balance ${titleHoverClass}`}>
            {project.title}
          </h3>
          <ArrowUpRightIcon
            aria-hidden
            strokeWidth={1.5}
            className="mt-1 size-5 shrink-0 text-ottone opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
        </div>
        <span className="mt-auto text-[13px] text-muted-foreground">{placeAndYear(project)}</span>
      </div>
    </a>
  )
}

/** The featured project on a full row at the top of /progetti: photo on 8 columns, the story on 4. */
export function FeaturedProjectRow({ project }: { project: Project }) {
  return (
    <a href={`/progetti/${project.slug}`} className={`${cardLinkClass} lg:grid lg:grid-cols-12 lg:items-end lg:gap-10`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary lg:col-span-8">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className={zoomClass}
        />
      </div>
      <div className={`flex flex-col gap-[18px] pb-[18px] lg:col-span-4 ${lineClass}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`${microLabelClass} border border-ottone px-2 py-1.5`}>CASO STUDIO</span>
          <span className={microLabelClass}>{categoryLabels[project.category].toUpperCase()}</span>
        </div>
        <h2 className={`font-heading text-[30px] leading-[1.12] font-light tracking-[.01em] text-balance sm:text-[38px] ${titleHoverClass}`}>
          {project.title}
        </h2>
        <p className="text-[15px] leading-[1.6] text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-[13px] text-muted-foreground">{placeAndYear(project)}</span>
          <span className="inline-flex items-center gap-2 text-[15px] font-medium">
            Leggi il caso studio <ArrowRightIcon aria-hidden strokeWidth={1.5} className="size-[18px]" />
          </span>
        </div>
      </div>
    </a>
  )
}
