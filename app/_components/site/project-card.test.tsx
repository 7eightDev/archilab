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
