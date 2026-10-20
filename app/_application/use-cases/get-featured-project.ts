import type { Project } from '@/app/_domain/entities/project'
import type { ProjectRepository } from '@/app/_domain/repositories/project-repository'

export class GetFeaturedProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /** Returns the most recent featured project, or `null` when none is featured. */
  async execute(): Promise<Project | null> {
    const featured = await this.projectRepository.findFeatured()

    return featured.reduce<Project | null>(
      (latest, project) => (latest === null || project.year > latest.year ? project : latest),
      null,
    )
  }
}
