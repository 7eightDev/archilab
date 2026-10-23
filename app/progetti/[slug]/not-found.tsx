import Link from 'next/link'
import { textLinkClass } from '@/app/_components/site/link-styles'
import { PAGE_INTRO_ID } from '@/app/_components/site/mobile-contact-bar'
import { containerClass } from '@/app/_components/site/section-heading'

/** Shown for a project slug that does not exist. */
export default function ProjectNotFound() {
  return (
    <div id={PAGE_INTRO_ID} className={`${containerClass} flex flex-col items-center gap-6 py-28 text-center sm:py-40`}>
      <h1 className="font-heading text-[28px] leading-[1.15] font-light tracking-[.01em] text-balance sm:text-[40px]">
        Questo progetto non c’è
      </h1>
      <p className="max-w-[520px] text-[17px] leading-[1.6] text-muted-foreground">
        Forse è stato spostato, o il link ha un errore di battitura.
      </p>
      <Link href="/progetti" className={`${textLinkClass} text-[15px]`}>
        Tutti i progetti
      </Link>
    </div>
  )
}
