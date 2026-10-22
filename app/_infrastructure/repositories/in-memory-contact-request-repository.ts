import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import type { ContactRequestRepository } from '@/app/_domain/repositories/contact-request-repository'

/** Keeps requests in memory, for tests and local experiments. */
export class InMemoryContactRequestRepository implements ContactRequestRepository {
  readonly saved: ContactRequest[] = []

  async save(request: ContactRequest) {
    this.saved.push(structuredClone(request))
  }
}
