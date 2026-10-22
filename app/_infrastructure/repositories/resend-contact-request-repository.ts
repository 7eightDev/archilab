import { type ContactRequest, interventionTypeLabels } from '@/app/_domain/entities/contact-request'
import type { ContactRequestRepository } from '@/app/_domain/repositories/contact-request-repository'

export interface ResendConfig {
  apiKey: string
  /** Sender on a domain verified in Resend, e.g. "Sito Archilab <sito@archilab.it>". */
  from: string
  /** Studio inbox that receives the requests. */
  to: string
}

/** Delivers each request to the studio inbox as a plain-text email through the Resend HTTP API. */
export class ResendContactRequestRepository implements ContactRequestRepository {
  constructor(
    private readonly config: ResendConfig,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async save(request: ContactRequest): Promise<void> {
    const response = await this.fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.config.from,
        to: [this.config.to],
        reply_to: request.email,
        subject: `Richiesta dal sito: ${request.name}`,
        text: emailText(request),
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend rejected the email: ${response.status} ${await response.text()}`)
    }
  }
}

function emailText(request: ContactRequest): string {
  const details = [
    `Nome: ${request.name}`,
    `Email: ${request.email}`,
    request.phone && `Telefono: ${request.phone}`,
    request.interventionType && `Tipo di intervento: ${interventionTypeLabels[request.interventionType]}`,
  ].filter(Boolean)

  return `${details.join('\n')}\n\n${request.message}`
}
