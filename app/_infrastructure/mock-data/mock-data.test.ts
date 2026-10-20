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
