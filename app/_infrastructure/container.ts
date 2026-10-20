import { GetFeaturedProject } from '@/app/_application/use-cases/get-featured-project'
import { ListServices } from '@/app/_application/use-cases/list-services'
import { SubmitContactRequest } from '@/app/_application/use-cases/submit-contact-request'
import { mockProjects } from './mock-data/projects'
import { mockServices } from './mock-data/services'
import { DisabledContactRequestRepository } from './repositories/disabled-contact-request-repository'
import { InMemoryProjectRepository } from './repositories/in-memory-project-repository'
import { InMemoryServiceRepository } from './repositories/in-memory-service-repository'

// Composition root: the only place that picks concrete adapters. Swap them here
// (e.g. a CMS for projects, an email sender for contact requests) without touching pages.
const projectRepository = new InMemoryProjectRepository(mockProjects)
const serviceRepository = new InMemoryServiceRepository(mockServices)
const contactRequestRepository = new DisabledContactRequestRepository()

export const getFeaturedProject = new GetFeaturedProject(projectRepository)
export const listServices = new ListServices(serviceRepository)
export const submitContactRequest = new SubmitContactRequest(contactRequestRepository)
