import type { Service } from '@/app/_domain/entities/service'

export function ServicesSection({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <section id="servizi" aria-labelledby="servizi-title" className="bg-linen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-8 md:py-16">
        <h2 id="servizi-title" className="font-display text-3xl font-normal text-navy md:text-4xl">
          Servizi
        </h2>
        <ul className="border-b border-navy/20">
          {services.map((service) => (
            <li
              key={service.id}
              className="grid gap-2 border-t border-navy/20 py-6 md:grid-cols-[4fr_8fr] md:gap-16 md:py-8"
            >
              <h3 className="font-display text-2xl font-normal text-navy">{service.title}</h3>
              <p className="max-w-[60ch] text-lg leading-relaxed text-slate">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
