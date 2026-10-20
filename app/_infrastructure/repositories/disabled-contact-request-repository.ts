import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import type { ContactRequestRepository } from '@/app/_domain/repositories/contact-request-repository'

/**
 * Placeholder while email delivery is not wired up: requests are validated by the use case
 * and then discarded. Replace it in the container with an email-backed adapter.
 */
export class DisabledContactRequestRepository implements ContactRequestRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(_request: ContactRequest): Promise<void> {}
}
