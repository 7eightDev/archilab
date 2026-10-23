import type { Project } from '@/app/_domain/entities/project'
import { heroKicker, toHeroSlide } from './hero-slides'

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p-1',
    slug: 'bar-fondi',
    title: 'Un bar a Fondi',
    summary: 'Riassunto',
    category: 'residenziale',
    year: 2024,
    coverImage: { src: '/cover.jpg', alt: 'Copertina' },
    gallery: [],
    serviceIds: [],
    featured: false,
    permits: [],
    ...overrides,
  }
}

describe('heroKicker', () => {
  it("uses the project's own kicker", () => {
    expect(heroKicker(makeProject({ heroKicker: 'UN BAR NEL CENTRO STORICO' }))).toBe('UN BAR NEL CENTRO STORICO')
  })

  it('builds the kicker from category and town', () => {
    expect(heroKicker(makeProject({ category: 'residenziale', location: 'Sperlonga (LT)' }))).toBe(
      'UNA CASA A SPERLONGA',
    )
    expect(heroKicker(makeProject({ category: 'pubblico', location: 'Monte San Biagio (LT)' }))).toBe(
      'UNO SPAZIO PUBBLICO A MONTE SAN BIAGIO',
    )
  })

  it('falls back to the year without a location', () => {
    expect(heroKicker(makeProject({ category: 'interni', year: 2020 }))).toBe('GLI INTERNI DI UNA CASA · 2020')
  })
})

describe('toHeroSlide', () => {
  it('joins scope and area in the caption', () => {
    expect(toHeroSlide(makeProject({ scope: 'Ristrutturazione completa', areaSqm: 95 })).caption).toBe(
      'Ristrutturazione completa · 95 m²',
    )
    expect(toHeroSlide(makeProject({ areaSqm: 95 })).caption).toBe('95 m²')
    expect(toHeroSlide(makeProject()).caption).toBe('')
  })

  it('prefers the hero image to the cover', () => {
    expect(toHeroSlide(makeProject()).image.src).toBe('/cover.jpg')
    expect(toHeroSlide(makeProject({ heroImage: { src: '/hero.jpg', alt: 'Hero' } })).image.src).toBe('/hero.jpg')
  })

  it('links to the project page', () => {
    expect(toHeroSlide(makeProject()).project).toEqual({ href: '/progetti/bar-fondi', title: 'Un bar a Fondi' })
  })
})
