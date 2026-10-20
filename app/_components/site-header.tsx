import { Logo } from './logo'

interface SiteHeaderProps {
  showServices: boolean
  showProject: boolean
}

export function SiteHeader({ showServices, showProject }: SiteHeaderProps) {
  const links = [
    { href: '#chi-siamo', label: 'Chi siamo', visible: true },
    { href: '#servizi', label: 'Servizi', visible: showServices },
    { href: '#progetto', label: 'Progetto', visible: showProject },
    { href: '#contatti', label: 'Contatti', visible: true },
  ].filter((link) => link.visible)

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-4 pt-6 sm:px-8">
      <a href="#" aria-label="Archilab, torna all'inizio">
        <Logo />
      </a>
      <nav aria-label="Sezioni" className="-mx-2 flex flex-wrap text-sm text-navy">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center px-2 underline-offset-4 decoration-teal hover:text-teal-ink hover:underline"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
