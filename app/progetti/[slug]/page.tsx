import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClosingCta } from '@/app/_components/site/closing-cta'
import { ProjectDetail } from '@/app/_components/site/project-detail'
import { getProject, listProjects, listServices } from '@/app/_infrastructure/container'

// Everything on the page depends on the slug, and every page is built ahead of time: the navigation
// waits for it instead of showing a shell, which also keeps a real 404 status for unknown slugs.
export const instant = false

/** Every project page is built ahead of time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { projects } = await listProjects.execute()
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/progetti/[slug]'>): Promise<Metadata> {
  const page = await getProject.execute((await params).slug)
  if (!page) notFound()

  const { project } = page
  return {
    title: `${project.title} · Archilab`,
    description: project.summary,
    openGraph: { images: [project.coverImage.src] },
  }
}

export default async function ProjectPage({ params }: PageProps<'/progetti/[slug]'>) {
  const { slug } = await params
  const [page, services] = await Promise.all([getProject.execute(slug), listServices.execute()])
  if (!page) notFound()

  const { project, previous, next, related } = page
  return (
    <>
      <ProjectDetail project={project} services={services} previous={previous} next={next} related={related} />
      <ClosingCta
        title={project.category === 'ristrutturazione' ? 'Hai una casa da ripensare? Scrivimi.' : 'Hai un progetto simile? Scrivimi.'}
      />
    </>
  )
}
