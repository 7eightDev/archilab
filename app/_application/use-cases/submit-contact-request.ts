import { z } from 'zod'
import { ContactRequestSchema } from '@/app/_domain/entities/contact-request'
import type { ContactRequestRepository } from '@/app/_domain/repositories/contact-request-repository'

export type ContactRequestFieldErrors = Partial<
  Record<keyof z.input<typeof ContactRequestSchema>, string[]>
>

export type SubmitContactRequestResult =
  | { ok: true }
  | { ok: false; fieldErrors: ContactRequestFieldErrors; formErrors: string[] }

export class SubmitContactRequest {
  constructor(private readonly contactRequestRepository: ContactRequestRepository) {}

  /** Validates untrusted input; repository failures are propagated to the caller. */
  async execute(input: unknown): Promise<SubmitContactRequestResult> {
    const parsed = ContactRequestSchema.safeParse(input)

    if (!parsed.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsed.error)
      return { ok: false, fieldErrors, formErrors }
    }

    await this.contactRequestRepository.save(parsed.data)
    return { ok: true }
  }
}
