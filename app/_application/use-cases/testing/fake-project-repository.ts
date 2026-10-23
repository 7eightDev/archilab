import type { Project } from '@/app/_domain/entities/project'
import type { ProjectFilter, ProjectRepository } from '@/app/_domain/repositories/project-repository'

export function makeProject(overrides: Partial<Project>): Project {
  return {
    id: overrides.slug ?? 'p-1',
    slug: 'villa-rossi',
    title: 'Villa Rossi',
    summary: 'Ristrutturazione di una villa.',
    category: 'residenziale',
    year: 2024,
    coverImage: { src: '/images/villa-rossi.jpg', alt: 'Facciata di Villa Rossi' },
    gallery: [],
    serviceIds: [],
    featured: false,
    permits: [],
    ...overrides,
  }
}

/** Test double that serves the given projects in the given order. */
export class FakeProjectRepository implements ProjectRepository {
  constructor(private readonly projects: Project[]) {}

  async findAll(filter: ProjectFilter = {}) {
    return this.projects.filter((project) => filter.category === undefined || project.category === filter.category)
  }

  async findBySlug(slug: string) {
    return this.projects.find((project) => project.slug === slug) ?? null
  }

  async findFeatured() {
    return this.projects.filter((project) => project.featured)
  }

  async findInHero() {
    return this.projects
      .filter((project) => project.heroPosition !== undefined)
      .sort((a, b) => a.heroPosition! - b.heroPosition!)
  }
}
