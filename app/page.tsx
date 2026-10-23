import { Contact } from '@/app/_components/site/contact'
import { heroSlides, studio } from '@/app/_components/site/content'
import { FeaturedProject } from '@/app/_components/site/featured-project'
import { GridLines } from '@/app/_components/site/grid-lines'
import { Hero } from '@/app/_components/site/hero'
import { LogoIntro } from '@/app/_components/site/logo-intro'
import { Method } from '@/app/_components/site/method'
import { MobileContactBar } from '@/app/_components/site/mobile-contact-bar'
import { ServicesPath } from '@/app/_components/site/services-path'
import { SiteFooter } from '@/app/_components/site/site-footer'
import { SiteHeader } from '@/app/_components/site/site-header'
import { Studio } from '@/app/_components/site/studio'
import { getFeaturedProject, listServices } from '@/app/_infrastructure/container'

// schema.org description of the studio for search engines; extend it as the studio supplies more details.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Architect',
  name: `${studio.name} — ${studio.architect}`,
  image: heroSlides[0].image.src,
  telephone: studio.phoneHref.replace('tel:', ''),
  email: studio.email,
  areaServed: 'Fondi (LT)',
  address: {
    '@type': 'PostalAddress',
    streetAddress: studio.street,
    postalCode: studio.postalCode,
    addressLocality: studio.city,
    addressRegion: studio.province,
    addressCountry: 'IT',
  },
}

export default async function Home() {
  const [project, services] = await Promise.all([getFeaturedProject.execute(), listServices.execute()])

  const links = [
    { href: '#studio', label: 'Studio' },
    ...(services.length > 0 ? [{ href: '#servizi', label: 'Servizi' }] : []),
    ...(project ? [{ href: '#progetti', label: 'Progetti' }] : []),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      {/* First, so its inline script marks the page before the header and the hero are painted. */}
      <LogoIntro />
      <SiteHeader links={links} />
      <main className="flex-1">
        <Hero slides={heroSlides} showProjectLink={project !== null} />
        <div className="relative">
          <GridLines />
          <Studio />
          {services.length > 0 && <ServicesPath services={services} />}
        </div>
        {project && <FeaturedProject project={project} services={services} />}
        <Method />
        <Contact />
      </main>
      <SiteFooter />
      <MobileContactBar />
    </>
  )
}
