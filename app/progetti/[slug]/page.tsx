import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClosingCta } from '@/app/_components/site/closing-cta'
import { ProjectDetail } from '@/app/_components/site/project-detail'
import { getProject, listProjects, listServices } from '@/app/_infrastructure/container'
import { MISSING_PROJECT_SLUG } from '../missing-project'

// Everything on the page depends on the slug and every page is built ahead of time, so the navigation
// waits for the page instead of showing a shell.
export const instant = false

/**
 * Every project page is built ahead of time, plus the page the proxy sends unknown slugs to: built as a
 * 404, it answers with that status from the first request.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { projects } = await listProjects.execute()
  return [...projects.map(({ slug }) => ({ slug })), { slug: MISSING_PROJECT_SLUG }]
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
