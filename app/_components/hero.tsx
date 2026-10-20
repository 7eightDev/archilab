import { buttonVariants } from '@/app/_components/ui/button'
import { LogoMark } from './logo'
import { textLinkClass } from './link-styles'

export function Hero({ showProjectLink }: { showProjectLink: boolean }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-12 pb-16 sm:px-8 md:grid-cols-[8fr_4fr] md:items-end md:gap-16 md:pt-16">
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-5xl leading-[1.05] font-normal tracking-[-0.02em] text-navy sm:text-6xl md:text-7xl">
          Dove abitare prende forma.
        </h1>
        <p className="max-w-[46ch] text-lg leading-relaxed text-slate">
          Interni, ristrutturazioni e pratiche urbanistiche: un approccio su misura, dal primo schizzo
          alla posa dell&apos;ultimo&nbsp;dettaglio.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
          <a href="#contatti" className={buttonVariants()}>
            Richiedi una consulenza
          </a>
          {showProjectLink && (
            <a href="#progetto" className={`${textLinkClass} inline-flex min-h-12 items-center text-base`}>
              Guarda il progetto
            </a>
          )}
        </div>
      </div>

      {/* The business-card mark, drawn large: construction lines that become a house. */}
      <LogoMark className="hidden h-auto w-full max-w-sm justify-self-end md:block" />
    </section>
  )
}
