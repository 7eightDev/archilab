import Image from 'next/image'
import type { Image as ProjectImage } from '@/app/_domain/entities/shared'
import type { Project } from '@/app/_domain/entities/project'

function details(project: Project): string {
  return [project.areaSqm && `${project.areaSqm} mq`, project.location, project.scope]
    .filter(Boolean)
    .join(' · ')
}

function Photo({ image, sizes }: { image: ProjectImage; sizes: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-linen">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        unoptimized={image.src.endsWith('.svg')}
        className="object-cover"
      />
    </div>
  )
}

export function FeaturedProjectSection({ project }: { project: Project | null }) {
  if (!project) return null

  const meta = details(project)
  const before = project.beforeImage

  return (
    <section id="progetto" aria-labelledby="progetto-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-[4fr_8fr] md:gap-16">
          <div className="flex flex-col gap-4">
            <h2 id="progetto-title" className="font-display text-3xl font-normal text-navy md:text-4xl">
              {project.title}
            </h2>
            {meta && <p className="text-sm text-terracotta-ink">{meta}</p>}
          </div>
          <p className="max-w-[62ch] text-lg leading-relaxed text-slate">
            {project.description ?? project.summary}
          </p>
        </div>

        {before ? (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {[
              { label: 'Prima', image: before },
              { label: 'Dopo', image: project.coverImage },
            ].map(({ label, image }) => (
              <figure key={label} aria-labelledby={`progetto-${label.toLowerCase()}`} className="flex flex-col gap-4">
                <Photo image={image} sizes="(min-width: 768px) 50vw, 100vw" />
                <figcaption id={`progetto-${label.toLowerCase()}`} className="text-sm text-terracotta-ink">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <Photo image={project.coverImage} sizes="(min-width: 1152px) 1088px, 100vw" />
        )}
      </div>
    </section>
  )
}
