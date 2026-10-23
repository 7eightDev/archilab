import type { ProjectCategory } from '@/app/_domain/entities/project'

/** Display names of the project categories. */
export const categoryLabels: Record<ProjectCategory, string> = {
  residenziale: 'Residenziale',
  commerciale: 'Commerciale',
  interni: 'Interni',
  ristrutturazione: 'Ristrutturazione',
  pubblico: 'Pubblico',
}
