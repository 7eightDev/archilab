import type { ContactRequestFieldErrors } from '@/app/_application/use-cases/submit-contact-request'

/** Wire format of POST /api/contact, shared by the route handler and the browser client. */
export type ContactApiErrorCode = 'INVALID_BODY' | 'VALIDATION_FAILED' | 'DELIVERY_FAILED'

export type ContactApiResponse =
  | { ok: true }
  | {
      ok: false
      error: {
        code: ContactApiErrorCode
        /** Human-readable, safe to show to the visitor. */
        message: string
        fieldErrors?: ContactRequestFieldErrors
        formErrors?: string[]
      }
    }
