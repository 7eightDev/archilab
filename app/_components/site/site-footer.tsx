import { studio } from './content'
import { Logo } from './logo'
import { containerClass } from './section-heading'

/** Legal line built only from the details the studio has supplied. */
function legalLine() {
  return [
    `${studio.architect} — ${studio.city} (${studio.province})`,
    studio.vatNumber && `P.IVA ${studio.vatNumber}`,
    studio.registrationNumber ? `${studio.order} n. ${studio.registrationNumber}` : studio.order,
  ]
    .filter(Boolean)
    .join(' · ')
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-petrolio-3">
      <div
        className={`${containerClass} flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-10 text-[13px] leading-[1.6] text-muted-foreground`}
      >
        <Logo className="h-16 w-auto" />
        <p>{legalLine()}</p>
        {studio.privacyUrl && (
          <a href={studio.privacyUrl} className="inline-flex min-h-11 items-center transition-colors hover:text-foreground">
            Informativa privacy
          </a>
        )}
      </div>
    </footer>
  )
}
