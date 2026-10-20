import { AboutSection } from '@/app/_components/about-section'
import { ContactSection } from '@/app/_components/contact-section'
import { FeaturedProjectSection } from '@/app/_components/featured-project-section'
import { Hero } from '@/app/_components/hero'
import { ServicesSection } from '@/app/_components/services-section'
import { SiteFooter } from '@/app/_components/site-footer'
import { SiteHeader } from '@/app/_components/site-header'
import { getFeaturedProject, listServices } from '@/app/_infrastructure/container'

export default async function Home() {
  const [project, services] = await Promise.all([getFeaturedProject.execute(), listServices.execute()])

  return (
    <>
      <SiteHeader showServices={services.length > 0} showProject={project !== null} />
      <main className="flex-1">
        <Hero showProjectLink={project !== null} />
        <AboutSection />
        <ServicesSection services={services} />
        <FeaturedProjectSection project={project} />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
