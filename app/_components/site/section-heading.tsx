import { cn } from '@/app/_lib/utils'

interface SectionHeadingProps {
  id?: string
  number: string
  /** Rendered in uppercase; `accent` follows it in brass, e.g. "LO" + "STUDIO". */
  title: string
  accent: string
  /** Separator between title and accent: a space, or nothing for "SCRIVI" + "MI". */
  joiner?: string
  children?: React.ReactNode
  className?: string
}

/** Centred section opener: brass number, wide-tracked Oswald title, optional lead. */
export function SectionHeading({ id, number, title, accent, joiner = ' ', children, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 flex flex-col items-center gap-3 text-center sm:mb-14', className)}>
      <span className="text-xs font-medium tracking-[.3em] text-ottone">{number}</span>
      <h2 id={id} className="font-heading text-[clamp(26px,3.4vw,40px)] leading-[1.1] font-light tracking-[.36em] uppercase">
        {title}
        {joiner}
        <span className="text-ottone">{accent}</span>
      </h2>
      {children}
    </div>
  )
}

/** Lead paragraph under a section heading. */
export function SectionLead({ children, display = false }: { children: React.ReactNode; display?: boolean }) {
  return display ? (
    <p className="mt-2 max-w-[640px] font-heading text-[clamp(20px,2.4vw,26px)] leading-[1.3] tracking-[.04em] text-balance">
      {children}
    </p>
  ) : (
    <p className="mt-2 max-w-[560px] text-[17px] leading-[1.6] text-muted-foreground">{children}</p>
  )
}

/** Brass uppercase micro-label used in the title block, the address and the cards. */
export const microLabelClass = 'text-[11px] leading-none font-medium tracking-[.3em] text-ottone'

/** 1200px column with the 24px gutter used by every section. */
export const containerClass = 'mx-auto w-full max-w-[1200px] px-6'
