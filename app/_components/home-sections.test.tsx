import { render, screen, within } from '@testing-library/react'
import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { AboutSection } from './about-section'
import { FeaturedProjectSection } from './featured-project-section'
import { Hero } from './hero'
import { ServicesSection } from './services-section'
import { SiteFooter } from './site-footer'

const project: Project = {
  id: 'p-1',
  slug: 'appartamento-fondi',
  title: 'Un appartamento a Fondi, ripensato da zero',
  summary: 'Ristrutturazione completa di un appartamento anni ‘80.',
  description: 'Un appartamento degli anni ‘80 nel centro di Fondi, trasformato in un open space luminoso.',
  category: 'ristrutturazione',
  location: 'Fondi (LT)',
  year: 2025,
  coverImage: { src: '/images/placeholder.svg', alt: 'Il soggiorno open space dopo i lavori' },
  gallery: [],
  serviceIds: [],
  featured: true,
}

describe('Hero', () => {
  it('states the promise of the studio', () => {
    render(<Hero showProjectLink />)

    expect(screen.getByRole('heading', { level: 1, name: 'Dove abitare prende forma.' })).toBeInTheDocument()
    expect(screen.getByText(/Interni, ristrutturazioni e pratiche urbanistiche/)).toBeInTheDocument()
  })

  it('links to the contact form and to the featured project', () => {
    render(<Hero showProjectLink />)

    expect(screen.getByRole('link', { name: 'Richiedi una consulenza' })).toHaveAttribute('href', '#contatti')
    expect(screen.getByRole('link', { name: 'Guarda il progetto' })).toHaveAttribute('href', '#progetto')
  })

  it('hides the project link when there is no project to show', () => {
    render(<Hero showProjectLink={false} />)

    expect(screen.queryByRole('link', { name: 'Guarda il progetto' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Richiedi una consulenza' })).toBeInTheDocument()
  })
})

describe('AboutSection', () => {
  it('introduces the studio and its founder', () => {
    render(<AboutSection />)

    const section = screen.getByRole('region', { name: 'Chi siamo' })
    expect(section).toHaveTextContent('Archilab è lo studio di architettura di Maria Pezzella')
    expect(section).toHaveTextContent('Fondi (LT)')
  })
})

describe('ServicesSection', () => {
  const services: Service[] = [
    { id: 's-1', slug: 'interior-arredo', title: 'Interior & arredo', description: 'Progettazione degli spazi interni.', order: 0 },
    { id: 's-2', slug: 'pratiche-urbanistiche', title: 'Pratiche urbanistiche', description: 'CILA e SCIA.', order: 1 },
  ]

  it('lists every service with its description', () => {
    render(<ServicesSection services={services} />)

    const section = screen.getByRole('region', { name: 'Servizi' })
    const items = within(section).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByRole('heading', { level: 3 })).toHaveTextContent('Interior & arredo')
    expect(items[1]).toHaveTextContent('CILA e SCIA.')
  })

  it('renders nothing when there are no services', () => {
    const { container } = render(<ServicesSection services={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})

describe('FeaturedProjectSection', () => {
  it('tells the story of the project with its image', () => {
    render(<FeaturedProjectSection project={project} />)

    const section = screen.getByRole('region', { name: project.title })
    expect(section).toHaveAttribute('id', 'progetto')
    expect(section).toHaveTextContent(project.description!)
    expect(within(section).getByRole('img', { name: 'Il soggiorno open space dopo i lavori' })).toBeInTheDocument()
  })

  it('falls back to the summary when the project has no description', () => {
    render(<FeaturedProjectSection project={{ ...project, description: undefined }} />)

    expect(screen.getByText(project.summary)).toBeInTheDocument()
  })

  it('renders nothing without a project', () => {
    const { container } = render(<FeaturedProjectSection project={null} />)

    expect(container).toBeEmptyDOMElement()
  })
})

describe('SiteFooter', () => {
  it('names the studio and where it is', () => {
    render(<SiteFooter />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent('Archilab')
    expect(footer).toHaveTextContent('Fondi (LT)')
  })
})
