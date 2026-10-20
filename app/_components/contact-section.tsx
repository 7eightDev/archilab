import { type ContactAction, ContactForm } from './contact-form'

/** `action` defaults to posting to /api/contact; override it in tests. */
export function ContactSection({ action }: { action?: ContactAction }) {
  return (
    <section id="contatti" aria-labelledby="contatti-title" className="bg-linen">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-[4fr_8fr] md:gap-16 md:py-16">
        <div className="flex flex-col gap-4">
          <h2 id="contatti-title" className="font-display text-3xl font-normal text-navy md:text-4xl">
            Raccontami la tua idea
          </h2>
          <p className="max-w-[36ch] text-lg leading-relaxed text-slate">
            Hai un progetto in mente, anche solo abbozzato? Scrivimi due righe: ne parliamo insieme.
          </p>
        </div>
        <ContactForm action={action} />
      </div>
    </section>
  )
}
