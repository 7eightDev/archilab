import type { Service } from '../entities/service'

export interface ServiceRepository {
  /** Returns services sorted by `order` ascending. */
  findAll(): Promise<Service[]>
  /** Returns `null` when no service matches the slug. */
  findBySlug(slug: string): Promise<Service | null>
}
