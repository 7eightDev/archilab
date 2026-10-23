import type { Project, ProjectCategory } from '../entities/project'

export interface ProjectFilter {
  category?: ProjectCategory
}

export interface ProjectRepository {
  findAll(filter?: ProjectFilter): Promise<Project[]>
  /** Returns `null` when no project matches the slug. */
  findBySlug(slug: string): Promise<Project | null>
  findFeatured(): Promise<Project[]>
  /** Projects with a hero position, ordered by that position. */
  findInHero(): Promise<Project[]>
}
