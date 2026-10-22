import type { Service } from '@/app/_domain/entities/service'
import type { ServiceRepository } from '@/app/_domain/repositories/service-repository'
import { ListServices } from './list-services'

class InMemoryServiceRepository implements ServiceRepository {
  constructor(private readonly services: Service[]) {}

  async findAll() {
    return [...this.services].sort((a, b) => a.order - b.order)
  }

  async findBySlug(slug: string) {
    return this.services.find((service) => service.slug === slug) ?? null
  }
}

function makeService(id: string, order: number): Service {
  return { id, slug: id, title: id, description: `Descrizione ${id}`, items: [], order }
}

describe('ListServices', () => {
  it('returns an empty list when there are no services', async () => {
    expect(await new ListServices(new InMemoryServiceRepository([])).execute()).toEqual([])
  })

  it('returns the services provided by the repository', async () => {
    const repository = new InMemoryServiceRepository([
      makeService('interni', 1),
      makeService('progettazione', 0),
    ])

    const services = await new ListServices(repository).execute()

    expect(services.map((service) => service.id)).toEqual(['progettazione', 'interni'])
  })
})
