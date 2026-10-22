/** @jest-environment node */
import { ContactDeliveryUnavailableError } from '@/app/_domain/repositories/contact-request-repository'
import { submitContactRequest } from '@/app/_infrastructure/container'
import { initialContactFormState } from './contact-form-state'
import { submitContactForm } from './submit-contact-form'

function formData(entries: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.append(key, value)
  return data
}

const validEntries = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  phone: '',
  interventionType: 'interior',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: 'on',
}

const originalContactEmail = process.env.CONTACT_EMAIL
afterEach(() => {
  jest.restoreAllMocks()
  process.env.CONTACT_EMAIL = originalContactEmail
})

describe('submitContactForm', () => {
  it('hands the form to SubmitContactRequest, leaving out an empty phone', async () => {
    const execute = jest.spyOn(submitContactRequest, 'execute').mockResolvedValue({ ok: true })

    await submitContactForm(initialContactFormState, formData(validEntries))

    expect(execute).toHaveBeenCalledWith({
      name: 'Mario Bianchi',
      email: 'mario@example.com',
      interventionType: 'interior',
      message: 'Vorrei un preventivo per ristrutturare casa.',
      privacyConsent: true,
    })
  })

  it('reports success and keeps the values for the thank-you message', async () => {
    jest.spyOn(submitContactRequest, 'execute').mockResolvedValue({ ok: true })

    const state = await submitContactForm(initialContactFormState, formData(validEntries))

    expect(state.status).toBe('success')
    expect(state.values.name).toBe('Mario Bianchi')
    expect(state.formErrors).toEqual([])
  })

  it('returns the domain errors for each field and keeps what was typed', async () => {
    const state = await submitContactForm(
      initialContactFormState,
      formData({ ...validEntries, email: 'mario@', message: 'Ciao', privacyConsent: '' }),
    )

    expect(state.status).toBe('error')
    expect(state.fieldErrors.email).toEqual(['Indirizzo email non valido: controlla che sia completo'])
    expect(state.fieldErrors.message).toEqual(['Scrivi almeno 10 caratteri, bastano poche parole'])
    expect(state.fieldErrors.privacyConsent).toEqual(['Serve il tuo consenso per poterti ricontattare'])
    expect(state.values).toMatchObject({ email: 'mario@', message: 'Ciao', interventionType: 'interior' })
    expect(state.consentGiven).toBe(false)
  })

  it('passes on the studio address when the form cannot deliver', async () => {
    process.env.CONTACT_EMAIL = 'studio@example.com'
    jest.spyOn(submitContactRequest, 'execute').mockRejectedValue(new ContactDeliveryUnavailableError())

    const state = await submitContactForm(initialContactFormState, formData(validEntries))

    expect(state.formErrors).toEqual(['Il modulo non è ancora attivo: il messaggio non è partito.'])
    expect(state.fallbackEmail).toBe('studio@example.com')
    expect(state.values.message).toBe('Vorrei un preventivo per ristrutturare casa.')
  })

  it('reports a delivery failure without leaking details', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(submitContactRequest, 'execute').mockRejectedValue(new Error('Resend rejected the email: 401'))

    const state = await submitContactForm(initialContactFormState, formData(validEntries))

    expect(state.status).toBe('error')
    expect(state.formErrors).toEqual(['Non è stato possibile inviare il messaggio. Riprova tra qualche minuto.'])
    expect(state.fallbackEmail).toBeUndefined()
  })
})
