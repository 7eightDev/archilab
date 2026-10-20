import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import type { ContactRequestRepository } from '@/app/_domain/repositories/contact-request-repository'
import { SubmitContactRequest } from './submit-contact-request'

class InMemoryContactRequestRepository implements ContactRequestRepository {
  readonly saved: ContactRequest[] = []

  async save(request: ContactRequest) {
    this.saved.push(request)
  }
}

const validInput = {
  name: ' Mario Bianchi ',
  email: 'mario@example.com',
  message: 'Vorrei un preventivo per ristrutturare casa.',
  privacyConsent: true,
}

describe('SubmitContactRequest', () => {
  it('saves a valid request and reports success', async () => {
    const repository = new InMemoryContactRequestRepository()

    const result = await new SubmitContactRequest(repository).execute(validInput)

    expect(result).toEqual({ ok: true })
    expect(repository.saved).toEqual([{ ...validInput, name: 'Mario Bianchi' }])
  })

  it('does not save an invalid request and returns field errors', async () => {
    const repository = new InMemoryContactRequestRepository()

    const result = await new SubmitContactRequest(repository).execute({
      ...validInput,
      email: 'non-una-email',
      privacyConsent: false,
    })

    expect(repository.saved).toEqual([])
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.fieldErrors.email).toEqual(['Indirizzo email non valido'])
    expect(result.fieldErrors.privacyConsent).toEqual(["Devi accettare l'informativa sulla privacy"])
    expect(result.fieldErrors.name).toBeUndefined()
  })

  it('rejects input that is not an object', async () => {
    const repository = new InMemoryContactRequestRepository()

    const result = await new SubmitContactRequest(repository).execute(null)

    expect(result.ok).toBe(false)
    expect(repository.saved).toEqual([])
  })

  it('propagates repository failures', async () => {
    const repository: ContactRequestRepository = {
      save: async () => {
        throw new Error('SMTP non raggiungibile')
      },
    }

    await expect(new SubmitContactRequest(repository).execute(validInput)).rejects.toThrow(
      'SMTP non raggiungibile',
    )
  })
})
