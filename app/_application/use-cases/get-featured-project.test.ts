import type { Project } from '@/app/_domain/entities/project'
import type { ProjectRepository } from '@/app/_domain/repositories/project-repository'
import { GetFeaturedProject } from './get-featured-project'

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: 'p-1',
    slug: 'villa-rossi',
    title: 'Villa Rossi',
    summary: 'Ristrutturazione di una villa.',
    category: 'residenziale',
    year: 2024,
    coverImage: { src: '/images/villa-rossi.jpg', alt: 'Facciata di Villa Rossi' },
    gallery: [],
    serviceIds: [],
    featured: true,
    ...overrides,
  }
}

class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly projects: Project[]) {}

  async findAll() {
    return this.projects
  }

  async findBySlug(slug: string) {
    return this.projects.find((project) => project.slug === slug) ?? null
  }

  async findFeatured() {
    return this.projects.filter((project) => project.featured)
  }
}

describe('GetFeaturedProject', () => {
  it('returns null when no project is featured', async () => {
    const repository = new InMemoryProjectRepository([makeProject({ featured: false })])

    expect(await new GetFeaturedProject(repository).execute()).toBeNull()
  })

  it('returns the most recent featured project', async () => {
    const repository = new InMemoryProjectRepository([
      makeProject({ id: 'old', year: 2019 }),
      makeProject({ id: 'newest', year: 2025 }),
      makeProject({ id: 'not-featured', year: 2026, featured: false }),
      makeProject({ id: 'middle', year: 2022 }),
    ])

    const project = await new GetFeaturedProject(repository).execute()

    expect(project?.id).toBe('newest')
  })
})
