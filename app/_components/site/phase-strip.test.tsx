import { act, render, screen } from '@testing-library/react'
import type { GalleryImage } from '@/app/_domain/entities/shared'
import { PhaseStrip } from './phase-strip'

function makeImages(count: number): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/fase-${i + 1}.jpg`,
    alt: `Fase ${i + 1}`,
    tag: `FASE ${i + 1}`,
    caption: `Didascalia ${i + 1}`,
    // Every other phase has a description.
    ...(i % 2 === 0 ? { description: `Com'è andata la fase ${i + 1}` } : {}),
  }))
}

describe('PhaseStrip', () => {
  it.each([1, 2, 8])('renders one figure per image with its tag and caption (%p)', (count) => {
    render(<PhaseStrip images={makeImages(count)} />)

    expect(screen.getAllByRole('figure')).toHaveLength(count)
    expect(screen.getByText(`FASE ${count}`)).toBeInTheDocument()
    expect(screen.getByText(`Didascalia ${count}`)).toBeInTheDocument()
  })

  it('renders nothing without images', () => {
    const { container } = render(<PhaseStrip images={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('makes only the phases with a description focusable', () => {
    render(<PhaseStrip images={makeImages(2)} />)
    const [withDescription, without] = screen.getAllByRole('figure')

    expect(withDescription).toHaveAttribute('tabindex', '0')
    expect(without).not.toHaveAttribute('tabindex')
  })

  it('keeps every description in the document', () => {
    render(<PhaseStrip images={makeImages(4)} />)

    expect(screen.getByText("Com'è andata la fase 1")).toBeInTheDocument()
    expect(screen.getByText("Com'è andata la fase 3")).toBeInTheDocument()
  })

  it('widens the focused phase', () => {
    render(<PhaseStrip images={makeImages(3)} />)
    const figures = screen.getAllByRole('figure')

    act(() => figures[2].focus())

    expect(figures[2]).toHaveAttribute('data-active', 'true')
    expect(figures[0]).toHaveAttribute('data-active', 'false')
  })
})
