/** @jest-environment node */
import { InMemoryProjectRepository } from '../repositories/in-memory-project-repository'
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository'
import { projects } from './projects'
import { services } from './services'

describe('studio data', () => {
  it('lists the three areas of the studio in order, each with its bullet list', async () => {
    const list = await new InMemoryServiceRepository(services).findAll()

    expect(list.map((service) => service.title)).toEqual(['Architettura', 'Interior', 'Pratiche urbanistiche'])
    for (const service of list) {
      expect(service.summary).toBeDefined()
      expect(service.items).toHaveLength(4)
    }
  })

  it('contains valid projects with at least one featured', async () => {
    const repository = new InMemoryProjectRepository(projects)

    expect((await repository.findAll()).length).toBeGreaterThan(0)
    expect((await repository.findFeatured()).length).toBeGreaterThan(0)
  })

  it('features only the apartment in Fondi', async () => {
    const featured = await new InMemoryProjectRepository(projects).findFeatured()

    expect(featured.map((project) => project.slug)).toEqual(['appartamento-fondi'])
    const [apartment] = featured
    expect(apartment.beforeImage).toBeDefined()
    expect(apartment.afterImage).toBeDefined()
    expect(apartment.gallery.map((image) => image.tag)).toEqual([
      'RILIEVO',
      'ARCHITETTURA',
      'PRATICHE',
      'CANTIERE',
      'INTERIOR',
      'CONSEGNA',
    ])
    expect(apartment.durationMonths).toBe(7)
    expect(apartment.permits).toEqual(['CILA'])
  })

  it('lists ten projects', async () => {
    expect(await new InMemoryProjectRepository(projects).findAll()).toHaveLength(10)
  })

  it('fills the hero positions 1 to 5 without gaps', async () => {
    const hero = await new InMemoryProjectRepository(projects).findInHero()

    expect(hero.map((project) => project.slug)).toEqual([
      'appartamento-fondi',
      'casa-sperlonga',
      'bar-fondi',
      'villetta-terracina',
      'sala-civica',
    ])
    expect(hero.map((project) => project.heroPosition)).toEqual([1, 2, 3, 4, 5])
  })

  it('keeps a project with minimal data', async () => {
    const kitchen = await new InMemoryProjectRepository(projects).findBySlug('cucina-monte-san-biagio')

    expect(kitchen?.areaSqm).toBeUndefined()
    expect(kitchen?.description).toBeUndefined()
    expect(kitchen?.beforeImage).toBeUndefined()
    expect(kitchen?.gallery).toHaveLength(2)
  })

  it('links projects only to existing services', async () => {
    const serviceIds = new Set(
      (await new InMemoryServiceRepository(services).findAll()).map((service) => service.id),
    )

    for (const project of await new InMemoryProjectRepository(projects).findAll()) {
      for (const serviceId of project.serviceIds) {
        expect(serviceIds).toContain(serviceId)
      }
    }
  })
})
