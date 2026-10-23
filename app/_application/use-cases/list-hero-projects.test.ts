import { ListHeroProjects } from './list-hero-projects'
import { FakeProjectRepository, makeProject } from './testing/fake-project-repository'

class SixHeroProjects extends FakeProjectRepository {
  // The schema caps positions at 5; a future adapter might not, so the use case caps too.
  async findInHero() {
    return [1, 2, 3, 4, 5, 6].map((position) => makeProject({ slug: `p-${position}` }))
  }
}

describe('ListHeroProjects', () => {
  it('returns the hero projects in position order', async () => {
    const repository = new FakeProjectRepository([
      makeProject({ slug: 'secondo', heroPosition: 2 }),
      makeProject({ slug: 'fuori' }),
      makeProject({ slug: 'primo', heroPosition: 1 }),
    ])

    const projects = await new ListHeroProjects(repository).execute()

    expect(projects.map((project) => project.slug)).toEqual(['primo', 'secondo'])
  })

  it('keeps at most five projects', async () => {
    const projects = await new ListHeroProjects(new SixHeroProjects([])).execute()

    expect(projects.map((project) => project.slug)).toEqual(['p-1', 'p-2', 'p-3', 'p-4', 'p-5'])
  })
})
