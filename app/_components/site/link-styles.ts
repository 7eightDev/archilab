import { cn } from 'cn'
import { buttonVariants } from '@/app/_components/ui/button'

/** Inline text link on petrolio: underlined, brightening on hover. */
export const textLinkClass =
  'text-foreground underline decoration-1 underline-offset-[6px] transition-colors hover:text-white'

/** Primary call to action rendered as a link ("Raccontami la tua idea →"). */
export const ctaLinkClass = buttonVariants({ size: 'cta' })

/** Secondary call to action rendered as a link, framed like the other bordered buttons ("Leggi il caso studio →"). */
// Merged like Button does, or the base border-transparent would hide the outline's border.
export const outlineCtaLinkClass = cn(buttonVariants({ variant: 'outline', size: 'cta' }))

/** The outline call to action on a 10% white tint, to set it apart from its neighbour ("Tutti i progetti · 10"). */
export const tintedCtaLinkClass = cn(outlineCtaLinkClass, 'bg-white/10 hover:bg-white/15')
