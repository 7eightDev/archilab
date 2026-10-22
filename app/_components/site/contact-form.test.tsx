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
  await user.selectOptions(screen.getByLabelText('Tipo di intervento'), 'Pratiche urbanistiche')
  await user.type(screen.getByLabelText('Raccontami l’idea *'), filledValues.message)
  await user.click(screen.getByRole('checkbox', { name: /informativa privacy/ }))
  return user
}

describe('ContactForm', () => {
  it('gives every field an accessible label and marks the required ones', () => {
    render(<ContactForm action={jest.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Nome *' })).toBeRequired()
    expect(screen.getByRole('textbox', { name: 'Email *' })).toBeRequired()
    expect(screen.getByRole('textbox', { name: 'Telefono (facoltativo)' })).not.toBeRequired()
    expect(screen.getByRole('combobox', { name: 'Tipo di intervento' })).toHaveValue('non-so')
    expect(screen.getByRole('textbox', { name: 'Raccontami l’idea *' })).toBeRequired()
    expect(screen.getByRole('checkbox', { name: /informativa privacy/ })).toBeRequired()
  })

  it('checks the form with the domain schema before calling the action', async () => {
    const action = jest.fn()
    render(<ContactForm action={action} />)

    await userEvent.click(screen.getByRole('button', { name: /Invia il messaggio/ }))

    expect(action).not.toHaveBeenCalled()
    expect(screen.getByText('Controlla i 4 campi evidenziati.')).toBeInTheDocument()
    const name = screen.getByLabelText('Nome *')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAccessibleDescription('Scrivi il tuo nome')
    expect(screen.getByLabelText('Email *')).toHaveAccessibleDescription('Scrivi il tuo indirizzo email')
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Serve il tuo consenso per poterti ricontattare')
    expect(screen.getByLabelText('Telefono (facoltativo)')).not.toHaveAttribute('aria-invalid')
    await waitFor(() => expect(name).toHaveFocus())
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
    expect(screen.getByRole('checkbox')).not.toBeChecked()
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
    expect(screen.getByRole('checkbox')).toBeChecked()
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
