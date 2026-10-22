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

  it('features the apartment in Fondi with its before/after pair and tagged gallery', async () => {
    const [featured] = await new InMemoryProjectRepository(projects).findFeatured()

    expect(featured.title).toBe('Un appartamento a Fondi, ripensato da zero')
    expect(featured.areaSqm).toBe(95)
    expect(featured.location).toBe('Fondi (LT)')
    expect(featured.beforeImage).toBeDefined()
    expect(featured.afterImage).toBeDefined()
    expect(featured.gallery.map((image) => image.tag)).toEqual(['RILIEVO', 'ARCHITETTURA', 'CANTIERE', 'INTERIOR'])
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
