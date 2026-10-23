import { render, screen } from '@testing-library/react'
import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { TitleBlock, titleBlockCells } from './title-block'

const services: Service[] = [
  { id: 's-a', slug: 'architettura', title: 'Architettura', description: 'x', items: [], order: 0 },
  { id: 's-i', slug: 'interior', title: 'Interior', description: 'x', items: [], order: 1 },
]

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p-1',
    slug: 'appartamento',
    title: 'Appartamento',
    summary: 'Riassunto',
    category: 'ristrutturazione',
    location: 'Fondi (LT)',
    areaSqm: 95,
    scope: 'Ristrutturazione completa',
    year: 2025,
    durationMonths: 7,
    permits: ['CILA', 'SCIA'],
    coverImage: { src: '/c.jpg', alt: 'Copertina' },
    gallery: [],
    serviceIds: ['s-a', 's-i'],
    featured: false,
    ...overrides,
  }
}

const labels = (cells: { label: string }[]) => cells.map((cell) => cell.label)
const valueOf = (cells: { label: string; value: string }[], label: string) =>
  cells.find((cell) => cell.label === label)?.value

describe('titleBlockCells', () => {
  it('lists the entries in order, leaving out missing data', () => {
    expect(labels(titleBlockCells(makeProject(), services, 4))).toEqual([
      'LUOGO',
      'SUPERFICIE',
      'INTERVENTO',
      'ANNO',
      'DURATA',
      'PRATICHE',
      'SERVIZI',
    ])
    expect(labels(titleBlockCells(makeProject({ areaSqm: undefined, permits: [] }), services, 4))).toEqual([
      'LUOGO',
      'INTERVENTO',
      'ANNO',
      'DURATA',
      'SERVIZI',
    ])
  })

  it('formats the values', () => {
    const cells = titleBlockCells(makeProject(), services, 4)

    expect(valueOf(cells, 'SUPERFICIE')).toBe('95 m²')
    expect(valueOf(cells, 'DURATA')).toBe('7 mesi')
    expect(valueOf(cells, 'PRATICHE')).toBe('CILA · SCIA')
    expect(valueOf(cells, 'SERVIZI')).toBe('Architettura · Interior')
    expect(valueOf(titleBlockCells(makeProject({ durationMonths: 1 }), services, 4), 'DURATA')).toBe('1 mese')
  })

  it('spans services across the row in two columns', () => {
    const cells = titleBlockCells(makeProject(), services, 2)

    expect(cells.find((cell) => cell.label === 'SERVIZI')?.span).toBe(2)
    // In four columns services are an ordinary cell, widened only because they close the row.
    expect(titleBlockCells(makeProject(), services, 4).map((cell) => cell.span)).toEqual([1, 1, 1, 1, 1, 1, 2])
  })

  it('widens the last cell of an incomplete row', () => {
    const sparse = makeProject({ areaSqm: undefined, durationMonths: undefined, permits: [], serviceIds: [] })

    expect(titleBlockCells(sparse, services, 2).map((cell) => cell.span)).toEqual([1, 1, 2])
    expect(titleBlockCells(sparse, services, 4).map((cell) => cell.span)).toEqual([1, 1, 2])
  })
})

describe('TitleBlock', () => {
  it('renders a labelled description list', () => {
    render(<TitleBlock project={makeProject()} services={services} columns={2} />)

    expect(screen.getByLabelText('Scheda tecnica')).toHaveTextContent('DURATA7 mesi')
  })
})
