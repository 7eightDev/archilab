import type { ContactRequest } from '@/app/_domain/entities/contact-request'
import {
  ContactDeliveryUnavailableError,
  type ContactRequestRepository,
} from '@/app/_domain/repositories/contact-request-repository'

/**
 * Placeholder while email delivery is not wired up: it refuses every request, so the visitor is told
 * the message did not leave instead of being thanked for it. Replace it in the container with an
 * email-backed adapter.
 */
export class DisabledContactRequestRepository implements ContactRequestRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(_request: ContactRequest): Promise<void> {
    throw new ContactDeliveryUnavailableError()
  }
}
