import { ContactDrawerProvider } from '@/app/_components/site/contact-drawer'
import { DrawerSiteHeader } from '@/app/_components/site/drawer-site-header'
import { MobileContactBar, PAGE_CTA_ID, PAGE_INTRO_ID } from '@/app/_components/site/mobile-contact-bar'
import { SiteFooter } from '@/app/_components/site/site-footer'
import { listServices } from '@/app/_infrastructure/container'

/** Shell of the project list and of every project page: the header points back to the home, "Contattami" opens the drawer. */
export default async function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const services = await listServices.execute()
  const links = [
    { href: '/#studio', label: 'Studio' },
    ...(services.length > 0 ? [{ href: '/#servizi', label: 'Servizi' }] : []),
    { href: '/progetti', label: 'Progetti', current: true },
  ]

  return (
    <ContactDrawerProvider>
      <DrawerSiteHeader links={links} homeHref="/" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileContactBar startId={PAGE_INTRO_ID} endId={PAGE_CTA_ID} drawer />
    </ContactDrawerProvider>
  )
}
