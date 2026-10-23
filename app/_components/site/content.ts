import type { Image } from '@/app/_domain/entities/shared';

/**
 * Editorial copy of the one-page site that is not domain data (services and the featured project
 * come from the use cases). Details the studio has not supplied yet are `null`, and the page leaves them out.
 */

export const phases = [
  { name: 'IDEA', detail: 'Ascolto e sopralluogo' },
  { name: 'PROGETTO', detail: 'Architettura e interni' },
  { name: 'PERMESSI', detail: 'Pratiche in Comune' },
  { name: 'CANTIERE', detail: 'Direzione lavori' },
  { name: 'CONSEGNA', detail: 'Agibilità e chiavi' }
];

export const methodSteps = [
  {
    title: 'Primo incontro',
    detail: 'Mi racconti cosa hai in mente, anche solo a grandi linee.'
  },
  {
    title: 'Sopralluogo',
    detail: 'Vengo a vedere la casa o il locale e verifico cosa si può fare.'
  },
  {
    title: 'Proposta',
    detail:
      'Ti spiego cosa serve, quali pratiche, tempi e costi, in modo chiaro.'
  },
  {
    title: 'Incarico',
    detail: 'Da qui ci penso io: progetto, Comune, cantiere, consegna.'
  }
];

export const studio = {
  name: 'Archilab',
  architect: 'Arch. Maria Pezzella',
  street: 'Via Romano Antoniazzo, 19',
  postalCode: '04022',
  city: 'Fondi',
  province: 'LT',
  phone: '328 7489 645',
  phoneHref: 'tel:+393287489645',
  whatsappHref: 'https://wa.me/393287489645',
  email: 'archipezzella@gmail.com',
  vatNumber: null as string | null,
  order: 'Ordine degli Architetti di Latina',
  registrationNumber: null as string | null,
  /** Privacy notice page; the consent checkbox and the footer link to it once it exists. */
  privacyUrl: null as string | null,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Via Romano Antoniazzo 19, 04022 Fondi LT')}`,
  /** Same place as `mapsUrl`, in the keyless embed form shown inside the map dialog. */
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent('Via Romano Antoniazzo 19, 04022 Fondi LT')}&output=embed`,
  /** 4:5 portrait of Maria; the Studio section shows it only once it is provided. */
  portrait: null as Image | null
};
