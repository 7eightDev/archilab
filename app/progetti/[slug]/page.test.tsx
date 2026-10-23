import { render, screen, within } from '@testing-library/react'
import { notFound } from 'next/navigation'
import { MISSING_PROJECT_SLUG } from '../missing-project'
import ProjectNotFound from './not-found'
import ProjectPage, { generateMetadata, generateStaticParams, instant } from './page'

jest.mock('@/app/_actions/submit-contact-form', () => ({ submitContactForm: jest.fn() }))
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

async function renderProject(slug: string) {
  return render(await ProjectPage({ params: Promise.resolve({ slug }) } as PageProps<'/progetti/[slug]'>))
}

function section(name: RegExp) {
  return screen.getByRole('heading', { level: 2, name }).closest('section') as HTMLElement
}

describe('route config', () => {
  // Everything on the page depends on the slug; a Suspense shell would also turn the 404 into a 200.
  it('lets the navigation wait for the page', () => {
    expect(instant).toBe(false)
  })
})

describe('generateStaticParams', () => {
  it('generates a page for every project, and the one the proxy sends unknown slugs to', async () => {
    const params = await generateStaticParams()

    expect(params).toHaveLength(11)
    expect(params).toContainEqual({ slug: 'appartamento-fondi' })
    expect(params).toContainEqual({ slug: MISSING_PROJECT_SLUG })
  })
})

describe('generateMetadata', () => {
  it('takes title, summary and cover from the project', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'appartamento-fondi' }) } as PageProps<'/progetti/[slug]'>)

    expect(metadata.title).toBe('Un appartamento a Fondi, ripensato da zero · Archilab')
    expect(metadata.description).toMatch(/^Stanze piccole/)
    expect(metadata.openGraph?.images).toEqual([expect.stringContaining('images.unsplash.com')])
  })
})

describe('ProjectPage', () => {
  it('tells the full story of the featured project', async () => {
    await renderProject('appartamento-fondi')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Un appartamento a Fondi, ripensato da zero')
    expect(screen.getByText('CASO STUDIO')).toBeInTheDocument()
    expect(screen.getByText('RISTRUTTURAZIONE · 2025')).toBeInTheDocument()
    expect(screen.getByText('M² RIPENSATI')).toBeInTheDocument()
    const story = screen.getByRole('heading', { level: 2, name: /Il Racconto/i }).parentElement as HTMLElement
    expect(within(story).getAllByRole('paragraph')).toHaveLength(2)
    expect(document.querySelectorAll('figure')).toHaveLength(6)
    expect(screen.getByRole('slider', { name: 'Confronta prima e dopo' })).toBeInTheDocument()

    // There are no service pages: the services are listed, not linked.
    const services = within(section(/Cosa ho seguito/i))
    expect(services.getAllByRole('listitem')).toHaveLength(3)
    expect(services.getByText('Pratiche urbanistiche')).toBeInTheDocument()
    expect(services.getByText('Permessi e rapporti con il Comune.')).toBeInTheDocument()
    expect(services.queryAllByRole('link')).toHaveLength(0)

    expect(within(section(/Altri progetti/i)).getAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(screen.getByRole('link', { name: /PRECEDENTE/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /SUCCESSIVO/ })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Tutti i progetti' })[0]).toHaveAttribute('href', '/progetti')
  })

  it('stays complete with minimal data', async () => {
    await renderProject('cucina-monte-san-biagio')

    expect(screen.queryByText(/^M²/)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Il Racconto/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(screen.queryByText('CASO STUDIO')).not.toBeInTheDocument()
    expect(document.querySelectorAll('figure')).toHaveLength(2)
    expect(document.querySelector('dl[aria-label="Scheda tecnica"]')).toHaveStyle({
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    })
  })

  it('drops the phases section without photos', async () => {
    await renderProject('sottotetto-fondi')

    expect(screen.queryByRole('heading', { name: /Le Fasi/i })).not.toBeInTheDocument()
  })

  it('adapts the closing line to the category', async () => {
    const { unmount } = await renderProject('appartamento-fondi')
    expect(screen.getByRole('heading', { name: 'Hai una casa da ripensare? Scrivimi.' })).toBeInTheDocument()
    unmount()

    await renderProject('cucina-monte-san-biagio')
    expect(screen.getByRole('heading', { name: 'Hai un progetto simile? Scrivimi.' })).toBeInTheDocument()
  })

  it('notes whether the other projects share the category', async () => {
    const { unmount } = await renderProject('appartamento-fondi')
    expect(screen.getByText('Della stessa categoria: Ristrutturazione')).toBeInTheDocument()
    unmount()

    await renderProject('sala-civica')
    expect(screen.getByText('Pubblico e altri progetti recenti')).toBeInTheDocument()
  })

  it('hints at the phase descriptions, without counting the photos', async () => {
    await renderProject('cucina-monte-san-biagio')

    expect(screen.getByText('Passa sopra una fase per leggere com’è andata.')).toBeInTheDocument()
    expect(screen.queryByText('2 immagini')).not.toBeInTheDocument()
  })

  it('calls notFound for an unknown slug', async () => {
    await expect(renderProject('non-esiste')).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })
})

describe('ProjectNotFound', () => {
  it('says the project is missing and leads back to the list', () => {
    render(<ProjectNotFound />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Questo progetto non c’è')
    expect(screen.getByRole('link', { name: 'Tutti i progetti' })).toHaveAttribute('href', '/progetti')
  })
})
