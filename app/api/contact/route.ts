import { submitContactRequest } from '@/app/_infrastructure/container'
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
    console.error('Contact request delivery failed', error)
    return fail(500, 'DELIVERY_FAILED', 'Non è stato possibile inviare il messaggio. Riprova tra qualche minuto.')
  }
}
