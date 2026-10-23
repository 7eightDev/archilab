import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { isValidElement } from 'react'
import ProjectsLayout from './layout'

jest.mock('@/app/_actions/submit-contact-form', () => ({ submitContactForm: jest.fn() }))

beforeAll(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })
})

describe('ProjectsLayout', () => {
  it('marks Progetti as current and opens the drawer from Contattami', async () => {
    render(await ProjectsLayout({ children: <p>contenuto</p> }))

    expect(screen.getByText('contenuto').closest('main')).not.toBeNull()
    expect(screen.getByRole('link', { name: 'PROGETTI' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'STUDIO' })).toHaveAttribute('href', '/#studio')
    expect(screen.getByRole('link', { name: 'SERVIZI' })).toHaveAttribute('href', '/#servizi')
    expect(screen.getByRole('link', { name: "Archilab, torna all'inizio" })).toHaveAttribute('href', '/')

    await userEvent.click(screen.getAllByRole('link', { name: 'Contattami' })[0])

    expect(await screen.findByRole('dialog', { name: 'Scrivimi' })).toBeInTheDocument()
  })

  // The layout is a Server Component: a function prop cannot cross into the client header.
  it('passes no functions to the components it renders', async () => {
    const functionProps: string[] = []
    const visit = (node: React.ReactNode) => {
      if (Array.isArray(node)) return node.forEach(visit)
      if (!isValidElement<Record<string, unknown>>(node)) return
      for (const [name, value] of Object.entries(node.props)) {
        if (typeof value === 'function') functionProps.push(name)
      }
      visit(node.props.children as React.ReactNode)
    }

    visit(await ProjectsLayout({ children: <p>contenuto</p> }))

    expect(functionProps).toEqual([])
  })
})
