import { act, fireEvent, render, screen } from '@testing-library/react'
import { Hero } from './hero'
import type { HeroSlide } from './hero-slides'

const slides: HeroSlide[] = [1, 2, 3].map((n) => ({
  kicker: `Kicker ${n}`,
  caption: `Didascalia ${n}`,
  image: { src: `/foto-${n}.jpg`, alt: `Foto ${n}` },
  project: { href: `/progetti/p-${n}`, title: `Progetto ${n}` },
}))

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = jest.fn().mockReturnValue({ matches: reduce, addEventListener: jest.fn(), removeEventListener: jest.fn() })
}

function counter() {
  return screen.getByLabelText(/^Immagine \d di 3$/)
}

function wait(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms)
  })
}

describe('Hero', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockReducedMotion(false)
  })
  afterEach(() => jest.useRealTimers())

  it('advances to the next image every 6 seconds and wraps around', () => {
    render(<Hero slides={slides} />)

    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')
    wait(5999)
    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')
    wait(1)
    expect(counter()).toHaveAccessibleName('Immagine 2 di 3')
    wait(6000)
    wait(6000)
    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')
  })

  it('restarts the countdown after a manual step', () => {
    render(<Hero slides={slides} />)

    wait(4000)
    fireEvent.click(screen.getByRole('button', { name: 'Immagine successiva' }))
    wait(4000)
    expect(counter()).toHaveAccessibleName('Immagine 2 di 3')
    wait(2000)
    expect(counter()).toHaveAccessibleName('Immagine 3 di 3')
  })

  it('holds still while the pointer is over the hero', () => {
    render(<Hero slides={slides} />)

    fireEvent.mouseEnter(screen.getByRole('region', { name: 'Apertura' }))
    wait(18000)
    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')

    fireEvent.mouseLeave(screen.getByRole('region', { name: 'Apertura' }))
    wait(6000)
    expect(counter()).toHaveAccessibleName('Immagine 2 di 3')
  })

  it('does not rotate on its own when the visitor prefers reduced motion', () => {
    mockReducedMotion(true)
    render(<Hero slides={slides} />)

    wait(18000)
    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')
  })

  it('links the current photo to its project', () => {
    render(<Hero slides={slides} />)

    expect(screen.getByRole('link', { name: 'Guarda il progetto: Progetto 1' })).toHaveAttribute('href', '/progetti/p-1')
    fireEvent.click(screen.getByRole('button', { name: 'Immagine successiva' }))
    expect(screen.getByRole('link', { name: 'Guarda il progetto: Progetto 2' })).toHaveAttribute('href', '/progetti/p-2')
  })

  it('hides the arrows and the counter with a single slide', () => {
    render(<Hero slides={slides.slice(0, 1)} />)

    expect(screen.queryByRole('button', { name: 'Immagine successiva' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Immagine 1 di 1')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Guarda il progetto: Progetto 1' })).toBeInTheDocument()
  })

  it('shows the studio photo without a project link when there are no slides', () => {
    render(<Hero slides={[]} />)

    expect(screen.getByText('ARCHITETTO A FONDI (LT)')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Guarda il progetto/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Immagine successiva' })).not.toBeInTheDocument()
  })

  it('leaves out the dash when the caption is empty', () => {
    render(<Hero slides={[{ ...slides[0], caption: '' }]} />)

    expect(screen.getByRole('link', { name: 'Guarda il progetto: Progetto 1' })).toHaveTextContent(/^Guarda il progetto$/)
  })
})
