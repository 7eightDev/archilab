/** @jest-environment node */
import { InMemoryProjectRepository } from '../repositories/in-memory-project-repository'
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository'
import { mockProjects } from './projects'
import { mockServices } from './services'

describe('mock data', () => {
  it('contains valid services', async () => {
    const services = await new InMemoryServiceRepository(mockServices).findAll()

    expect(services.length).toBeGreaterThan(0)
  })

  it('contains valid projects with at least one featured', async () => {
    const repository = new InMemoryProjectRepository(mockProjects)

    expect((await repository.findAll()).length).toBeGreaterThan(0)
    expect((await repository.findFeatured()).length).toBeGreaterThan(0)
  })

  it('lists the three services of the studio in order', async () => {
    const services = await new InMemoryServiceRepository(mockServices).findAll()

    expect(services.map((service) => service.title)).toEqual([
      'Interior & arredo',
      'Ristrutturazioni',
      'Pratiche urbanistiche',
    ])
  })

  it('features the apartment in Fondi', async () => {
    const [featured] = await new InMemoryProjectRepository(mockProjects).findFeatured()

    expect(featured.title).toBe('Un appartamento a Fondi, ripensato da zero')
    expect(featured.areaSqm).toBe(95)
    expect(featured.location).toBe('Fondi (LT)')
    expect(featured.scope).toBe('Ristrutturazione completa')
    expect(featured.beforeImage).toBeDefined()
  })

  it('links projects only to existing services', async () => {
    const serviceIds = new Set(
      (await new InMemoryServiceRepository(mockServices).findAll()).map((service) => service.id),
    )
    const projects = await new InMemoryProjectRepository(mockProjects).findAll()

    for (const project of projects) {
      for (const serviceId of project.serviceIds) {
        expect(serviceIds).toContain(serviceId)
      }
    }
  })
})
