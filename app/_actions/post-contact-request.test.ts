/** @jest-environment node */
import { initialContactFormState } from './contact-form-state'
import { postContactRequest } from './post-contact-request'

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

function respondWith(status: number, body: unknown) {
  return jest.fn(async () => new Response(JSON.stringify(body), { status }))
}

const originalFetch = global.fetch
afterEach(() => {
  global.fetch = originalFetch
})

describe('postContactRequest', () => {
  it('posts the form as JSON to the contact endpoint', async () => {
    const fetchMock = respondWith(200, { ok: true })
    global.fetch = fetchMock

    await postContactRequest(initialContactFormState, formData(validEntries))

    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mario Bianchi',
        email: 'mario@example.com',
        message: 'Vorrei un preventivo per ristrutturare casa.',
        privacyConsent: true,
      }),
    })
  })

  it('reports success and clears the values', async () => {
    global.fetch = respondWith(200, { ok: true })

    const state = await postContactRequest(initialContactFormState, formData(validEntries))

    expect(state).toEqual({ ...initialContactFormState, status: 'success' })
  })

  it('maps validation errors to the fields and keeps the typed values', async () => {
    global.fetch = respondWith(422, {
      ok: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Controlla i campi evidenziati.',
        fieldErrors: { email: ['Indirizzo email non valido'] },
        formErrors: [],
      },
    })

    const state = await postContactRequest(
      initialContactFormState,
      formData({ ...validEntries, email: 'mario@' }),
    )

    expect(state.status).toBe('error')
    expect(state.fieldErrors.email).toEqual(['Indirizzo email non valido'])
    expect(state.values).toEqual({
      name: 'Mario Bianchi',
      email: 'mario@',
      message: 'Vorrei un preventivo per ristrutturare casa.',
    })
  })

  it('shows the server message when delivery fails', async () => {
    global.fetch = respondWith(500, {
      ok: false,
      error: { code: 'DELIVERY_FAILED', message: 'Messaggio non inviato per un problema tecnico.' },
    })

    const state = await postContactRequest(initialContactFormState, formData(validEntries))

    expect(state.formErrors).toEqual(['Messaggio non inviato per un problema tecnico.'])
    expect(state.values.name).toBe('Mario Bianchi')
  })

  it('shows a connection error when the request never reaches the server', async () => {
    global.fetch = jest.fn(async () => {
      throw new TypeError('Failed to fetch')
    })

    const state = await postContactRequest(initialContactFormState, formData(validEntries))

    expect(state.status).toBe('error')
    expect(state.formErrors[0]).toMatch(/connessione/)
  })
})
