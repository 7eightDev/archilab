import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ContactFormState } from '@/app/_actions/contact-form-state'
import { initialContactFormState } from '@/app/_actions/contact-form-state'
import { ContactForm } from './contact-form'
import { ContactSection } from './contact-section'

describe('ContactForm', () => {
  it('gives every field an accessible label', () => {
    render(<ContactForm action={jest.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Nome' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Il tuo messaggio' })).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /Acconsento al trattamento dei miei dati/ }),
    ).toBeInTheDocument()
  })

  it('marks every field as required for assistive technologies', () => {
    render(<ContactForm action={jest.fn()} />)

    expect(screen.getByLabelText('Nome')).toBeRequired()
    expect(screen.getByLabelText('Email')).toBeRequired()
    expect(screen.getByLabelText('Il tuo messaggio')).toBeRequired()
    expect(screen.getByRole('checkbox')).toBeRequired()
  })

  it('keeps an empty live region ready so the confirmation gets announced', () => {
    render(<ContactForm action={jest.fn()} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('moves focus to the first invalid field', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({
        status: 'error',
        fieldErrors: { email: ['Indirizzo email non valido'], message: ['Troppo corto'] },
        formErrors: [],
        values: { name: 'Mario', email: 'mario@', message: 'Ciao' },
      }),
    )
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Invia' }))

    await waitFor(() => expect(screen.getByLabelText('Email')).toHaveFocus())
  })

  it('shows field errors returned by the action and keeps the typed values', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({
        status: 'error',
        fieldErrors: { email: ['Indirizzo email non valido'] },
        formErrors: [],
        values: { name: 'Mario', email: 'mario@', message: 'Vorrei un preventivo.' },
      }),
    )
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Invia' }))

    const email = await screen.findByLabelText('Email')
    expect(email).toHaveAccessibleDescription('Indirizzo email non valido')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveValue('mario@')
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid')
  })

  it('confirms the request once the action succeeds', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({ ...initialContactFormState, status: 'success' }),
    )
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Invia' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Messaggio ricevuto')
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

    await userEvent.click(screen.getByRole('button', { name: 'Invia' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Non è stato possibile inviare')
  })
})

describe('ContactSection', () => {
  it('invites the visitor to describe their idea', () => {
    render(<ContactSection action={jest.fn()} />)

    const section = screen.getByRole('region', { name: 'Raccontami la tua idea' })
    expect(section).toHaveAttribute('id', 'contatti')
    expect(section).toHaveTextContent('Hai un progetto in mente, anche solo abbozzato?')
  })
})
