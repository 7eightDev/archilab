import { fireEvent, render, screen } from '@testing-library/react'
import { BeforeAfter } from './before-after'

const before = { src: '/images/prima.jpg', alt: 'Il soggiorno prima dei lavori' }
const after = { src: '/images/dopo.jpg', alt: 'Il soggiorno dopo i lavori' }

describe('BeforeAfter', () => {
  it('starts halfway, with both photos described', () => {
    render(<BeforeAfter before={before} after={after} />)

    expect(screen.getByRole('slider', { name: 'Confronta prima e dopo' })).toHaveValue('50')
    expect(screen.getByTestId('after-layer')).toHaveStyle({ clipPath: 'inset(0 0 0 50%)' })
    expect(screen.getByAltText(before.alt)).toBeInTheDocument()
    expect(screen.getByAltText(after.alt)).toBeInTheDocument()
  })

  it('uncovers the "after" photo as the range moves', () => {
    render(<BeforeAfter before={before} after={after} />)

    fireEvent.change(screen.getByRole('slider'), { target: { value: '20' } })

    expect(screen.getByTestId('after-layer')).toHaveStyle({ clipPath: 'inset(0 0 0 20%)' })
  })
})
