'use client'

import { ContactDrawerTrigger } from './contact-drawer'
import { type NavLink, SiteHeader } from './site-header'

/**
 * The header of the project pages, whose "Contattami" opens the contact drawer.
 * A client component, so the render function for the contact controls never crosses from the server.
 */
export function DrawerSiteHeader({ links, homeHref }: { links: NavLink[]; homeHref: string }) {
  return (
    <SiteHeader
      links={links}
      homeHref={homeHref}
      contact={({ className, onClick, children }) => (
        <ContactDrawerTrigger className={className} onClick={onClick}>
          {children}
        </ContactDrawerTrigger>
      )}
    />
  )
}
