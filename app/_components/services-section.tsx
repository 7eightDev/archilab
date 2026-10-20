import { FileText, Hammer, type LucideIcon, Ruler, Sofa } from 'lucide-react'
import type { Service } from '@/app/_domain/entities/service'

const icons: Record<string, LucideIcon> = {
  ruler: Ruler,
  hammer: Hammer,
  sofa: Sofa,
  'file-text': FileText,
}

export function ServicesSection({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <section id="servizi" aria-labelledby="servizi-title" className="bg-sand">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-8 md:grid-cols-[5fr_7fr] md:gap-16 md:py-28">
        <div className="flex flex-col gap-4">
          <h2 id="servizi-title" className="font-display text-4xl font-light text-ink">
            Di cosa mi occupo
          </h2>
          <p className="max-w-[34ch] text-mist">
            Un unico riferimento per il progetto, i permessi e il cantiere.
          </p>
        </div>
        <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon ? icons[service.icon] : undefined
            return (
              <li key={service.id} className="flex flex-col gap-3 border-t border-ink pt-5">
                {Icon && <Icon aria-hidden className="size-6 text-ochre" strokeWidth={1.25} />}
                <h3 className="font-display text-xl text-ink">{service.title}</h3>
                <p className="leading-relaxed text-mist">{service.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
