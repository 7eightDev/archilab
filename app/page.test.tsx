import { render, screen, within } from '@testing-library/react'
import { getFeaturedProject, listServices } from '@/app/_infrastructure/container'
import Home from './page'

afterEach(() => jest.restoreAllMocks())

describe('Home page', () => {
  it('stacks the sections as Hero → Studio → Percorso → Progetto → Come lavoro → Scrivimi → Footer', async () => {
    render(await Home())

    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { level: 1 })).toHaveTextContent(
      'Dal progetto alle pratiche in Comune, un solo architetto per tutta la casa.',
    )
    expect(within(main).getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Lo Studio',
      'Un solo Percorso',
      'Il Progetto',
      'Come Lavoro',
      'Scrivimi',
    ])
    expect(main.nextElementSibling).toBe(screen.getByRole('contentinfo'))
  })

  it('lets visitors jump to every section from the header', async () => {
    render(await Home())

    const nav = screen.getByRole('navigation', { name: 'Principale' })
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(new Set(hrefs)).toEqual(new Set(['#studio', '#servizi', '#progetti', '#contatti']))
  })

  it('shows the services and the featured project from the use cases', async () => {
    render(await Home())

    const services = screen.getByRole('region', { name: 'Un solo Percorso' })
    expect(within(services).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Architettura',
      'Interior',
      'Pratiche urbanistiche',
    ])
    const sheet = screen.getByLabelText('Scheda tecnica')
    expect(sheet).toHaveTextContent('SUPERFICIE95 m²')
    expect(sheet).toHaveTextContent('SERVIZIArchitettura · Interior · Pratiche urbanistiche')
  })

  it('leaves out the project section and its links when no project is featured', async () => {
    jest.spyOn(getFeaturedProject, 'execute').mockResolvedValue(null)
    jest.spyOn(listServices, 'execute').mockResolvedValue([])

    render(await Home())

    expect(screen.queryByRole('region', { name: 'Il Progetto' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Guarda un progetto' })).not.toBeInTheDocument()
    expect(document.querySelector('a[href="#progetti"], a[href="#servizi"]')).toBeNull()
  })
})

describe('Home page contacts', () => {
  it('lets visitors call the studio from the contact section', async () => {
    render(await Home())

    expect(screen.getByRole('link', { name: '328 7489 645' })).toHaveAttribute('href', 'tel:+393287489645')
  })

  it('shows the studio address with a link to Google Maps', async () => {
    render(await Home())

    const address = screen.getByText(/Via Romano Antoniazzo, 19/).closest('address')!
    expect(address).toHaveTextContent('Via Romano Antoniazzo, 1904022 Fondi (LT)')
    expect(within(address).getByRole('link', { name: /Apri in Google Maps/ }).getAttribute('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Via%20Romano%20Antoniazzo%2019%2C%2004022%20Fondi%20LT',
    )
  })

  it('lets visitors write to the studio email', async () => {
    render(await Home())

    expect(screen.getByRole('link', { name: 'archipezzella@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:archipezzella@gmail.com',
    )
  })

  it('opens a WhatsApp chat with the studio in a new tab', async () => {
    render(await Home())

    const whatsapp = screen.getByRole('link', { name: 'Scrivimi su WhatsApp' })
    expect(whatsapp).toHaveAttribute('href', 'https://wa.me/393287489645')
    expect(whatsapp).toHaveAttribute('target', '_blank')
  })
})
