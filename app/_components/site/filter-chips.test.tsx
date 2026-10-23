import { render, screen } from '@testing-library/react'
import { FilterChips } from './filter-chips'

const counts = { interni: 3, pubblico: 1, ristrutturazione: 4 }

describe('FilterChips', () => {
  it('orders categories by count and hides empty ones', () => {
    render(<FilterChips counts={counts} total={8} />)

    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Tutti 8',
      'Ristrutturazione 4',
      'Interni 3',
      'Pubblico 1',
    ])
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/progetti',
      '/progetti?categoria=ristrutturazione',
      '/progetti?categoria=interni',
      '/progetti?categoria=pubblico',
    ])
  })

  it('breaks ties on the name', () => {
    render(<FilterChips counts={{ pubblico: 2, commerciale: 2 }} total={4} />)

    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/progetti',
      '/progetti?categoria=commerciale',
      '/progetti?categoria=pubblico',
    ])
  })

  it('marks the active chip', () => {
    render(<FilterChips counts={counts} total={8} active="interni" />)

    expect(screen.getByRole('link', { name: /Interni/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /Tutti/ })).not.toHaveAttribute('aria-current')
  })

  it('marks Tutti without an active category', () => {
    render(<FilterChips counts={counts} total={8} />)

    const current = screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent('Tutti')
  })

  // In a centred column the nav would take the chips' width and widen the page on phones.
  it('keeps the row within the page width, scrolling the chips instead', () => {
    render(<FilterChips counts={counts} total={8} />)

    expect(screen.getByRole('navigation', { name: 'Filtra per categoria' })).toHaveClass('w-full')
  })
})
