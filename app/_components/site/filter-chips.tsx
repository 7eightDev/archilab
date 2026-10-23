import { type ProjectCategory, projectCategories } from '@/app/_domain/entities/project'
import { categoryLabels } from './project-labels'

const chipClass = 'inline-flex min-h-11 shrink-0 items-center gap-2.5 border px-4 text-sm font-medium transition-colors sm:px-[18px]'
const idleClass = 'border-input hover:border-foreground'
const activeClass = 'border-primary bg-primary text-primary-foreground'

function Chip({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <li>
      <a href={href} aria-current={active ? 'page' : undefined} className={`${chipClass} ${active ? activeClass : idleClass}`}>
        {label} <span className={`text-xs ${active ? '' : 'text-muted-foreground'}`}>{count}</span>
      </a>
    </li>
  )
}

/**
 * Category filter of /progetti as plain links, so it works without JavaScript and lives in the
 * address. Categories with the most projects come first; empty ones are left out.
 */
export function FilterChips({
  counts,
  total,
  active,
}: {
  counts: Partial<Record<ProjectCategory, number>>
  total: number
  active?: ProjectCategory
}) {
  const categories = projectCategories
    .filter((category) => (counts[category] ?? 0) > 0)
    .sort((a, b) => counts[b]! - counts[a]! || categoryLabels[a].localeCompare(categoryLabels[b], 'it'))

  return (
    <nav aria-label="Filtra per categoria">
      {/* On phones the chips scroll sideways, edge to edge. */}
      <ul className="-mx-6 flex gap-3 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip href="/progetti" label="Tutti" count={total} active={active === undefined} />
        {categories.map((category) => (
          <Chip
            key={category}
            href={`/progetti?categoria=${category}`}
            label={categoryLabels[category]}
            count={counts[category]!}
            active={category === active}
          />
        ))}
      </ul>
    </nav>
  )
}
