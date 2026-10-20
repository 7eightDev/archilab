import type { ContactRequestFieldErrors } from '@/app/_application/use-cases/submit-contact-request'

export interface ContactFormValues {
  name: string
  email: string
  phone: string
  message: string
}

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  fieldErrors: ContactRequestFieldErrors
  formErrors: string[]
  /** Echoed back so the form keeps what the visitor typed after a failed submission. */
  values: ContactFormValues
}

export const initialContactFormState: ContactFormState = {
  status: 'idle',
  fieldErrors: {},
  formErrors: [],
  values: { name: '', email: '', phone: '', message: '' },
}
