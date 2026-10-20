/** @jest-environment node */
import { InMemoryProjectRepository } from './in-memory-project-repository'

function rawProject(overrides: Record<string, unknown>) {
  return {
    id: 'p-1',
    slug: 'villa-rossi',
    title: 'Villa Rossi',
    summary: 'Ristrutturazione di una villa.',
    category: 'residenziale',
    year: 2024,
    coverImage: { src: '/images/villa-rossi.jpg', alt: 'Facciata di Villa Rossi' },
    ...overrides,
  }
}

const seed = [
  rawProject({ id: 'p-1', slug: 'villa-rossi', featured: true }),
  rawProject({ id: 'p-2', slug: 'negozio-centro', category: 'commerciale' }),
  rawProject({ id: 'p-3', slug: 'loft-chiaia', category: 'interni', featured: true }),
]

describe('InMemoryProjectRepository', () => {
  it('rejects seed data that does not match the Project schema', () => {
    expect(() => new InMemoryProjectRepository([rawProject({ slug: 'Villa Rossi' })])).toThrow()
  })

  it('rejects seed data with duplicate slugs', () => {
    expect(
      () => new InMemoryProjectRepository([rawProject({ id: 'a' }), rawProject({ id: 'b' })]),
    ).toThrow('villa-rossi')
  })

  it('applies schema defaults to the seed data', async () => {
    const [project] = await new InMemoryProjectRepository([rawProject({})]).findAll()

    expect(project.gallery).toEqual([])
    expect(project.featured).toBe(false)
  })

  it('returns all projects without a filter', async () => {
    const projects = await new InMemoryProjectRepository(seed).findAll()

    expect(projects.map((project) => project.id)).toEqual(['p-1', 'p-2', 'p-3'])
  })

  it('filters projects by category', async () => {
    const projects = await new InMemoryProjectRepository(seed).findAll({ category: 'interni' })

    expect(projects.map((project) => project.id)).toEqual(['p-3'])
  })

  it('does not let callers mutate the stored projects', async () => {
    const repository = new InMemoryProjectRepository(seed)

    const projects = await repository.findAll()
    projects.pop()
    projects[0].title = 'Modificato'

    const again = await repository.findAll()
    expect(again).toHaveLength(3)
    expect(again[0].title).toBe('Villa Rossi')
  })

  it('finds a project by slug', async () => {
    const project = await new InMemoryProjectRepository(seed).findBySlug('negozio-centro')

    expect(project?.id).toBe('p-2')
  })

  it('returns null for an unknown slug', async () => {
    expect(await new InMemoryProjectRepository(seed).findBySlug('inesistente')).toBeNull()
  })

  it('returns only featured projects', async () => {
    const projects = await new InMemoryProjectRepository(seed).findFeatured()

    expect(projects.map((project) => project.id)).toEqual(['p-1', 'p-3'])
  })
})
