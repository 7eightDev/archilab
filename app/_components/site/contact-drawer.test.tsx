import { createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactDrawerProvider, ContactDrawerTrigger } from './contact-drawer'
import { studio } from './content'

jest.mock('@/app/_actions/submit-contact-form', () => ({ submitContactForm: jest.fn() }))

function renderDrawer() {
  return render(
    <ContactDrawerProvider>
      <ContactDrawerTrigger>Scrivimi</ContactDrawerTrigger>
    </ContactDrawerProvider>,
  )
}

function trigger() {
  return screen.getByRole('link', { name: 'Scrivimi' })
}

describe('ContactDrawer', () => {
  it('falls back to the contact section of the home', () => {
    renderDrawer()

    expect(trigger()).toHaveAttribute('href', '/#contatti')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // A veil of the page's own petrolio left the panel blending in; the footer's darker tone sets it apart.
  it('darkens the page behind the open drawer', async () => {
    renderDrawer()
    await userEvent.click(trigger())
    await screen.findByRole('dialog', { name: 'Scrivimi' })

    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass('bg-petrolio-3/85')
  })

  it('opens the drawer from a trigger', async () => {
    renderDrawer()

    await userEvent.click(trigger())

    const dialog = await screen.findByRole('dialog', { name: 'Scrivimi' })
    expect(within(dialog).getByRole('textbox', { name: 'Nome *' })).toBeInTheDocument()
  })

  it('closes on Escape and gives the focus back to the trigger', async () => {
    renderDrawer()
    await userEvent.click(trigger())
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger()).toHaveFocus()
  })

  it('closes from its close button', async () => {
    renderDrawer()
    await userEvent.click(trigger())

    await userEvent.click(await screen.findByRole('button', { name: 'Chiudi' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('keeps the draft when closed and reopened', async () => {
    renderDrawer()
    await userEvent.click(trigger())
    await userEvent.type(await screen.findByRole('textbox', { name: 'Nome *' }), 'Mario')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await userEvent.click(trigger())

    expect(await screen.findByRole('textbox', { name: 'Nome *' })).toHaveValue('Mario')
  })

  it('follows the link on a modified click', () => {
    renderDrawer()

    const click = createEvent.click(trigger(), { ctrlKey: true })
    fireEvent(trigger(), click)

    expect(click.defaultPrevented).toBe(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('runs the extra click handler, as the header menu needs', async () => {
    const onClick = jest.fn()
    render(
      <ContactDrawerProvider>
        <ContactDrawerTrigger onClick={onClick}>Scrivimi</ContactDrawerTrigger>
      </ContactDrawerProvider>,
    )

    await userEvent.click(trigger())

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('offers phone and WhatsApp next to the form', async () => {
    renderDrawer()

    await userEvent.click(trigger())

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('link', { name: studio.phone })).toHaveAttribute('href', studio.phoneHref)
    expect(within(dialog).getByRole('link', { name: 'Scrivimi su WhatsApp' })).toHaveAttribute('href', studio.whatsappHref)
  })
})
