// Placeholder images until the real before/after photos are provided.
const placeholder = '/images/placeholder.svg'

/** Projects shown on the site (copy approved for the MVP). */
export const mockProjects = [
  {
    id: 'p-appartamento-fondi',
    slug: 'appartamento-fondi',
    title: 'Un appartamento a Fondi, ripensato da zero',
    summary:
      'Ristrutturazione completa di un appartamento anni ‘80 nel centro di Fondi, trasformato in un open space luminoso.',
    description:
      'Un appartamento degli anni ‘80 nel centro di Fondi, con ambienti chiusi e poca luce naturale, trasformato in uno spazio open space luminoso. Sono stati rifatti impianti, pavimenti e infissi, abbattuta una parete tra cucina e soggiorno, e curato ogni dettaglio dell’arredo su misura.',
    category: 'ristrutturazione',
    location: 'Fondi (LT)',
    areaSqm: 95,
    scope: 'Ristrutturazione completa',
    // TODO: confirm the completion year with the studio; it is not shown on the site.
    year: 2025,
    coverImage: { src: placeholder, alt: 'Il soggiorno open space con la cucina, dopo i lavori' },
    beforeImage: { src: placeholder, alt: 'Cucina e soggiorno separati da una parete, prima dei lavori' },
    serviceIds: ['s-ristrutturazioni', 's-interni'],
    featured: true,
  },
]
