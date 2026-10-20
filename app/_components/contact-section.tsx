import { submitContact } from '@/app/_actions/submit-contact'
import { ContactForm } from './contact-form'

export function ContactSection() {
  return (
    <section id="contatti" aria-labelledby="contatti-title">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-8 md:grid-cols-[5fr_7fr] md:gap-16 md:py-28">
        <div className="flex flex-col gap-4">
          <h2 id="contatti-title" className="font-display text-4xl font-light text-ink">
            Raccontami il tuo progetto
          </h2>
          <p className="max-w-[34ch] text-mist">
            Descrivi l&apos;intervento che hai in mente: ti ricontatto per fissare un primo incontro
            e un preventivo.
          </p>
        </div>
        <ContactForm action={submitContact} />
      </div>
    </section>
  )
}
