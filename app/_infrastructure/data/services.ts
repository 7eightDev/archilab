/** The three areas of the studio, in the order the site lists them (copy from the design handoff). */
export const services = [
  {
    id: 's-architettura',
    slug: 'architettura',
    title: 'Architettura',
    summary: 'Nuove case, ristrutturazioni, ampliamenti.',
    description:
      'Nuove costruzioni e ristrutturazioni, complete o parziali. Seguo il cantiere fino all’ultimo giorno.',
    items: ['Nuove costruzioni', 'Ristrutturazioni complete e parziali', 'Ampliamenti', 'Direzione lavori'],
    order: 0,
  },
  {
    id: 's-interior',
    slug: 'interior',
    title: 'Interior',
    summary: 'Spazi, materiali, luce e arredo su misura.',
    description: 'Gli interni pensati insieme a te: come vivi la casa, quali materiali, dove arriva la luce.',
    items: ['Progetto degli interni', 'Scelta dei materiali', 'Progetto luci', 'Arredo su misura'],
    order: 1,
  },
  {
    id: 's-pratiche',
    slug: 'pratiche-urbanistiche',
    title: 'Pratiche urbanistiche',
    summary: 'Permessi e rapporti con il Comune.',
    description:
      'Mi occupo io dei permessi e dei rapporti con l’Ufficio Tecnico comunale, senza che tu debba rincorrere nessuno.',
    items: ['CILA e SCIA', 'Permesso di costruire', 'Sanatorie', 'Agibilità'],
    order: 2,
  },
]
