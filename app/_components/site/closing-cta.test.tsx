import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClosingCta } from './closing-cta'
import { ContactDrawerProvider } from './contact-drawer'
import { studio } from './content'
import { PAGE_CTA_ID } from './mobile-contact-bar'

jest.mock('@/app/_actions/submit-contact-form', () => ({ submitContactForm: jest.fn() }))

function renderCta() {
  return render(
    <ContactDrawerProvider>
      <ClosingCta title="Hai un progetto simile?" />
    </ContactDrawerProvider>,
  )
}

describe('ClosingCta', () => {
  it('closes the page with its title and a WhatsApp link', () => {
    const { container } = renderCta()

    expect(container.querySelector(`section#${PAGE_CTA_ID}`)).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Hai un progetto simile? Scrivimi.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', studio.whatsappHref)
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('target', '_blank')
  })

  it('opens the drawer from Scrivimi', async () => {
    renderCta()

    await userEvent.click(screen.getByRole('link', { name: 'Scrivimi' }))

    expect(await screen.findByRole('dialog', { name: 'Scrivimi' })).toBeInTheDocument()
  })
})
