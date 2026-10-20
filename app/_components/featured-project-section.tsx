import Image from 'next/image'
import type { Project } from '@/app/_domain/entities/project'

export function FeaturedProjectSection({ project }: { project: Project | null }) {
  if (!project) return null

  return (
    <section id="progetto" aria-labelledby="progetto-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-[4fr_8fr] md:gap-16">
          <h2 id="progetto-title" className="font-display text-3xl font-normal text-navy md:text-4xl">
            {project.title}
          </h2>
          <p className="max-w-[62ch] text-lg leading-relaxed text-slate">
            {project.description ?? project.summary}
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-linen md:aspect-[16/9]">
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            sizes="(min-width: 1152px) 1088px, 100vw"
            unoptimized={project.coverImage.src.endsWith('.svg')}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
