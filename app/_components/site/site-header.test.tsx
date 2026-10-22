import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SiteHeader } from './site-header'

const links = [
  { href: '#studio', label: 'Studio' },
  { href: '#servizi', label: 'Servizi' },
  { href: '#progetti', label: 'Progetti' },
]

beforeAll(() => {
  // jsdom has no matchMedia; the header only needs to subscribe to it.
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })
})

function menu() {
  return document.getElementById(screen.getByRole('button', { name: /menu/ }).getAttribute('aria-controls')!)!
}

describe('SiteHeader mobile menu', () => {
  it('starts closed', () => {
    render(<SiteHeader links={links} />)

    expect(screen.getByRole('button', { name: 'Apri il menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(menu()).not.toBeVisible()
  })

  it('opens over the whole viewport, locks the page and focuses the first link', async () => {
    render(<SiteHeader links={links} />)

    await userEvent.click(screen.getByRole('button', { name: 'Apri il menu' }))

    expect(menu()).toBeVisible()
    expect(menu()).toHaveClass('fixed', 'inset-x-0', 'bottom-0')
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(within(menu()).getByRole('link', { name: 'STUDIO' })).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Scrivimi su WhatsApp' })).toHaveAttribute('href', 'https://wa.me/393287489645')
  })

  it('closes on Escape, gives the focus back to the toggle and unlocks the page', async () => {
    render(<SiteHeader links={links} />)
    await userEvent.click(screen.getByRole('button', { name: 'Apri il menu' }))

    await userEvent.keyboard('{Escape}')

    expect(menu()).not.toBeVisible()
    expect(screen.getByRole('button', { name: 'Apri il menu' })).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('closes when the visitor picks a section', async () => {
    render(<SiteHeader links={links} />)
    await userEvent.click(screen.getByRole('button', { name: 'Apri il menu' }))

    await userEvent.click(within(menu()).getByRole('link', { name: 'SERVIZI' }))

    expect(menu()).not.toBeVisible()
  })
})
