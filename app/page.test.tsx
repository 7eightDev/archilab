import { render, screen, within } from '@testing-library/react'
import Home from './page'

describe('Home page', () => {
  it('stacks the sections as Hero → Chi siamo → Servizi → Progetto → Contatti → Footer', async () => {
    render(await Home())

    const main = screen.getByRole('main')
    expect(within(main).getAllByRole('heading', { level: 1 })[0]).toHaveTextContent('Dove abitare prende forma.')
    expect(within(main).getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Chi siamo',
      'Servizi',
      'Un appartamento a Fondi, ripensato da zero',
      'Raccontami la tua idea',
    ])
    expect(main.nextElementSibling).toBe(screen.getByRole('contentinfo'))
  })

  it('lets visitors jump to every section from the header', async () => {
    render(await Home())

    const nav = screen.getByRole('navigation', { name: 'Sezioni' })
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['#chi-siamo', '#servizi', '#progetto', '#contatti'])
  })
})
