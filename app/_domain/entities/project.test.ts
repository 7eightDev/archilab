import { ProjectSchema, projectCategories } from './project'

const validProject = {
  id: 'p-1',
  slug: 'villa-rossi',
  title: 'Villa Rossi',
  summary: 'Ristrutturazione di una villa degli anni Sessanta.',
  category: 'residenziale',
  year: 2024,
  coverImage: { src: '/images/villa-rossi.jpg', alt: 'Facciata di Villa Rossi' },
}

describe('ProjectSchema', () => {
  it('accepts a valid project and applies defaults', () => {
    const project = ProjectSchema.parse(validProject)

    expect(project.gallery).toEqual([])
    expect(project.serviceIds).toEqual([])
    expect(project.featured).toBe(false)
  })

  it('keeps optional fields when provided', () => {
    const project = ProjectSchema.parse({
      ...validProject,
      description: 'Testo lungo',
      location: 'Napoli',
      gallery: [{ src: '/images/a.jpg', alt: 'Soggiorno' }],
      serviceIds: ['s-1'],
      featured: true,
    })

    expect(project.location).toBe('Napoli')
    expect(project.gallery).toHaveLength(1)
    expect(project.featured).toBe(true)
  })

  it.each(['Villa Rossi', 'villa_rossi', '-villa', 'villa-', 'villa--rossi', ''])(
    'rejects invalid slug %p',
    (slug) => {
      expect(ProjectSchema.safeParse({ ...validProject, slug }).success).toBe(false)
    },
  )

  it('rejects an empty title', () => {
    expect(ProjectSchema.safeParse({ ...validProject, title: '' }).success).toBe(false)
  })

  it('rejects a title longer than 120 characters', () => {
    expect(ProjectSchema.safeParse({ ...validProject, title: 'a'.repeat(121) }).success).toBe(false)
  })

  it('rejects a summary longer than 300 characters', () => {
    expect(ProjectSchema.safeParse({ ...validProject, summary: 'a'.repeat(301) }).success).toBe(false)
  })

  it('exposes the allowed categories', () => {
    expect(projectCategories).toEqual([
      'residenziale',
      'commerciale',
      'interni',
      'ristrutturazione',
      'pubblico',
    ])
  })

  it('rejects an unknown category', () => {
    expect(ProjectSchema.safeParse({ ...validProject, category: 'industriale' }).success).toBe(false)
  })

  it.each([1899, 2024.5, new Date().getFullYear() + 2])('rejects invalid year %p', (year) => {
    expect(ProjectSchema.safeParse({ ...validProject, year }).success).toBe(false)
  })

  it('accepts next year for projects in progress', () => {
    const year = new Date().getFullYear() + 1
    expect(ProjectSchema.safeParse({ ...validProject, year }).success).toBe(true)
  })

  it('requires alt text on the cover image', () => {
    const coverImage = { src: '/images/villa-rossi.jpg', alt: '' }
    expect(ProjectSchema.safeParse({ ...validProject, coverImage }).success).toBe(false)
  })

  it('requires alt text on gallery images', () => {
    const gallery = [{ src: '/images/a.jpg' }]
    expect(ProjectSchema.safeParse({ ...validProject, gallery }).success).toBe(false)
  })
})
