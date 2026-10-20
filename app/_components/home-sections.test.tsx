import { render, screen } from '@testing-library/react'
import type { Project } from '@/app/_domain/entities/project'
import type { Service } from '@/app/_domain/entities/service'
import { Hero } from './hero'
import { ServicesSection } from './services-section'

const project: Project = {
  id: 'p-1',
  slug: 'villa-sul-mare',
  title: 'Villa sul mare',
  summary: 'Nuova residenza affacciata sul golfo.',
  category: 'residenziale',
  location: 'Sorrento (NA)',
  year: 2025,
  coverImage: { src: '/images/placeholder.svg', alt: 'Prospetto della villa verso il mare' },
  gallery: [],
  serviceIds: [],
  featured: true,
}

describe('Hero', () => {
  it('shows the featured project with its image, place and year', () => {
    render(<Hero project={project} />)

    expect(screen.getByRole('img', { name: 'Prospetto della villa verso il mare' })).toBeInTheDocument()
    expect(screen.getByText('Villa sul mare')).toBeInTheDocument()
    expect(screen.getByText('Sorrento (NA), 2025')).toBeInTheDocument()
  })

  it('still invites visitors to get in touch when no project is featured', () => {
    render(<Hero project={null} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Richiedi un preventivo' })).toHaveAttribute('href', '#contatti')
  })
})

describe('ServicesSection', () => {
  const services: Service[] = [
    { id: 's-1', slug: 'interior-design', title: 'Interior design', description: 'Arredi su misura.', icon: 'sofa', order: 0 },
    { id: 's-2', slug: 'pratiche-edilizie', title: 'Pratiche edilizie', description: 'CILA e SCIA.', order: 1 },
  ]

  it('lists every service with its description', () => {
    render(<ServicesSection services={services} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Interior design')
    expect(items[1]).toHaveTextContent('CILA e SCIA.')
  })

  it('renders nothing when there are no services', () => {
    const { container } = render(<ServicesSection services={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
