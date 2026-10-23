import { GetFeaturedProject } from '@/app/_application/use-cases/get-featured-project'
import { GetProject } from '@/app/_application/use-cases/get-project'
import { ListHeroProjects } from '@/app/_application/use-cases/list-hero-projects'
import { ListProjects } from '@/app/_application/use-cases/list-projects'
import { ListServices } from '@/app/_application/use-cases/list-services'
import { SubmitContactRequest } from '@/app/_application/use-cases/submit-contact-request'
import type { ContactRequestRepository } from '@/app/_domain/repositories/contact-request-repository'
import { projects } from './data/projects'
import { services } from './data/services'
import { DisabledContactRequestRepository } from './repositories/disabled-contact-request-repository'
import { InMemoryProjectRepository } from './repositories/in-memory-project-repository'
import { InMemoryServiceRepository } from './repositories/in-memory-service-repository'
import { ResendContactRequestRepository } from './repositories/resend-contact-request-repository'

type Env = Record<string, string | undefined>

/** Emails requests through Resend once it is configured; until then the form refuses them openly. */
export function contactRequestRepositoryFromEnv(env: Env): ContactRequestRepository {
  const apiKey = env.RESEND_API_KEY?.trim()
  const from = env.CONTACT_FROM_EMAIL?.trim()
  const to = env.CONTACT_EMAIL?.trim()

  return apiKey && from && to
    ? new ResendContactRequestRepository({ apiKey, from, to })
    : new DisabledContactRequestRepository()
}

// Composition root: the only place that picks concrete adapters. Swap them here
// (e.g. a CMS for projects) without touching pages.
const projectRepository = new InMemoryProjectRepository(projects)
const serviceRepository = new InMemoryServiceRepository(services)
const contactRequestRepository = contactRequestRepositoryFromEnv(process.env)

export const getFeaturedProject = new GetFeaturedProject(projectRepository)
export const listProjects = new ListProjects(projectRepository)
export const getProject = new GetProject(projectRepository)
export const listHeroProjects = new ListHeroProjects(projectRepository)
export const listServices = new ListServices(serviceRepository)
export const submitContactRequest = new SubmitContactRequest(contactRequestRepository)

/** Studio address offered to the visitor when the form cannot deliver; unset until the studio provides it. */
export function contactFallbackEmail(): string | undefined {
  return process.env.CONTACT_EMAIL?.trim() || undefined
}
