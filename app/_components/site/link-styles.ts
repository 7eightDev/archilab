import { buttonVariants } from '@/app/_components/ui/button'

/** Inline text link on petrolio: underlined, brightening on hover. */
export const textLinkClass =
  'text-foreground underline decoration-1 underline-offset-[6px] transition-colors hover:text-white'

/** Primary call to action rendered as a link ("Raccontami la tua idea →"). */
export const ctaLinkClass = buttonVariants({ size: 'cta' })
