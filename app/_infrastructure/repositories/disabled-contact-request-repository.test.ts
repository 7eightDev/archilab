/** @jest-environment node */
import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import { ContactDeliveryUnavailableError } from '@/app/_domain/repositories/contact-request-repository'
import { DisabledContactRequestRepository } from './disabled-contact-request-repository'

const request: ContactRequest = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

describe('DisabledContactRequestRepository', () => {
  it('refuses the request instead of silently dropping it', async () => {
    await expect(new DisabledContactRequestRepository().save(request)).rejects.toBeInstanceOf(
      ContactDeliveryUnavailableError,
    )
  })
})
