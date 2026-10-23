import { render, screen, within } from '@testing-library/react'
import { listProjects } from '@/app/_infrastructure/container'
import ProjectsPage, { ProjectsList, generateMetadata, parseCategory } from './page'

jest.mock('@/app/_actions/submit-contact-form', () => ({ submitContactForm: jest.fn() }))

async function renderList(searchParams: Record<string, string | string[] | undefined>) {
  return render(await ProjectsList({ searchParams: Promise.resolve(searchParams) }))
}

function cards() {
  return screen.queryAllByRole('heading', { level: 3 })
}

function countLine() {
  return screen.getByTestId('project-count').textContent
}

afterEach(() => jest.restoreAllMocks())

describe('parseCategory', () => {
  it('accepts a known category only', () => {
    expect(parseCategory('interni')).toBe('interni')
    expect(parseCategory('Interni')).toBeUndefined()
    expect(parseCategory('')).toBeUndefined()
    expect(parseCategory(['interni', 'pubblico'])).toBeUndefined()
    expect(parseCategory(undefined)).toBeUndefined()
  })
})

describe('ProjectsList', () => {
  it('lists every project with the case study first', async () => {
    await renderList({})

    expect(screen.getByText('CASO STUDIO').closest('a')).toHaveAttribute('href', '/progetti/appartamento-fondi')
    expect(screen.getByText('Leggi il caso studio')).toBeInTheDocument()
    expect(cards()).toHaveLength(9)
    expect(countLine()).toBe('10 progetti · 2018–2026')
    expect(screen.getByRole('link', { name: /Tutti/ })).toHaveAttribute('aria-current', 'page')
  })

  it('filters by category from the address', async () => {
    await renderList({ categoria: 'interni' })

    expect(cards()).toHaveLength(3)
    expect(screen.queryByText('CASO STUDIO')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Interni/ })).toHaveAttribute('aria-current', 'page')
    expect(countLine()).toBe('3 progetti · Interni · 2020–2026')
  })

  it('keeps the featured project out of the grid when the filter excludes it', async () => {
    await renderList({ categoria: 'interni' })

    expect(screen.queryByRole('link', { name: /appartamento/i })).not.toBeInTheDocument()
    expect(document.querySelector('a[href="/progetti/appartamento-fondi"]')).toBeNull()
  })

  it.each([{ categoria: 'pippo' }, { categoria: 'Interni' }, { categoria: '' }, { categoria: ['interni', 'pubblico'] }])(
    'shows everything for %p',
    async (searchParams) => {
      await renderList(searchParams)

      expect(cards()).toHaveLength(9)
      expect(screen.getByText('CASO STUDIO')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Tutti/ })).toHaveAttribute('aria-current', 'page')
    },
  )

  it('explains an empty category', async () => {
    const real = await listProjects.execute()
    jest.spyOn(listProjects, 'execute').mockResolvedValue({ ...real, projects: [] })

    await renderList({ categoria: 'pubblico' })

    expect(screen.getByText('Non ci sono ancora progetti in questa categoria.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tutti i progetti' })).toHaveAttribute('href', '/progetti')
    expect(cards()).toHaveLength(0)
  })
})

describe('ProjectsPage', () => {
  it('opens with the page title and closes with the call to action', () => {
    render(<ProjectsPage searchParams={Promise.resolve({})} />)

    const intro = screen.getByRole('heading', { level: 1 })
    expect(intro).toHaveTextContent('TUTTI I PROGETTI')
    expect(intro.closest('#page-intro')).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Hai un progetto simile? Scrivimi.' }).closest('#page-cta')).not.toBeNull()
    expect(within(intro.closest('#page-intro') as HTMLElement).getByText(/Li ho seguiti tutti io/)).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('titles the page after the category', async () => {
    expect((await generateMetadata({ searchParams: Promise.resolve({ categoria: 'interni' })})).title).toBe(
      'Progetti di Interni · Archilab',
    )
    expect((await generateMetadata({ searchParams: Promise.resolve({})})).title).toBe('Progetti · Archilab')
  })
})
