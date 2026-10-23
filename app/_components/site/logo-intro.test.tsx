import { act, fireEvent, render } from '@testing-library/react'
import { INTRO_FADE_AT_MS, INTRO_STORAGE_KEY, LogoIntro } from './logo-intro'

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = jest.fn().mockReturnValue({ matches: reduce, addEventListener: jest.fn(), removeEventListener: jest.fn() })
}

function overlay() {
  return document.querySelector('.logo-intro')
}

beforeEach(() => {
  jest.useFakeTimers()
  localStorage.clear()
  document.documentElement.removeAttribute('data-intro')
  mockReducedMotion(false)
})

afterEach(() => jest.useRealTimers())

describe('LogoIntro', () => {
  it('plays on the first visit: marks the page and keeps the overlay out of the accessibility tree', () => {
    render(<LogoIntro />)

    expect(document.documentElement).toHaveAttribute('data-intro', 'play')
    expect(overlay()).toHaveAttribute('aria-hidden', 'true')
  })

  it('fades away once the logo is drawn and remembers the visit', () => {
    render(<LogoIntro />)

    act(() => jest.advanceTimersByTime(INTRO_FADE_AT_MS))

    expect(overlay()).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveAttribute('data-intro')
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('can be skipped with a key, a click or a scroll', () => {
    for (const skip of [
      () => fireEvent.keyDown(window, { key: 'Enter' }),
      () => fireEvent.pointerDown(window),
      () => fireEvent.wheel(window),
    ]) {
      localStorage.clear()
      const { unmount } = render(<LogoIntro />)

      act(skip)

      expect(overlay()).not.toBeInTheDocument()
      expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
      unmount()
    }
  })

  it('stays away for returning visitors', () => {
    localStorage.setItem(INTRO_STORAGE_KEY, '1')

    render(<LogoIntro />)

    expect(overlay()).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveAttribute('data-intro')
  })

  it('stays away when the visitor asks for reduced motion', () => {
    mockReducedMotion(true)

    render(<LogoIntro />)

    expect(overlay()).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveAttribute('data-intro')
  })
})
