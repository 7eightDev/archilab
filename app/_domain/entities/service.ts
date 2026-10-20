import { z } from 'zod'
import { SlugSchema } from './shared'

export const ServiceSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  title: z.string().min(1).max(120),
  description: z.string().min(1),
  icon: z.string().optional(),
  order: z.number().int().min(0),
})

export type Service = z.infer<typeof ServiceSchema>
