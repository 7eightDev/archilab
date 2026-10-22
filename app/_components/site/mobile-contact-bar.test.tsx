import { act, render, screen } from '@testing-library/react'
import { MobileContactBar } from './mobile-contact-bar'

function placeSections({ heroBottom, contactTop }: { heroBottom: number; contactTop: number }) {
  document.body.innerHTML = '<section id="top"></section><section id="contatti"></section>'
  document.getElementById('top')!.getBoundingClientRect = () => ({ bottom: heroBottom }) as DOMRect
  document.getElementById('contatti')!.getBoundingClientRect = () => ({ top: contactTop }) as DOMRect
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
})
