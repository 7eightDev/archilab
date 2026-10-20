/** @jest-environment node */
import { InMemoryServiceRepository } from './in-memory-service-repository'

function rawService(id: string, order: number) {
  return { id, slug: id, title: id, description: `Descrizione ${id}`, order }
}

const seed = [rawService('interni', 2), rawService('progettazione', 0), rawService('pratiche', 1)]

describe('InMemoryServiceRepository', () => {
  it('rejects seed data that does not match the Service schema', () => {
    expect(() => new InMemoryServiceRepository([rawService('interni', -1)])).toThrow()
  })

  it('rejects seed data with duplicate slugs', () => {
    expect(
      () => new InMemoryServiceRepository([rawService('interni', 0), rawService('interni', 1)]),
    ).toThrow('interni')
  })

  it('returns services sorted by order', async () => {
    const services = await new InMemoryServiceRepository(seed).findAll()

    expect(services.map((service) => service.id)).toEqual(['progettazione', 'pratiche', 'interni'])
  })

  it('does not let callers mutate the stored services', async () => {
    const repository = new InMemoryServiceRepository(seed)

    const services = await repository.findAll()
    services.pop()
    services[0].title = 'Modificato'

    const again = await repository.findAll()
    expect(again).toHaveLength(3)
    expect(again[0].title).toBe('progettazione')
  })

  it('finds a service by slug', async () => {
    const service = await new InMemoryServiceRepository(seed).findBySlug('pratiche')

    expect(service?.id).toBe('pratiche')
  })

  it('returns null for an unknown slug', async () => {
    expect(await new InMemoryServiceRepository(seed).findBySlug('inesistente')).toBeNull()
  })
})
