import type { Service } from '@/app/_domain/entities/service'
import type { ServiceRepository } from '@/app/_domain/repositories/service-repository'

export class ListServices {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  execute(): Promise<Service[]> {
    return this.serviceRepository.findAll()
  }
}
