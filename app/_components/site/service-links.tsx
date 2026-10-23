import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import type { Service } from '@/app/_domain/entities/service'

/**
 * The services a project used, each leading to the services section of the home: ruled boxes with the
 * one-line summary on wider screens, plain rows on phones. Renders nothing without services.
 */
export function ServiceLinks({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <ul className="border-t border-input sm:grid sm:grid-cols-2 sm:gap-4 sm:border-t-0 lg:grid-cols-4">
      {services.map((service) => (
        <li key={service.id}>
          <Link
            href="/#servizi"
            className="group flex min-h-14 items-center justify-between gap-5 border-b border-border transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:h-full sm:min-h-33 sm:flex-col sm:items-stretch sm:border sm:border-input sm:px-[22px] sm:pt-[22px] sm:pb-5 sm:hover:border-foreground sm:hover:bg-secondary"
          >
            <span className="font-heading text-lg leading-[1.2] tracking-[.04em] sm:text-[22px]">{service.title}</span>
            <span className="flex items-center justify-between gap-4 text-[13px] text-muted-foreground">
              {service.summary && <span className="max-sm:hidden">{service.summary}</span>}
              <ArrowUpRightIcon aria-hidden strokeWidth={1.5} className="ml-auto size-4 shrink-0 text-ottone" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
