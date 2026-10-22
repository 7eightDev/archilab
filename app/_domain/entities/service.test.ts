import { ServiceSchema } from './service'

const validService = {
  id: 's-1',
  slug: 'progettazione-architettonica',
  title: 'Progettazione architettonica',
  description: 'Dal concept al progetto esecutivo.',
  order: 0,
}

describe('ServiceSchema', () => {
  it('accepts a valid service', () => {
    expect(ServiceSchema.parse(validService)).toEqual({ ...validService, items: [] })
  })

  it('keeps the optional icon when provided', () => {
    expect(ServiceSchema.parse({ ...validService, icon: 'ruler' }).icon).toBe('ruler')
  })

  it('rejects an invalid slug', () => {
    expect(ServiceSchema.safeParse({ ...validService, slug: 'Progettazione' }).success).toBe(false)
  })

  it('rejects an empty title', () => {
    expect(ServiceSchema.safeParse({ ...validService, title: '' }).success).toBe(false)
  })

  it('requires a description', () => {
    expect(ServiceSchema.safeParse({ ...validService, description: '' }).success).toBe(false)
  })

  it('defaults the bullet list to empty', () => {
    expect(ServiceSchema.parse(validService).items).toEqual([])
  })

  it('keeps the short summary and the bullet list when provided', () => {
    const service = ServiceSchema.parse({
      ...validService,
      summary: 'Nuove case, ristrutturazioni, ampliamenti.',
      items: ['Nuove costruzioni', 'Ampliamenti'],
    })

    expect(service.summary).toBe('Nuove case, ristrutturazioni, ampliamenti.')
    expect(service.items).toEqual(['Nuove costruzioni', 'Ampliamenti'])
  })

  it('rejects an empty bullet', () => {
    expect(ServiceSchema.safeParse({ ...validService, items: [''] }).success).toBe(false)
  })

  it('rejects an empty summary', () => {
    expect(ServiceSchema.safeParse({ ...validService, summary: '' }).success).toBe(false)
  })

  it.each([-1, 1.5])('rejects invalid order %p', (order) => {
    expect(ServiceSchema.safeParse({ ...validService, order }).success).toBe(false)
  })
})
