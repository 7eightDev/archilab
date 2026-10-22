/** @jest-environment node */
import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import { InMemoryContactRequestRepository } from './in-memory-contact-request-repository'

const request: ContactRequest = {
  name: 'Mario Bianchi',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

describe('InMemoryContactRequestRepository', () => {
  it('keeps a copy of every saved request', async () => {
    const repository = new InMemoryContactRequestRepository()

    await repository.save(request)

    expect(repository.saved).toEqual([request])
    expect(repository.saved[0]).not.toBe(request)
  })
})
