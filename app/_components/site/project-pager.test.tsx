import { render, screen } from '@testing-library/react'
import { type Project, ProjectSchema } from '@/app/_domain/entities/project'
import { ProjectPager } from './project-pager'

function makeProject(slug: string, title: string): Project {
  return ProjectSchema.parse({
    id: `p-${slug}`,
    slug,
    title,
    summary: 'Un progetto.',
    category: 'interni',
    year: 2024,
    coverImage: { src: '/images/cover.jpg', alt: 'Copertina' },
  })
}

describe('ProjectPager', () => {
  it('links the neighbours by title', () => {
    render(<ProjectPager previous={makeProject('prima', 'La prima casa')} next={makeProject('dopo', 'La casa dopo')} />)

    expect(screen.getByRole('link', { name: /PRECEDENTE.*La prima casa/ })).toHaveAttribute('href', '/progetti/prima')
    expect(screen.getByRole('link', { name: /SUCCESSIVO.*La casa dopo/ })).toHaveAttribute('href', '/progetti/dopo')
    expect(screen.getByRole('link', { name: 'Tutti i progetti' })).toHaveAttribute('href', '/progetti')
  })

  it('hides the pager without neighbours', () => {
    render(<ProjectPager previous={null} next={null} />)

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Tutti i progetti' })).toHaveAttribute('href', '/progetti')
    expect(screen.queryByText('PRECEDENTE')).not.toBeInTheDocument()
    expect(screen.queryByText('SUCCESSIVO')).not.toBeInTheDocument()
  })
})
