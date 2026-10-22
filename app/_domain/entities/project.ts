import { z } from 'zod'
import { GalleryImageSchema, ImageSchema, SlugSchema } from './shared'

export const projectCategories = [
  'residenziale',
  'commerciale',
  'interni',
  'ristrutturazione',
  'pubblico',
] as const

export const ProjectCategorySchema = z.enum(projectCategories)

export const ProjectSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(300),
  description: z.string().optional(),
  category: ProjectCategorySchema,
  location: z.string().optional(),
  /** Floor area in square metres. */
  areaSqm: z.number().positive().optional(),
  /** Short label for the kind of work, e.g. "Ristrutturazione completa". */
  scope: z.string().min(1).optional(),
  // Evaluated lazily so the upper bound follows the current year; next year is allowed for projects in progress.
  year: z
    .number()
    .int()
    .min(1900)
    .refine((year) => year <= new Date().getFullYear() + 1, "L'anno non può superare l'anno prossimo"),
  coverImage: ImageSchema,
  /** Before/after pair of the same room from the same viewpoint; shown only when both are set. */
  beforeImage: ImageSchema.optional(),
  afterImage: ImageSchema.optional(),
  gallery: z.array(GalleryImageSchema).default([]),
  serviceIds: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
})

export type ProjectCategory = z.infer<typeof ProjectCategorySchema>
export type Project = z.infer<typeof ProjectSchema>
