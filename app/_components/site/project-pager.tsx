import { ChevronLeftIcon, ChevronRightIcon, LayoutGridIcon } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/app/_domain/entities/project'
import { microLabelClass } from './section-heading'

const neighbourClass = 'flex min-h-16 items-center gap-4 px-3.5 py-3.5 transition-colors hover:text-ottone sm:px-0 sm:py-0 sm:min-h-11'
const arrowBoxClass = 'hidden size-11 shrink-0 items-center justify-center border border-input sm:flex'

/** One neighbour: the brass PRECEDENTE / SUCCESSIVO label over the title, the arrow on the outer side. */
function Neighbour({ project, direction }: { project: Project; direction: 'previous' | 'next' }) {
  const next = direction === 'next'
  const Arrow = next ? ChevronRightIcon : ChevronLeftIcon
  return (
    <a
      href={`/progetti/${project.slug}`}
      rel={next ? 'next' : 'prev'}
      className={`${neighbourClass} ${next ? 'flex-row-reverse text-right' : 'max-sm:border-r max-sm:border-input'}`}
    >
      <span aria-hidden className={arrowBoxClass}>
        <Arrow strokeWidth={1.5} className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className={microLabelClass}>{next ? 'SUCCESSIVO' : 'PRECEDENTE'}</span>
        <span className="font-heading text-[15px] leading-[1.25] text-balance sm:text-[17px]">{project.title}</span>
      </span>
    </a>
  )
}

/**
 * PRECEDENTE · Tutti i progetti · SUCCESSIVO in one ruled row; on phones the two neighbours share a row
 * and "Tutti i progetti" sits under them. Without neighbours only the link to the list is left.
 */
export function ProjectPager({ previous, next }: { previous: Project | null; next: Project | null }) {
  const alone = !previous && !next
  return (
    <nav
      aria-label="Navigazione fra progetti"
      className={
        alone
          ? 'flex justify-center border-y border-input py-3 sm:py-5'
          : 'grid grid-cols-2 border border-input sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-6 sm:border-x-0 sm:py-5'
      }
    >
      {!alone && (previous ? <Neighbour project={previous} direction="previous" /> : <span />)}
      <Link
        href="/progetti"
        className={
          alone
            ? 'inline-flex min-h-11 items-center gap-2.5 text-sm font-medium transition-colors hover:text-ottone'
            : 'col-span-2 flex min-h-13 items-center justify-center gap-2.5 border-t border-input text-sm font-medium transition-colors hover:text-ottone max-sm:order-last sm:col-span-1 sm:min-h-11 sm:border-x sm:border-t-0 sm:border-border sm:px-[18px]'
        }
      >
        <LayoutGridIcon aria-hidden strokeWidth={1.5} className="size-[18px]" />
        Tutti i progetti
      </Link>
      {!alone && (next ? <Neighbour project={next} direction="next" /> : <span />)}
    </nav>
  )
}
