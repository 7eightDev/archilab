import { ListProjects } from './list-projects'
import { FakeProjectRepository, makeProject } from './testing/fake-project-repository'

const projects = [
  makeProject({ slug: 'vecchio', category: 'interni', year: 2019 }),
  makeProject({ slug: 'recente', category: 'interni', year: 2025 }),
  makeProject({ slug: 'in-evidenza', category: 'pubblico', year: 2021, featured: true }),
]

describe('ListProjects', () => {
  it('puts the featured project first, then the most recent', async () => {
    const result = await new ListProjects(new FakeProjectRepository(projects)).execute()

    expect(result.projects.map((project) => project.slug)).toEqual(['in-evidenza', 'recente', 'vecchio'])
  })

  it('filters by category', async () => {
    const result = await new ListProjects(new FakeProjectRepository(projects)).execute({ category: 'interni' })

    expect(result.projects.map((project) => project.slug)).toEqual(['recente', 'vecchio'])
  })

  it('counts every category over all projects, leaving out empty ones', async () => {
    const result = await new ListProjects(new FakeProjectRepository(projects)).execute({ category: 'interni' })

    expect(result.counts).toEqual({ interni: 2, pubblico: 1 })
  })

  it('reports the total over all projects', async () => {
    const result = await new ListProjects(new FakeProjectRepository(projects)).execute({ category: 'pubblico' })

    expect(result.total).toBe(3)
  })
})
