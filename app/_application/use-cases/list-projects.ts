import type { Project, ProjectCategory } from '@/app/_domain/entities/project'
import type { ProjectRepository } from '@/app/_domain/repositories/project-repository'
import { byShowcaseOrder } from './project-order'

export interface ProjectList {
  projects: Project[]
  /** Projects per category over all projects; categories without projects are left out. */
  counts: Partial<Record<ProjectCategory, number>>
  total: number
}

export class ListProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: { category?: ProjectCategory } = {}): Promise<ProjectList> {
    const all = await this.projectRepository.findAll()
    const counts: Partial<Record<ProjectCategory, number>> = {}
    for (const { category } of all) counts[category] = (counts[category] ?? 0) + 1

    return {
      projects: all
        .filter((project) => input.category === undefined || project.category === input.category)
        .sort(byShowcaseOrder),
      counts,
      total: all.length,
    }
  }
}
