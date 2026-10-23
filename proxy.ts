import { type NextRequest, NextResponse } from 'next/server'
import { listProjects } from '@/app/_infrastructure/container'
import { MISSING_PROJECT_SLUG } from '@/app/progetti/missing-project'

/** Sends every unknown project slug to the single missing-project page. */
export async function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2]
  const { projects } = await listProjects.execute()
  if (projects.some((project) => project.slug === slug)) return NextResponse.next()

  return NextResponse.rewrite(new URL(`/progetti/${MISSING_PROJECT_SLUG}`, request.url))
}

export const config = {
  matcher: '/progetti/:slug',
}
