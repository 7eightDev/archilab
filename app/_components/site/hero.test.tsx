import { act, fireEvent, render, screen } from '@testing-library/react'
import type { HeroSlide } from './content'
import { Hero } from './hero'

const slides = [1, 2, 3].map((n) => ({
  kicker: `Kicker ${n}`,
  caption: `Didascalia ${n}`,
  image: { src: `/foto-${n}.jpg`, alt: `Foto ${n}` },
})) as HeroSlide[]

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
    render(<Hero slides={slides} showProjectLink />)

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
    render(<Hero slides={slides} showProjectLink />)

    wait(4000)
    fireEvent.click(screen.getByRole('button', { name: 'Immagine successiva' }))
    wait(4000)
    expect(counter()).toHaveAccessibleName('Immagine 2 di 3')
    wait(2000)
    expect(counter()).toHaveAccessibleName('Immagine 3 di 3')
  })

  it('holds still while the pointer is over the hero', () => {
    render(<Hero slides={slides} showProjectLink />)

    fireEvent.mouseEnter(screen.getByRole('region', { name: 'Apertura' }))
    wait(18000)
    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')

    fireEvent.mouseLeave(screen.getByRole('region', { name: 'Apertura' }))
    wait(6000)
    expect(counter()).toHaveAccessibleName('Immagine 2 di 3')
  })

  it('does not rotate on its own when the visitor prefers reduced motion', () => {
    mockReducedMotion(true)
    render(<Hero slides={slides} showProjectLink />)

    wait(18000)
    expect(counter()).toHaveAccessibleName('Immagine 1 di 3')
  })
})
