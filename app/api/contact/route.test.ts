/** @jest-environment node */
import { submitContactRequest } from '@/app/_infrastructure/container'
import { POST } from './route'

const validRequest = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

function post(body: string) {
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }),
  )
}

afterEach(() => jest.restoreAllMocks())

describe('POST /api/contact', () => {
  it('accepts a valid request', async () => {
    const response = await post(JSON.stringify(validRequest))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
  })

  it('hands the parsed body to the use case', async () => {
    const execute = jest.spyOn(submitContactRequest, 'execute')

    await post(JSON.stringify(validRequest))

    expect(execute).toHaveBeenCalledWith(validRequest)
  })

  it('returns field errors with 422 when the request is invalid', async () => {
    const response = await post(JSON.stringify({ ...validRequest, email: 'mario@', privacyConsent: false }))

    expect(response.status).toBe(422)
    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(body.error.code).toBe('VALIDATION_FAILED')
    expect(body.error.fieldErrors.email).toEqual(['Indirizzo email non valido'])
    expect(body.error.fieldErrors.privacyConsent).toEqual(["Devi accettare l'informativa sulla privacy"])
  })

  it.each(['non è json', '"una stringa"', '[]', 'null'])('rejects a body that is not a JSON object (%p) with 400', async (body) => {
    const response = await post(body)

    expect(response.status).toBe(400)
    expect((await response.json()).error.code).toBe('INVALID_BODY')
  })

  it('returns 500 without leaking details when delivery fails', async () => {
    jest.spyOn(submitContactRequest, 'execute').mockRejectedValue(new Error('SMTP non raggiungibile'))
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const response = await post(JSON.stringify(validRequest))

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error.code).toBe('DELIVERY_FAILED')
    expect(JSON.stringify(body)).not.toContain('SMTP')
  })
})
