import type { Project, ProjectCategory } from '@/app/_domain/entities/project'
import type { Image } from '@/app/_domain/entities/shared'
import { unsplash } from '@/app/_lib/unsplash'

export interface HeroSlide {
  kicker: string
  caption: string
  image: Image
  /** The project the photo belongs to; the studio's fallback slide has none. */
  project?: { href: string; title: string }
}

const categoryNouns: Record<ProjectCategory, string> = {
  residenziale: 'UNA CASA',
  commerciale: 'UN LOCALE',
  interni: 'GLI INTERNI DI UNA CASA',
  ristrutturazione: 'UNA RISTRUTTURAZIONE',
  pubblico: 'UNO SPAZIO PUBBLICO',
}

/** The project's own kicker, or one built from its category and town ("UNA CASA A SPERLONGA"), or the year without a place. */
export function heroKicker(project: Project): string {
  if (project.heroKicker) return project.heroKicker.toUpperCase()

  const noun = categoryNouns[project.category]
  if (!project.location) return `${noun} · ${project.year}`
  const town = project.location.replace(/\s*\([^)]*\)$/, '')
  return `${noun} A ${town.toUpperCase()}`
}

export function toHeroSlide(project: Project): HeroSlide {
  return {
    kicker: heroKicker(project),
    caption: [project.scope, project.areaSqm && `${project.areaSqm} m²`].filter(Boolean).join(' · '),
    image: project.heroImage ?? project.coverImage,
    project: { href: `/progetti/${project.slug}`, title: project.title },
  }
}

// Provisional photo (Unsplash): The Prototype.
/** Shown alone when no project is chosen for the hero. */
export const defaultHeroSlide: HeroSlide = {
  kicker: 'ARCHITETTO A FONDI (LT)',
  caption: '',
  image: { src: unsplash('photo-1503387762-592deb58ef4e'), alt: 'Tavolo da disegno con tavole di progetto' },
}
