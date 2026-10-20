import { ContactSection } from '@/app/_components/contact-section'
import { Hero } from '@/app/_components/hero'
import { Logo } from '@/app/_components/logo'
import { ServicesSection } from '@/app/_components/services-section'
import { getFeaturedProject, listServices } from '@/app/_infrastructure/container'

export default async function Home() {
  const [project, services] = await Promise.all([getFeaturedProject.execute(), listServices.execute()])

  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-4 pt-6 sm:px-8">
        <a href="#" aria-label="Archilab, torna all'inizio" className="focus-visible:outline-2 focus-visible:outline-offset-4 ">
          <Logo />
        </a>
        <nav aria-label="Sezioni" className="flex gap-6 text-sm text-navy">
          {services.length > 0 && (
            <a href="#servizi" className="underline-offset-4 hover:underline">
              Servizi
            </a>
          )}
          <a href="#contatti" className="underline-offset-4 hover:underline">
            Contatti
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <Hero showProjectLink={project !== null} />
        <ServicesSection services={services} />
        <ContactSection />
      </main>
      <footer className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate sm:px-8">
          Archilab, studio di architettura di Maria Pezzella
        </div>
      </footer>
    </>
  )
}
