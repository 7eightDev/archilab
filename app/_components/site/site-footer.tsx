import { studio } from './content'
import { Logo } from './logo'
import { containerClass } from './section-heading'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-petrolio-3">
      <div
        className={`${containerClass} flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-10 text-[13px] leading-[1.6] text-muted-foreground`}
      >
        <Logo className="h-16 w-auto" />
        <p>
          {studio.architect} — {studio.city} ({studio.province}) · P.IVA {studio.vatNumber} · {studio.registration}
        </p>
        {/* TODO: point to the privacy and cookie pages once the studio provides the texts. */}
        <ul className="flex gap-5">
          <li>
            <a href="#top" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground">
              Privacy
            </a>
          </li>
          <li>
            <a href="#top" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground">
              Cookie
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
