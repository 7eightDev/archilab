import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ContactFormState, initialContactFormState } from '@/app/_actions/contact-form-state'
import { ContactForm } from './contact-form'

const filledValues = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  phone: '',
  interventionType: 'pratiche',
  message: 'Vorrei ristrutturare il bagno.',
}

async function fillValidForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Nome *'), filledValues.name)
  await user.type(screen.getByLabelText('Email *'), filledValues.email)
  await user.click(screen.getByRole('combobox', { name: 'Tipo di intervento *' }))
  await user.click(await screen.findByRole('option', { name: 'Pratiche urbanistiche' }))
  await user.type(screen.getByLabelText('Raccontami l’idea *'), filledValues.message)
  await user.click(screen.getByRole('switch', { name: /trattamento dei miei dati/ }))
  return user
}

describe('ContactForm', () => {
  it('gives every field an accessible label and marks the required ones', () => {
    render(<ContactForm action={jest.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Nome *' })).toBeRequired()
    expect(screen.getByRole('textbox', { name: 'Email *' })).toBeRequired()
    expect(screen.getByRole('textbox', { name: 'Telefono (facoltativo)' })).not.toBeRequired()
    expect(screen.getByRole('combobox', { name: 'Tipo di intervento *' })).toHaveTextContent('Non so ancora')
    expect(screen.getByRole('textbox', { name: 'Raccontami l’idea *' })).toBeRequired()
    expect(screen.getByRole('switch', { name: /trattamento dei miei dati/ })).toHaveAttribute('aria-required', 'true')
  })

  it('keeps the send button disabled until every required field is filled', async () => {
    render(<ContactForm action={jest.fn()} />)
    const send = screen.getByRole('button', { name: /Invia il messaggio/ })
    expect(send).toBeDisabled()

    const user = await fillValidForm()
    expect(send).toBeEnabled()

    await user.click(screen.getByRole('switch'))
    expect(send).toBeDisabled()
    await user.click(screen.getByRole('switch'))
    await user.clear(screen.getByLabelText('Nome *'))
    expect(send).toBeDisabled()
    await user.type(screen.getByLabelText('Nome *'), '   ')
    expect(send).toBeDisabled()
  })

  it('checks the form with the domain schema before calling the action', async () => {
    const action = jest.fn()
    render(<ContactForm action={action} />)
    const user = await fillValidForm()
    await user.clear(screen.getByLabelText('Email *'))
    await user.type(screen.getByLabelText('Email *'), 'mario')
    await user.clear(screen.getByLabelText('Raccontami l’idea *'))
    await user.type(screen.getByLabelText('Raccontami l’idea *'), 'Ciao')

    await user.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    expect(action).not.toHaveBeenCalled()
    expect(screen.getByText('Controlla i 2 campi evidenziati.')).toBeInTheDocument()
    const email = screen.getByLabelText('Email *')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Nome *')).not.toHaveAttribute('aria-invalid')
    expect(screen.getByLabelText('Telefono (facoltativo)')).not.toHaveAttribute('aria-invalid')
    await waitFor(() => expect(email).toHaveFocus())
  })

  it('counts a single error in the singular', async () => {
    render(<ContactForm action={jest.fn()} />)
    const user = await fillValidForm()
    await user.clear(screen.getByLabelText('Raccontami l’idea *'))
    await user.type(screen.getByLabelText('Raccontami l’idea *'), 'Ciao')

    await user.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    expect(screen.getByText('Controlla il campo evidenziato.')).toBeInTheDocument()
    expect(screen.getByLabelText('Raccontami l’idea *')).toHaveAccessibleDescription(
      'Scrivi almeno 10 caratteri, bastano poche parole',
    )
  })

  it('submits a valid form and thanks the visitor by name', async () => {
    const action = jest.fn(
      async (_state: ContactFormState, formData: FormData): Promise<ContactFormState> => ({
        ...initialContactFormState,
        status: 'success',
        values: { ...filledValues, name: String(formData.get('name')) },
      }),
    )
    render(<ContactForm action={action} />)
    const user = await fillValidForm()

    await user.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent('Grazie Mario Bianchi, ho ricevuto il tuo messaggio.')
    expect(status).toHaveFocus()
    const formData = action.mock.calls[0][1]
    expect(Object.fromEntries(formData)).toMatchObject({ ...filledValues, privacyConsent: 'on' })
    expect(screen.queryByRole('button', { name: /Invia il messaggio/ })).not.toBeInTheDocument()
  })

  it('starts over with an empty form after "Scrivi un altro messaggio"', async () => {
    const action = jest.fn(async (): Promise<ContactFormState> => ({ ...initialContactFormState, status: 'success', values: filledValues }))
    render(<ContactForm action={action} />)
    const user = await fillValidForm()
    await user.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    await user.click(await screen.findByRole('button', { name: 'Scrivi un altro messaggio' }))

    expect(screen.getByLabelText('Nome *')).toHaveValue('')
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('shows the errors returned by the server under each field', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({
        status: 'error',
        fieldErrors: { email: ['Indirizzo email non valido: controlla che sia completo'] },
        formErrors: [],
        values: { ...filledValues, email: 'mario@example' },
        consentGiven: true,
      }),
    )
    render(<ContactForm action={action} />)
    const user = await fillValidForm()

    await user.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    const email = await screen.findByDisplayValue('mario@example')
    expect(email).toHaveAccessibleDescription('Indirizzo email non valido: controlla che sia completo')
    expect(screen.getByText('Controlla il campo evidenziato.')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeChecked()
    await waitFor(() => expect(email).toHaveFocus())
  })

  it('offers the studio email, pre-filled, when the form cannot deliver', async () => {
    const action = jest.fn(
      async (): Promise<ContactFormState> => ({
        status: 'error',
        fieldErrors: {},
        formErrors: ['Il modulo non è ancora attivo: il messaggio non è partito.'],
        values: filledValues,
        consentGiven: true,
        fallbackEmail: 'studio@example.com',
      }),
    )
    render(<ContactForm action={action} />)
    const user = await fillValidForm()

    await user.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Il modulo non è ancora attivo: il messaggio non è partito.')
    const link = screen.getByRole('link', { name: /studio@example.com/ })
    expect(link.getAttribute('href')).toMatch(/^mailto:studio@example\.com\?subject=/)
    expect(decodeURIComponent(link.getAttribute('href')!)).toContain(filledValues.message)
  })
})
