import { render, screen, within } from '@testing-library/react'
import { ProjectSchema } from '@/app/_domain/entities/project'
import { projects } from '@/app/_infrastructure/data/projects'
import { FeaturedProjectRow, ProjectCard } from './project-card'

const bySlug = (slug: string) => ProjectSchema.parse(projects.find((project) => project.slug === slug))

describe('ProjectCard', () => {
  it('links to the project and shows category, title, place and year', () => {
    render(<ProjectCard project={bySlug('bar-fondi')} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/progetti/bar-fondi')
    expect(link).toHaveTextContent('COMMERCIALE')
    expect(within(link).getByRole('heading', { name: 'Un bar nel centro storico di Fondi' })).toBeInTheDocument()
    expect(link).toHaveTextContent('Fondi (LT) · 2023')
    expect(within(link).getByRole('img')).toHaveAttribute('alt', bySlug('bar-fondi').coverImage.alt)
  })

  it('uses a wider photo in the small size', () => {
    const { container } = render(<ProjectCard project={bySlug('bar-fondi')} size="small" />)

    expect(container.querySelector('.aspect-\\[3\\/2\\]')).not.toBeNull()
    expect(container.querySelector('.aspect-\\[4\\/3\\]')).toBeNull()
  })

  // Titles on one or two lines: the card fills its grid row and the place line sits at the bottom,
  // so the rules under the cards of a row line up.
  it('stretches to the row so the bottom rules line up', () => {
    render(<ProjectCard project={bySlug('bar-fondi')} />)

    const card = screen.getByRole('link')
    expect(card).toHaveClass('h-full')
    expect(screen.getByRole('heading', { level: 3 }).closest('div.border-b')).toHaveClass('flex-1')
    expect(screen.getByText(/2023/)).toHaveClass('mt-auto')
  })
})

describe('FeaturedProjectRow', () => {
  it('labels the case study', () => {
    const project = bySlug('appartamento-fondi')
    render(<FeaturedProjectRow project={project} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/progetti/appartamento-fondi')
    expect(link).toHaveTextContent('CASO STUDIO')
    expect(link).toHaveTextContent('RISTRUTTURAZIONE')
    expect(link).toHaveTextContent(project.summary)
    expect(link).toHaveTextContent('Leggi il caso studio')
    expect(link).toHaveTextContent(`${project.location} · ${project.year}`)
  })
})
