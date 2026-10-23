import { GetProject } from './get-project'
import { FakeProjectRepository, makeProject } from './testing/fake-project-repository'

const slugs = (projects: { slug: string }[]) => projects.map((project) => project.slug)

describe('GetProject', () => {
  it('returns null for an unknown slug', async () => {
    const repository = new FakeProjectRepository([makeProject({ slug: 'uno' })])

    expect(await new GetProject(repository).execute('inesistente')).toBeNull()
  })

  it('links previous and next in showcase order, wrapping around', async () => {
    const repository = new FakeProjectRepository([
      makeProject({ slug: 'terzo', year: 2020 }),
      makeProject({ slug: 'primo', year: 2025, featured: true }),
      makeProject({ slug: 'secondo', year: 2023 }),
    ])
    const getProject = new GetProject(repository)

    const first = await getProject.execute('primo')
    expect(first?.previous?.slug).toBe('terzo')
    expect(first?.next?.slug).toBe('secondo')

    const last = await getProject.execute('terzo')
    expect(last?.previous?.slug).toBe('secondo')
    expect(last?.next?.slug).toBe('primo')
  })

  it('has no previous or next when it is the only project', async () => {
    const result = await new GetProject(new FakeProjectRepository([makeProject({ slug: 'solo' })])).execute('solo')

    expect(result?.project.slug).toBe('solo')
    expect(result?.previous).toBeNull()
    expect(result?.next).toBeNull()
    expect(result?.related).toEqual([])
  })

  it('offers up to three related projects, same category first', async () => {
    const repository = new FakeProjectRepository([
      makeProject({ slug: 'corrente', category: 'interni', year: 2024 }),
      makeProject({ slug: 'altro-vecchio', category: 'pubblico', year: 2018 }),
      makeProject({ slug: 'interni-a', category: 'interni', year: 2020 }),
      makeProject({ slug: 'altro-recente', category: 'commerciale', year: 2026 }),
      makeProject({ slug: 'interni-b', category: 'interni', year: 2022 }),
      makeProject({ slug: 'altro-medio', category: 'residenziale', year: 2021 }),
    ])

    const result = await new GetProject(repository).execute('corrente')

    expect(slugs(result!.related)).toEqual(['interni-b', 'interni-a', 'altro-recente'])
  })
})
