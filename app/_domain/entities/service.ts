import { z } from 'zod'
import { SlugSchema } from './shared'

export const ServiceSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  title: z.string().min(1).max(120),
  description: z.string().min(1),
  /** One-line version of the description, for compact lists. */
  summary: z.string().min(1).optional(),
  /** What the service covers, shown as a bullet list. */
  items: z.array(z.string().min(1)).default([]),
  icon: z.string().optional(),
  order: z.number().int().min(0),
})

export type Service = z.infer<typeof ServiceSchema>
