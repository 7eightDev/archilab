import Image from 'next/image'
import type { Project } from '@/app/_domain/entities/project'

function placeAndYear(project: Project): string {
  return project.location ? `${project.location}, ${project.year}` : String(project.year)
}

export function Hero({ project }: { project: Project | null }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-4 pt-14 pb-20 sm:px-8 md:grid-cols-[5fr_7fr] md:items-end md:gap-16 md:pt-24 md:pb-28">
      <div className="flex flex-col gap-7">
        <h1 className="font-display text-[2.6rem] leading-[1.05] font-light tracking-[0.01em] text-ink sm:text-6xl">
          Case pensate per chi le abita, dal primo schizzo al cantiere.
        </h1>
        <p className="max-w-[38ch] text-lg leading-relaxed text-mist">
          Sono Maria Pezzella, architetto. Progetto nuove abitazioni, ristrutturazioni e interni, e
          seguo le pratiche edilizie e la direzione dei lavori.
        </p>
        <a
          href="#contatti"
          className="inline-flex h-11 w-fit items-center bg-ink px-6 text-base text-paper transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ochre"
        >
          Richiedi un preventivo
        </a>
      </div>

      {project && (
        <figure>
          <div className="relative">
            {/* Construction lines from the logo: they overshoot the frame like a drafting sketch. */}
            <span aria-hidden className="absolute -top-10 -bottom-3 -left-3 w-px bg-ink" />
            <span aria-hidden className="absolute -bottom-3 -left-3 h-px w-[calc(100%+1.5rem)] bg-ink sm:w-[calc(100%+3rem)]" />
            <span aria-hidden className="absolute -top-6 bottom-0 -left-7 hidden w-px bg-line sm:block" />
            <span aria-hidden className="absolute -top-12 right-10 h-12 w-px bg-ochre" />
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <Image
                src={project.coverImage.src}
                alt={project.coverImage.alt}
                fill
                priority
                sizes="(min-width: 768px) 58vw, 100vw"
                unoptimized={project.coverImage.src.endsWith('.svg')}
                className="object-cover"
              />
            </div>
          </div>
          <figcaption className="mt-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="font-display text-xl text-ink">{project.title}</span>
            <span className="text-sm text-mist">{placeAndYear(project)}</span>
          </figcaption>
        </figure>
      )}
    </section>
  )
}
