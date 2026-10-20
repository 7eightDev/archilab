/** @jest-environment node */
import { getFeaturedProject, listServices, submitContactRequest } from './container'

describe('container', () => {
  it('wires GetFeaturedProject to the mock projects', async () => {
    expect((await getFeaturedProject.execute())?.slug).toBe('villa-sul-mare')
  })

  it('wires ListServices to the mock services', async () => {
    const services = await listServices.execute()

    expect(services[0].slug).toBe('progettazione-architettonica')
  })

  it('accepts contact requests while email delivery is disabled', async () => {
    const result = await submitContactRequest.execute({
      name: 'Mario Bianchi',
      email: 'mario@example.com',
      message: 'Vorrei un preventivo per ristrutturare casa.',
      privacyConsent: true,
    })

    expect(result).toEqual({ ok: true })
  })
})
