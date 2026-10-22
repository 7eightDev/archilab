'use server'

import { ContactDeliveryUnavailableError } from '@/app/_domain/repositories/contact-request-repository'
import { contactFallbackEmail, submitContactRequest } from '@/app/_infrastructure/container'
import { deliveryFailedMessage, deliveryUnavailableMessage } from './contact-delivery-messages'
import type { ContactFormState, ContactFormValues } from './contact-form-state'

function text(formData: FormData, key: keyof ContactFormValues): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

/** Server Action behind the contact form: validation and delivery belong to SubmitContactRequest. */
export async function submitContactForm(_previousState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values: ContactFormValues = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    phone: text(formData, 'phone'),
    interventionType: text(formData, 'interventionType'),
    message: text(formData, 'message'),
  }
  const consentGiven = formData.get('privacyConsent') === 'on'
  const failure = (formErrors: string[], fieldErrors = {}, fallbackEmail?: string): ContactFormState => ({
    status: 'error',
    fieldErrors,
    formErrors,
    values,
    consentGiven,
    ...(fallbackEmail && { fallbackEmail }),
  })

  try {
    const result = await submitContactRequest.execute({
      name: values.name,
      email: values.email,
      // Optional fields left blank are absent, not empty strings.
      ...(values.phone.trim() && { phone: values.phone }),
      ...(values.interventionType && { interventionType: values.interventionType }),
      message: values.message,
      privacyConsent: consentGiven,
    })
    if (result.ok) return { status: 'success', fieldErrors: {}, formErrors: [], values }
    return failure(result.formErrors, result.fieldErrors)
  } catch (error) {
    if (error instanceof ContactDeliveryUnavailableError) {
      const fallbackEmail = contactFallbackEmail()
      return failure([deliveryUnavailableMessage(fallbackEmail)], {}, fallbackEmail)
    }
    console.error('Contact request delivery failed', error)
    return failure([deliveryFailedMessage])
  }
}
