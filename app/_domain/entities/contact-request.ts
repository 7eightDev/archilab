import { z } from 'zod'

export const interventionTypes = ['non-so', 'architettura', 'interior', 'pratiche'] as const

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, 'Scrivi il tuo nome').max(100, 'Il nome può avere al massimo 100 caratteri'),
  email: z.string().trim().min(1, 'Scrivi il tuo indirizzo email').pipe(z.email('Indirizzo email non valido: controlla che sia completo')),
  phone: z.string().trim().optional(),
  interventionType: z.enum(interventionTypes).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Scrivi almeno 10 caratteri, bastano poche parole')
    .max(2000, 'Il messaggio non può superare i 2000 caratteri'),
  privacyConsent: z.literal(true, { error: 'Serve il tuo consenso per poterti ricontattare' }),
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>
export type InterventionType = (typeof interventionTypes)[number]

export const interventionTypeLabels: Record<InterventionType, string> = {
  'non-so': 'Non so ancora',
  architettura: 'Architettura',
  interior: 'Interior',
  pratiche: 'Pratiche urbanistiche',
}
