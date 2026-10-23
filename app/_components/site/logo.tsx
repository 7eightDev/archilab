type Reveal = 'logo-draw' | 'logo-rise' | 'logo-reveal'

/**
 * Archilab mark redrawn as SVG from the studio's business card (light version for the petrolio ground).
 * Replace with the original vector file when the studio provides it.
 * `drawing` builds the mark up like a pencil sketch (keyframes in globals.css): strokes first, then the
 * two solid volumes, then the lettering. The delays below are that construction order, in ms.
 */
export function Logo({ className, drawing = false }: { className?: string; drawing?: boolean }) {
  const reveal = (kind: Reveal, delay: number) =>
    drawing ? { className: kind, style: { animationDelay: `${delay}ms` }, ...(kind === 'logo-draw' && { pathLength: 1 }) } : {}

  return (
    <svg role="img" aria-label="Archilab — Maria Pezzella Architetto" viewBox="170 170 2000 800" fill="none" className={className} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      <line x1="180" y1="960" x2="720" y2="960" stroke="var(--testo-2)" strokeWidth="3" {...reveal('logo-draw', 0)} />
      <line x1="258" y1="545" x2="258" y2="960" stroke="var(--linea-forte)" strokeWidth="4" {...reveal('logo-draw', 150)} />
      <line x1="325" y1="495" x2="325" y2="960" stroke="var(--testo-2)" strokeWidth="6" {...reveal('logo-draw', 300)} />
      <line x1="205" y1="715" x2="340" y2="890" stroke="var(--linea-forte)" strokeWidth="3" {...reveal('logo-draw', 450)} />
      <line x1="330" y1="715" x2="205" y2="890" stroke="var(--linea-forte)" strokeWidth="3" {...reveal('logo-draw', 550)} />
      <rect x="414" y="605" width="24" height="355" fill="var(--rame)" {...reveal('logo-rise', 1300)} />
      <line x1="690" y1="715" x2="690" y2="960" stroke="var(--linea-forte)" strokeWidth="3" {...reveal('logo-draw', 650)} />
      <polyline points="185,960 565,590 710,715" stroke="var(--ottone)" strokeWidth="16" {...reveal('logo-draw', 750)} />
      <rect x="515" y="745" width="100" height="215" fill="var(--testo)" {...reveal('logo-rise', 1450)} />
      <polyline points="710,180 710,948 965,948" stroke="var(--testo)" strokeWidth="8" {...reveal('logo-draw', 950)} />
      <text x="770" y="615" fill="var(--testo)" fontWeight="300" fontSize="190" letterSpacing="26" {...reveal('logo-reveal', 1900)}>
        ΛRCHILΛB
      </text>
      <text x="775" y="800" fill="var(--testo)" fontWeight="300" fontSize="122" letterSpacing="4" {...reveal('logo-reveal', 2100)}>
        Maria Pezzella
      </text>
      <text x="785" y="905" fill="var(--ottone)" fontWeight="400" fontSize="62" letterSpacing="6" {...reveal('logo-reveal', 2300)}>
        Architetto
      </text>
    </svg>
  )
}
