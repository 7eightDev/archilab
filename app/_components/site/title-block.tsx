import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { microLabelClass } from './section-heading'

export interface TitleBlockCell {
  label: string
  value: string
  /** Grid columns the cell covers. */
  span: number
}

/**
 * Title block entries ("cartiglio") laid out on a grid of `columns`: missing data leaves its cell out,
 * services take a full row in two columns, and the last cell of an incomplete row widens to close it.
 */
export function titleBlockCells(project: Project, services: Service[], columns: 2 | 4): TitleBlockCell[] {
  const serviceTitles = project.serviceIds
    .map((id) => services.find((service) => service.id === id)?.title)
    .filter((title) => title !== undefined)
  const { durationMonths } = project

  const entries = [
    { label: 'LUOGO', value: project.location },
    { label: 'SUPERFICIE', value: project.areaSqm && `${project.areaSqm} m²` },
    { label: 'INTERVENTO', value: project.scope },
    { label: 'ANNO', value: String(project.year) },
    { label: 'DURATA', value: durationMonths && `${durationMonths} ${durationMonths === 1 ? 'mese' : 'mesi'}` },
    { label: 'PRATICHE', value: project.permits.join(' · ') },
    { label: 'SERVIZI', value: serviceTitles.join(' · '), wide: columns === 2 },
  ].filter((entry): entry is { label: string; value: string; wide?: boolean } => Boolean(entry.value))

  const cells: TitleBlockCell[] = []
  let used = 0
  for (const { label, value, wide } of entries) {
    const span = wide ? columns : 1
    if (used + span > columns) {
      cells[cells.length - 1].span += columns - used
      used = 0
    }
    cells.push({ label, value, span })
    used = (used + span) % columns
  }
  if (used) cells[cells.length - 1].span += columns - used

  return cells
}

/** The project's title block, drawn as a ruled grid of label and value cells. */
export function TitleBlock({ project, services, columns }: { project: Project; services: Service[]; columns: 2 | 4 }) {
  const cells = titleBlockCells(project, services, columns)
  if (cells.length === 0) return null

  return (
    <dl
      aria-label="Scheda tecnica"
      className="grid border-t border-l border-input"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cells.map((cell) => (
        <div key={cell.label} className="border-r border-b border-input px-4 py-3.5" style={{ gridColumn: `span ${cell.span}` }}>
          <dt className={`${microLabelClass} mb-2`}>{cell.label}</dt>
          <dd className="text-[15px] leading-[1.4]">{cell.value}</dd>
        </div>
      ))}
    </dl>
  )
}
