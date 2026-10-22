import { unsplash } from '@/app/_lib/unsplash'

// Provisional photos (Unsplash) until the studio provides the real ones: Nolan Issac (before),
// Amsterdam City Archives (plan), Andrew Neel (site), Christian Lue (after), Home Makers Interior (living).
const photos = {
  before: { src: unsplash('photo-1444419988131-046ed4e5ffd6'), alt: 'Stanza spoglia con pavimento rovinato, prima dei lavori' },
  plan: { src: unsplash('photo-1721244653652-268631ec049a'), alt: 'Disegni di pianta e sezione' },
  site: { src: unsplash('photo-1625585598750-3535fe40efb3'), alt: 'Ambiente in cantiere con sgabello e pianta' },
  light: { src: unsplash('photo-1757742690834-aa581b9f53b2'), alt: 'Stanza luminosa con grandi finestre e parquet' },
  living: { src: unsplash('photo-1742367539759-6e4fc2e39209'), alt: 'Zona giorno aperta, dopo i lavori' },
}

/** Projects shown on the site. */
export const projects = [
  {
    id: 'p-appartamento-fondi',
    slug: 'appartamento-fondi',
    title: 'Un appartamento a Fondi, ripensato da zero',
    summary:
      'Ristrutturazione completa di un appartamento anni ’80 nel centro di Fondi, trasformato in un open space luminoso.',
    // [Racconto da completare con Maria]
    description:
      'Un appartamento degli anni ’80 con stanze piccole e un corridoio lungo e buio. Ho aperto la zona giorno verso la luce, ridisegnato la cucina e gli arredi su misura, e seguito la CILA fino alla fine dei lavori.',
    category: 'ristrutturazione',
    location: 'Fondi (LT)',
    areaSqm: 95,
    scope: 'Ristrutturazione completa, anni ’80',
    // TODO: confirm the completion year with the studio; it is not shown on the site.
    year: 2025,
    coverImage: photos.light,
    beforeImage: photos.before,
    afterImage: photos.living,
    gallery: [
      { ...photos.before, tag: 'RILIEVO', caption: 'Prima: l’appartamento anni ’80' },
      { ...photos.plan, tag: 'ARCHITETTURA', caption: 'La pianta ripensata' },
      { ...photos.site, tag: 'CANTIERE', caption: 'I lavori, seguiti ogni settimana' },
      { ...photos.light, tag: 'INTERIOR', caption: 'Dopo: la zona giorno aperta alla luce' },
    ],
    serviceIds: ['s-architettura', 's-interior', 's-pratiche'],
    featured: true,
  },
]
