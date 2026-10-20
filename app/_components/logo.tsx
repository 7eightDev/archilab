/** Simplified version of the Archilab mark: the house drawn over construction lines. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" aria-hidden className={className} fill="none">
      <path d="M2 46 L30 20 L44 33" stroke="var(--terracotta)" strokeWidth="2" />
      <line x1="10" y1="12" x2="10" y2="46" stroke="var(--rule)" strokeWidth="1" />
      <line x1="16" y1="8" x2="16" y2="46" stroke="var(--slate)" strokeWidth="1" />
      <rect x="21" y="16" width="3" height="30" fill="var(--terracotta-ink)" />
      <rect x="28" y="31" width="7" height="15" fill="var(--navy)" />
      <path d="M46 1 V46 H62" stroke="var(--navy)" strokeWidth="1.5" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-end gap-2">
      <LogoMark className="h-10 w-auto" />
      <span className="flex flex-col gap-1 pb-1 leading-none">
        <span className="text-lg tracking-[0.28em] text-navy">ARCHILAB</span>
        <span className="text-xs text-terracotta-ink">Maria Pezzella, architetto</span>
      </span>
    </span>
  )
}
