'use server'

import { submitContactRequest } from '@/app/_infrastructure/container'
import { type ContactFormState, initialContactFormState } from './contact-form-state'

function text(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function submitContact(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    message: text(formData, 'message'),
  }

  try {
    const result = await submitContactRequest.execute({
      ...values,
      privacyConsent: formData.get('privacyConsent') === 'on',
    })

    if (result.ok) return { ...initialContactFormState, status: 'success' }

    return { status: 'error', fieldErrors: result.fieldErrors, formErrors: result.formErrors, values }
  } catch (error) {
    console.error('Contact request delivery failed', error)
    return {
      status: 'error',
      fieldErrors: {},
      formErrors: ['Non è stato possibile inviare la richiesta. Riprova tra qualche minuto.'],
      values,
    }
  }
}
