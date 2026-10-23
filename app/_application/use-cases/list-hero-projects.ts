import type { Project } from '@/app/_domain/entities/project'
import type { ProjectRepository } from '@/app/_domain/repositories/project-repository'

const HERO_LIMIT = 5

export class ListHeroProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /** Returns the hero projects in position order, at most five. */
  async execute(): Promise<Project[]> {
    return (await this.projectRepository.findInHero()).slice(0, HERO_LIMIT)
  }
}
