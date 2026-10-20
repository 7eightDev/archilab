import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ContactFormState } from '@/app/_actions/contact-form-state'
import { initialContactFormState } from '@/app/_actions/contact-form-state'
import { ContactForm } from './contact-form'

describe('ContactForm', () => {
  it('gives every field an accessible label', () => {
    render(<ContactForm action={jest.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Nome e cognome' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Telefono (facoltativo)' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Di cosa hai bisogno?' })).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /Acconsento al trattamento dei miei dati/ }),
    ).toBeInTheDocument()
  })

  it('shows field errors returned by the action and keeps the typed values', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({
        status: 'error',
        fieldErrors: { email: ['Indirizzo email non valido'] },
        formErrors: [],
        values: { name: 'Mario', email: 'mario@', phone: '', message: 'Vorrei un preventivo.' },
      }),
    )
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

    const email = await screen.findByLabelText('Email')
    expect(email).toHaveAccessibleDescription('Indirizzo email non valido')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveValue('mario@')
    expect(screen.getByLabelText('Nome e cognome')).not.toHaveAttribute('aria-invalid')
  })

  it('confirms the request once the action succeeds', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({ ...initialContactFormState, status: 'success' }),
    )
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Richiesta inviata')
  })

  it('shows form-level errors', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({
        ...initialContactFormState,
        status: 'error',
        formErrors: ['Non è stato possibile inviare la richiesta. Riprova tra qualche minuto.'],
      }),
    )
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Invia la richiesta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Non è stato possibile inviare')
  })
})
