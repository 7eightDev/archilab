/** @jest-environment node */
import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import { DisabledContactRequestRepository } from './disabled-contact-request-repository'

const request: ContactRequest = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

describe('DisabledContactRequestRepository', () => {
  it('accepts a request without sending or storing it', async () => {
    await expect(new DisabledContactRequestRepository().save(request)).resolves.toBeUndefined()
  })
})
