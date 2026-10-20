import type { ContactApiResponse } from '@/app/api/contact/contract'
import { type ContactFormState, initialContactFormState } from './contact-form-state'

function text(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

/** Browser-side form action: sends the contact form to POST /api/contact and maps the reply to form state. */
export async function postContactRequest(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    message: text(formData, 'message'),
  }
  const failure = (formErrors: string[], fieldErrors = {}): ContactFormState => ({
    status: 'error',
    fieldErrors,
    formErrors,
    values,
  })

  let body: ContactApiResponse
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, privacyConsent: formData.get('privacyConsent') === 'on' }),
    })
    body = await response.json()
  } catch {
    return failure(['Messaggio non inviato: controlla la connessione e riprova.'])
  }

  if (body.ok) return { ...initialContactFormState, status: 'success' }

  const { message, fieldErrors = {}, formErrors = [] } = body.error
  // Field errors speak for themselves next to each input; otherwise surface the server message.
  const hasFieldErrors = Object.keys(fieldErrors).length > 0
  return failure(formErrors.length > 0 || hasFieldErrors ? formErrors : [message], fieldErrors)
}
