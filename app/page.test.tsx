import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
      'Caso Studio',
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
    expect(new Set(hrefs)).toEqual(new Set(['#studio', '#servizi', '/progetti', '#contatti']))
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
    expect(sheet).toHaveTextContent('ANNO2025')
    expect(sheet).toHaveTextContent('DURATA7 mesi')
  })

  it('previews the featured project and links to its page and to all projects', async () => {
    render(await Home())

    const section = screen.getByRole('region', { name: 'Caso Studio' })
    expect(within(section).getByRole('link', { name: 'Leggi il caso studio' })).toHaveAttribute(
      'href',
      '/progetti/appartamento-fondi',
    )
    expect(within(section).getByRole('link', { name: 'Tutti i progetti · 10' })).toHaveAttribute('href', '/progetti')
    expect(within(section).getAllByRole('figure')).toHaveLength(4)
    expect(within(section).queryByRole('slider', { name: 'Confronta prima e dopo' })).not.toBeInTheDocument()
  })

  it('leaves out the project section and its links when no project is featured', async () => {
    jest.spyOn(getFeaturedProject, 'execute').mockResolvedValue(null)
    jest.spyOn(listServices, 'execute').mockResolvedValue([])

    render(await Home())

    expect(screen.queryByRole('region', { name: 'Caso Studio' })).not.toBeInTheDocument()
    // The header keeps its Progetti entry and the hero its project links; the case study link and services go.
    expect(screen.queryByRole('link', { name: 'Leggi il caso studio' })).not.toBeInTheDocument()
    expect(document.querySelector('a[href="#servizi"]')).toBeNull()
  })
})

describe('Home page contacts', () => {
  it('lets visitors call the studio from the contact section', async () => {
    render(await Home())

    expect(screen.getByRole('link', { name: '328 7489 645' })).toHaveAttribute('href', 'tel:+393287489645')
  })

  it('shows the studio address and opens its map in a dialog', async () => {
    render(await Home())

    const address = screen.getByText(/Via Romano Antoniazzo, 19/).closest('address')!
    expect(address).toHaveTextContent('Via Romano Antoniazzo, 1904022 Fondi (LT)')
    expect(screen.queryByTitle(/Mappa dello studio/)).not.toBeInTheDocument()

    await userEvent.click(within(address).getByRole('button', { name: 'Vieni a trovarmi' }))

    const dialog = await screen.findByRole('dialog', { name: 'Ti aspetto a Fondi' })
    expect(within(dialog).getByTitle(/Mappa dello studio/)).toHaveAttribute(
      'src',
      'https://www.google.com/maps?q=Via%20Romano%20Antoniazzo%2019%2C%2004022%20Fondi%20LT&output=embed',
    )
    expect(within(dialog).getByRole('link', { name: /Apri in Google Maps/ })).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=Via%20Romano%20Antoniazzo%2019%2C%2004022%20Fondi%20LT',
    )

    await userEvent.click(within(dialog).getByRole('button', { name: 'Chiudi la mappa' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows the studio email as plain text, leaving the form as the way to write', async () => {
    render(await Home())

    const address = screen.getByText(/Via Romano Antoniazzo, 19/).closest('address')!
    expect(address).toHaveTextContent('archipezzella@gmail.com')
    expect(within(address).queryByRole('link', { name: 'archipezzella@gmail.com' })).not.toBeInTheDocument()
  })

  it('opens a WhatsApp chat with the studio in a new tab', async () => {
    render(await Home())

    const whatsapp = screen.getByRole('link', { name: 'Scrivimi su WhatsApp' })
    expect(whatsapp).toHaveAttribute('href', 'https://wa.me/393287489645')
    expect(whatsapp).toHaveAttribute('target', '_blank')
  })
})

describe('Home page details still to be supplied', () => {
  it('never shows a bracketed placeholder to visitors', async () => {
    const { container } = render(await Home())

    expect(container.textContent).not.toMatch(/\[[^\]]*(FORNIRE|DEFINIRE|CONFERMARE)[^\]]*\]/)
  })

  it('leaves out the portrait, the VAT number and the privacy links until they exist', async () => {
    render(await Home())

    expect(screen.queryByText(/Ritratto/)).not.toBeInTheDocument()
    expect(screen.queryByText(/P\.IVA/)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /privacy|cookie/i })).not.toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Ordine degli Architetti di Latina')
  })
})
