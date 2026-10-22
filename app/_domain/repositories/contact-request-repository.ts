import type { ContactRequest } from '../entities/contact-request'

export interface ContactRequestRepository {
  save(request: ContactRequest): Promise<void>
}

/** Thrown by an adapter that cannot deliver requests at all, e.g. while delivery is not configured. */
export class ContactDeliveryUnavailableError extends Error {
  constructor() {
    super('Contact request delivery is not available')
    this.name = 'ContactDeliveryUnavailableError'
  }
}
