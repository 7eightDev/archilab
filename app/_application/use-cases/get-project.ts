import type { Project } from '@/app/_domain/entities/project'
import type { ProjectRepository } from '@/app/_domain/repositories/project-repository'
import { byShowcaseOrder } from './project-order'

const RELATED_LIMIT = 3

export interface ProjectPage {
  project: Project
  /** Neighbours in showcase order, wrapping around; `null` when the project is the only one. */
  previous: Project | null
  next: Project | null
  /** Up to three other projects, those of the same category first. */
  related: Project[]
}

export class GetProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /** Returns `null` when no project matches the slug. */
  async execute(slug: string): Promise<ProjectPage | null> {
    const all = (await this.projectRepository.findAll()).sort(byShowcaseOrder)
    const index = all.findIndex((candidate) => candidate.slug === slug)
    if (index === -1) return null

    const project = all[index]
    const others = all.filter((candidate) => candidate !== project)
    const hasNeighbours = all.length > 1

    return {
      project,
      previous: hasNeighbours ? all[(index - 1 + all.length) % all.length] : null,
      next: hasNeighbours ? all[(index + 1) % all.length] : null,
      related: [
        ...others.filter((candidate) => candidate.category === project.category),
        ...others.filter((candidate) => candidate.category !== project.category),
      ].slice(0, RELATED_LIMIT),
    }
  }
}
