import type { ContactRequestFieldErrors } from '@/app/_application/use-cases/submit-contact-request'

export interface ContactFormValues {
  name: string
  email: string
  phone: string
  interventionType: string
  message: string
}

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  fieldErrors: ContactRequestFieldErrors
  formErrors: string[]
  /** Echoed back so the form keeps what the visitor typed after a failed submission. */
  values: ContactFormValues
  /** Echoed like `values`, so a rejected submission does not untick the consent box. */
  consentGiven?: boolean
  /** Set when the form cannot deliver, so the visitor can send the same text by email. */
  fallbackEmail?: string
}

export const initialContactFormState: ContactFormState = {
  status: 'idle',
  fieldErrors: {},
  formErrors: [],
  values: { name: '', email: '', phone: '', interventionType: 'non-so', message: '' },
}
