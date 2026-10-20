import { z } from 'zod'

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, 'Il nome è obbligatorio').max(100),
  email: z.string().trim().pipe(z.email('Indirizzo email non valido')),
  phone: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Il messaggio deve contenere almeno 10 caratteri')
    .max(2000, 'Il messaggio non può superare i 2000 caratteri'),
  privacyConsent: z.literal(true, { error: "Devi accettare l'informativa sulla privacy" }),
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>
