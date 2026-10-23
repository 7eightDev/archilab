import { z } from 'zod'

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lo slug può contenere solo minuscole, numeri e trattini singoli')

export const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1, "Il testo alternativo è obbligatorio"),
})

export type Image = z.infer<typeof ImageSchema>

/**
 * A gallery picture with an optional caption, a short uppercase tag, e.g. "CANTIERE",
 * and a description of the phase it shows.
 */
export const GalleryImageSchema = ImageSchema.extend({
  caption: z.string().min(1).optional(),
  tag: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
})

export type GalleryImage = z.infer<typeof GalleryImageSchema>
