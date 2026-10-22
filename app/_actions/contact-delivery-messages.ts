/** Visitor-facing messages for a request that passed validation but could not be delivered. */
export function deliveryUnavailableMessage(fallbackEmail: string | undefined): string {
  return fallbackEmail
    ? 'Il modulo non è ancora attivo: il messaggio non è partito.'
    : 'Il modulo non è ancora attivo: il messaggio non è partito. Riprova tra qualche giorno.'
}

export const deliveryFailedMessage = 'Non è stato possibile inviare il messaggio. Riprova tra qualche minuto.'
