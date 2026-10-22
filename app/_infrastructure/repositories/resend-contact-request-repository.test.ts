/** @jest-environment node */
import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import { ResendContactRequestRepository } from './resend-contact-request-repository'

const config = { apiKey: 're_test', from: 'Sito Archilab <sito@example.com>', to: 'studio@example.com' }

const request: ContactRequest = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  phone: '+39 0771 123456',
  interventionType: 'interior',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

function respondWith(status: number, body = '{}') {
  return jest.fn(async () => new Response(body, { status }))
}

describe('ResendContactRequestRepository', () => {
  it('emails the request to the studio, with the visitor as reply-to', async () => {
    const fetchMock = respondWith(200)

    await new ResendContactRequestRepository(config, fetchMock).save(request)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.headers).toMatchObject({ Authorization: 'Bearer re_test' })
    expect(JSON.parse(init.body as string)).toEqual({
      from: 'Sito Archilab <sito@example.com>',
      to: ['studio@example.com'],
      reply_to: 'mario@example.com',
      subject: 'Richiesta dal sito: Mario Bianchi',
      text:
        'Nome: Mario Bianchi\nEmail: mario@example.com\nTelefono: +39 0771 123456\nTipo di intervento: Interior\n\n' +
        'Vorrei un preventivo per ristrutturare casa.',
    })
  })

  it('leaves out the optional fields the visitor did not fill in', async () => {
    const fetchMock = respondWith(200)
    const { phone, interventionType, ...minimal } = request // eslint-disable-line @typescript-eslint/no-unused-vars

    await new ResendContactRequestRepository(config, fetchMock).save({ ...minimal, phone: '' })

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(init.body as string).text).toBe(
      'Nome: Mario Bianchi\nEmail: mario@example.com\n\nVorrei un preventivo per ristrutturare casa.',
    )
  })

  it('fails when Resend rejects the email', async () => {
    const repository = new ResendContactRequestRepository(config, respondWith(422, 'invalid from'))

    await expect(repository.save(request)).rejects.toThrow('Resend rejected the email: 422 invalid from')
  })
})
