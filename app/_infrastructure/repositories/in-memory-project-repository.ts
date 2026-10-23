import { z } from 'zod'
import { type Project, ProjectSchema } from '@/app/_domain/entities/project'
import type { ProjectFilter, ProjectRepository } from '@/app/_domain/repositories/project-repository'
import { assertUniqueHeroPositions } from './assert-unique-hero-positions'
import { assertUniqueSlugs } from './assert-unique-slugs'

/** Serves projects from in-memory seed data, validated against the domain schema at construction. */
export class InMemoryProjectRepository implements ProjectRepository {
  private readonly projects: Project[]

  constructor(seed: unknown[]) {
    this.projects = z.array(ProjectSchema).parse(seed)
    assertUniqueSlugs(this.projects)
    assertUniqueHeroPositions(this.projects)
  }

  async findAll(filter: ProjectFilter = {}) {
    return this.projects
      .filter((project) => filter.category === undefined || project.category === filter.category)
      .map((project) => structuredClone(project))
  }

  async findBySlug(slug: string) {
    const project = this.projects.find((candidate) => candidate.slug === slug)
    return project ? structuredClone(project) : null
  }

  async findFeatured() {
    return this.projects.filter((project) => project.featured).map((project) => structuredClone(project))
  }

  async findInHero() {
    return this.projects
      .filter((project) => project.heroPosition !== undefined)
      .sort((a, b) => a.heroPosition! - b.heroPosition!)
      .map((project) => structuredClone(project))
  }
}
