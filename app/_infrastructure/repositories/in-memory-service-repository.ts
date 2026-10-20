import { z } from 'zod'
import { type Service, ServiceSchema } from '@/app/_domain/entities/service'
import type { ServiceRepository } from '@/app/_domain/repositories/service-repository'
import { assertUniqueSlugs } from './assert-unique-slugs'

/** Serves services from in-memory seed data, validated against the domain schema at construction. */
export class InMemoryServiceRepository implements ServiceRepository {
  private readonly services: Service[]

  constructor(seed: unknown[]) {
    this.services = z
      .array(ServiceSchema)
      .parse(seed)
      .sort((a, b) => a.order - b.order)
    assertUniqueSlugs(this.services)
  }

  async findAll() {
    return this.services.map((service) => structuredClone(service))
  }

  async findBySlug(slug: string) {
    const service = this.services.find((candidate) => candidate.slug === slug)
    return service ? structuredClone(service) : null
  }
}
