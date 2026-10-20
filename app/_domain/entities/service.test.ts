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
    expect(ServiceSchema.parse(validService)).toEqual(validService)
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

  it.each([-1, 1.5])('rejects invalid order %p', (order) => {
    expect(ServiceSchema.safeParse({ ...validService, order }).success).toBe(false)
  })
})
