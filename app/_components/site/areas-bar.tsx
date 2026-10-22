import type { Service } from '@/app/_domain/entities/service'
import { pad } from './format'

/** Band under the hero: one link per area, stacked on phones. */
export function AreasBar({ services }: { services: Service[] }) {
  return (
    <nav aria-label="Aree" className="border-b border-border bg-secondary">
      <ul className="mx-auto grid max-w-[1200px] sm:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.id} className="border-border max-sm:border-b max-sm:last:border-b-0 sm:border-r">
            <a
              href="#servizi"
              className="flex items-baseline gap-3.5 px-6 py-5 font-heading text-sm leading-[1.2] tracking-[.22em] uppercase transition-colors hover:bg-border"
            >
              <span className="text-xs text-ottone">{pad(index + 1)}</span>
              {/* Short label: "Pratiche urbanistiche" reads as PRATICHE in the band. */}
              {service.title.split(' ')[0]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
