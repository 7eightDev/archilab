import type { ContactRequest } from '../entities/contact-request'

export interface ContactRequestRepository {
  save(request: ContactRequest): Promise<void>
}
