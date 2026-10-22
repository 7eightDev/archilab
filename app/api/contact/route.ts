import { deliveryFailedMessage, deliveryUnavailableMessage } from '@/app/_actions/contact-delivery-messages'
import { ContactDeliveryUnavailableError } from '@/app/_domain/repositories/contact-request-repository'
import { contactFallbackEmail, submitContactRequest } from '@/app/_infrastructure/container'
import type { ContactApiErrorCode, ContactApiResponse } from './contract'

function reply(body: ContactApiResponse, status: number) {
  return Response.json(body, { status })
}

function fail(status: number, code: ContactApiErrorCode, message: string, details = {}) {
  return reply({ ok: false, error: { code, message, ...details } }, status)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    body = undefined
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return fail(400, 'INVALID_BODY', 'Richiesta non valida.')
  }

  try {
    const result = await submitContactRequest.execute(body)
    if (result.ok) return reply({ ok: true }, 200)

    return fail(422, 'VALIDATION_FAILED', 'Controlla i campi evidenziati.', {
      fieldErrors: result.fieldErrors,
      formErrors: result.formErrors,
    })
  } catch (error) {
    if (error instanceof ContactDeliveryUnavailableError) {
      const fallbackEmail = contactFallbackEmail()
      const message = deliveryUnavailableMessage(fallbackEmail)
      return fail(503, 'DELIVERY_UNAVAILABLE', message, fallbackEmail ? { fallbackEmail } : {})
    }
    console.error('Contact request delivery failed', error)
    return fail(500, 'DELIVERY_FAILED', deliveryFailedMessage)
  }
}
