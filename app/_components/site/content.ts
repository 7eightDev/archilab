import type { Image } from '@/app/_domain/entities/shared'
import { unsplash } from '@/app/_lib/unsplash'

/**
 * Editorial copy of the one-page site that is not domain data (services and the featured project
 * come from the use cases). Values marked [DA FORNIRE] are still to be supplied by the studio.
 */

export interface HeroSlide {
  kicker: string
  caption: string
  image: Image
}

// Provisional photos (Unsplash): Home Makers Interior, The Prototype, Daniel McCullough.
export const heroSlides: HeroSlide[] = [
  {
    kicker: 'UN APPARTAMENTO A FONDI',
    caption: 'Ristrutturazione completa · 95 m²',
    image: { src: unsplash('photo-1742367539759-6e4fc2e39209'), alt: 'Zona giorno luminosa con libreria a parete' },
  },
  {
    kicker: 'INTERNI PENSATI CON TE',
    caption: 'Materiali, luci e arredo su misura',
    image: { src: unsplash('photo-1748679767437-00b5c0327b1a'), alt: 'Interno dai toni scuri con arredo su misura' },
  },
  {
    kicker: 'IL PROGETTO, FINO IN COMUNE',
    caption: 'CILA, SCIA, permessi e agibilità',
    image: { src: unsplash('photo-1503387762-592deb58ef4e'), alt: 'Tavolo da disegno con tavole di progetto' },
  },
]

export const phases = [
  { name: 'IDEA', detail: 'Ascolto e sopralluogo' },
  { name: 'PROGETTO', detail: 'Architettura e interni' },
  { name: 'PERMESSI', detail: 'Pratiche in Comune' },
  { name: 'CANTIERE', detail: 'Direzione lavori' },
  { name: 'CONSEGNA', detail: 'Agibilità e chiavi' },
]

export const methodSteps = [
  { title: 'Primo incontro', detail: 'Mi racconti cosa hai in mente, anche solo a grandi linee. [Gratuito? DA DEFINIRE]' },
  { title: 'Sopralluogo', detail: 'Vengo a vedere la casa o il locale e verifico cosa si può fare.' },
  { title: 'Proposta', detail: 'Ti spiego cosa serve, quali pratiche, tempi e costi, in modo chiaro.' },
  { title: 'Incarico', detail: 'Da qui ci penso io: progetto, Comune, cantiere, consegna.' },
]

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
  vatNumber: '[DA FORNIRE]',
  registration: 'Ordine degli Architetti PPC di Latina n. [DA FORNIRE]',
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Via Romano Antoniazzo 19, 04022 Fondi LT')}`,
  /** 4:5 portrait of Maria; until it is provided the Studio section shows an empty frame. */
  portrait: null as Image | null,
}
