import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactDrawerProvider } from './contact-drawer'
import { MobileContactBar, PAGE_CTA_ID, PAGE_INTRO_ID } from './mobile-contact-bar'

jest.mock('@/app/_actions/submit-contact-form', () => ({ submitContactForm: jest.fn() }))

function placeSections({ heroBottom, contactTop, startId = 'top', endId = 'contatti' }: { heroBottom: number; contactTop: number; startId?: string; endId?: string }) {
  document.body.innerHTML = `<section id="${startId}"></section><section id="${endId}"></section>`
  document.getElementById(startId)!.getBoundingClientRect = () => ({ bottom: heroBottom }) as DOMRect
  document.getElementById(endId)!.getBoundingClientRect = () => ({ top: contactTop }) as DOMRect
}

function bar() {
  return screen.getByRole('link', { name: 'Scrivimi', hidden: true }).closest('[data-visible]')!
}

describe('MobileContactBar', () => {
  it('stays hidden and out of the tab order while the hero is on screen', () => {
    placeSections({ heroBottom: 400, contactTop: 5000 })
    render(<MobileContactBar />, { container: document.body.appendChild(document.createElement('div')) })

    expect(bar()).toHaveAttribute('data-visible', 'false')
    expect(bar()).toHaveAttribute('inert')
  })

  it('appears past the hero with links to the form and to WhatsApp', () => {
    placeSections({ heroBottom: -10, contactTop: 5000 })
    render(<MobileContactBar />, { container: document.body.appendChild(document.createElement('div')) })

    expect(bar()).toHaveAttribute('data-visible', 'true')
    expect(screen.getByRole('link', { name: 'Scrivimi' })).toHaveAttribute('href', '#contatti')
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/393287489645')
  })

  it('steps aside once the contact section reaches the screen', () => {
    placeSections({ heroBottom: -10, contactTop: 5000 })
    render(<MobileContactBar />, { container: document.body.appendChild(document.createElement('div')) })

    document.getElementById('contatti')!.getBoundingClientRect = () => ({ top: 300 }) as DOMRect
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(bar()).toHaveAttribute('data-visible', 'false')
  })

  it('follows custom start and end sections', () => {
    placeSections({ heroBottom: -10, contactTop: 5000, startId: PAGE_INTRO_ID, endId: PAGE_CTA_ID })
    render(<MobileContactBar startId={PAGE_INTRO_ID} endId={PAGE_CTA_ID} />, {
      container: document.body.appendChild(document.createElement('div')),
    })

    expect(bar()).toHaveAttribute('data-visible', 'true')

    document.getElementById(PAGE_CTA_ID)!.getBoundingClientRect = () => ({ top: 300 }) as DOMRect
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(bar()).toHaveAttribute('data-visible', 'false')
  })

  it('opens the drawer when asked', async () => {
    placeSections({ heroBottom: -10, contactTop: 5000, startId: PAGE_INTRO_ID, endId: PAGE_CTA_ID })
    render(
      <ContactDrawerProvider>
        <MobileContactBar startId={PAGE_INTRO_ID} endId={PAGE_CTA_ID} drawer />
      </ContactDrawerProvider>,
      { container: document.body.appendChild(document.createElement('div')) },
    )

    await userEvent.click(screen.getByRole('link', { name: 'Scrivimi' }))

    expect(await screen.findByRole('dialog', { name: 'Scrivimi' })).toBeInTheDocument()
  })
})
