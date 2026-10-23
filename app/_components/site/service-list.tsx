import type { Service } from '@/app/_domain/entities/service'

/**
 * The services a project used, with their one-line summary: ruled boxes on wider screens, plain rows
 * on phones. Not links, as there are no service pages. Renders nothing without services.
 */
export function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <ul className="border-t border-input sm:grid sm:grid-cols-2 sm:gap-4 sm:border-t-0 lg:grid-cols-4">
      {services.map((service) => (
        <li
          key={service.id}
          className="flex flex-col gap-1.5 border-b border-border py-4 sm:min-h-33 sm:justify-between sm:gap-5 sm:border sm:border-input sm:px-[22px] sm:pt-[22px] sm:pb-5"
        >
          <span className="font-heading text-lg leading-[1.2] tracking-[.04em] sm:text-[22px]">{service.title}</span>
          {service.summary && <span className="text-[13px] leading-[1.5] text-muted-foreground">{service.summary}</span>}
        </li>
      ))}
    </ul>
  )
}
