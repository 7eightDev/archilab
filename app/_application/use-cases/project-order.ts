import type { Project } from '@/app/_domain/entities/project'

/** Featured projects first, then the most recent; ties keep the data order because the sort is stable. */
export function byShowcaseOrder(a: Project, b: Project): number {
  return Number(b.featured) - Number(a.featured) || b.year - a.year
}
