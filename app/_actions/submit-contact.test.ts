/** @jest-environment node */
import { submitContactRequest } from '@/app/_infrastructure/container'
import { submitContact } from './submit-contact'
import { initialContactFormState } from './contact-form-state'

function formData(entries: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.append(key, value)
  return data
}

const validEntries = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: 'on',
}

afterEach(() => jest.restoreAllMocks())

describe('submitContact', () => {
  it('reports success and clears the values for a valid request', async () => {
    const state = await submitContact(initialContactFormState, formData(validEntries))

    expect(state.status).toBe('success')
    expect(state.values).toEqual(initialContactFormState.values)
  })

  it('passes the checkbox as a boolean', async () => {
    const execute = jest.spyOn(submitContactRequest, 'execute')

    await submitContact(initialContactFormState, formData(validEntries))

    expect(execute).toHaveBeenCalledWith({
      name: 'Mario Bianchi',
      email: 'mario@example.com',
      message: 'Vorrei un preventivo per ristrutturare casa.',
      privacyConsent: true,
    })
  })

  it('returns field errors and keeps the typed values when the request is invalid', async () => {
    const { privacyConsent, ...withoutConsent } = validEntries
    void privacyConsent

    const state = await submitContact(
      initialContactFormState,
      formData({ ...withoutConsent, email: 'mario@' }),
    )

    expect(state.status).toBe('error')
    expect(state.fieldErrors.email).toEqual(['Indirizzo email non valido'])
    expect(state.fieldErrors.privacyConsent).toEqual(["Devi accettare l'informativa sulla privacy"])
    expect(state.values).toEqual({
      name: 'Mario Bianchi',
      email: 'mario@',
          message: 'Vorrei un preventivo per ristrutturare casa.',
    })
  })

  it('returns a form error when the request cannot be delivered', async () => {
    jest.spyOn(submitContactRequest, 'execute').mockRejectedValue(new Error('SMTP non raggiungibile'))
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const state = await submitContact(initialContactFormState, formData(validEntries))

    expect(state.status).toBe('error')
    expect(state.formErrors).toEqual([
      'Non è stato possibile inviare la richiesta. Riprova tra qualche minuto.',
    ])
    expect(state.values.name).toBe('Mario Bianchi')
  })
})
