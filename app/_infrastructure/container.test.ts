/** @jest-environment node */
import { ContactDeliveryUnavailableError } from '@/app/_domain/repositories/contact-request-repository'
import { contactRequestRepositoryFromEnv, getFeaturedProject, listServices, submitContactRequest } from './container'
import { DisabledContactRequestRepository } from './repositories/disabled-contact-request-repository'
import { ResendContactRequestRepository } from './repositories/resend-contact-request-repository'

describe('container', () => {
  it('wires GetFeaturedProject to the studio projects', async () => {
    expect((await getFeaturedProject.execute())?.slug).toBe('appartamento-fondi')
  })

  it('wires ListServices to the studio services', async () => {
    const services = await listServices.execute()

    expect(services[0].slug).toBe('architettura')
  })

  it('refuses contact requests while email delivery is disabled', async () => {
    const result = submitContactRequest.execute({
      name: 'Mario Bianchi',
      email: 'mario@example.com',
      message: 'Vorrei un preventivo per ristrutturare casa.',
      privacyConsent: true,
    })

    await expect(result).rejects.toBeInstanceOf(ContactDeliveryUnavailableError)
  })

  describe('contactRequestRepositoryFromEnv', () => {
    const configured = {
      RESEND_API_KEY: 're_test',
      CONTACT_FROM_EMAIL: 'sito@example.com',
      CONTACT_EMAIL: 'studio@example.com',
    }

    it('emails requests through Resend when it is fully configured', () => {
      expect(contactRequestRepositoryFromEnv(configured)).toBeInstanceOf(ResendContactRequestRepository)
    })

    it.each(['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_EMAIL'])('stays disabled without %s', (key) => {
      expect(contactRequestRepositoryFromEnv({ ...configured, [key]: ' ' })).toBeInstanceOf(
        DisabledContactRequestRepository,
      )
    })
  })
})
