/**
 * Archilab mark redrawn as SVG from the studio's business card (light version for the petrolio ground).
 * Replace with the original vector file when the studio provides it.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg role="img" aria-label="Archilab — Maria Pezzella Architetto" viewBox="170 170 2000 800" fill="none" className={className} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      <line x1="180" y1="960" x2="720" y2="960" stroke="var(--testo-2)" strokeWidth="3" />
      <line x1="258" y1="545" x2="258" y2="960" stroke="var(--linea-forte)" strokeWidth="4" />
      <line x1="325" y1="495" x2="325" y2="960" stroke="var(--testo-2)" strokeWidth="6" />
      <line x1="205" y1="715" x2="340" y2="890" stroke="var(--linea-forte)" strokeWidth="3" />
      <line x1="330" y1="715" x2="205" y2="890" stroke="var(--linea-forte)" strokeWidth="3" />
      <rect x="414" y="605" width="24" height="355" fill="var(--rame)" />
      <line x1="690" y1="715" x2="690" y2="960" stroke="var(--linea-forte)" strokeWidth="3" />
      <polyline points="185,960 565,590 710,715" stroke="var(--ottone)" strokeWidth="16" />
      <rect x="515" y="745" width="100" height="215" fill="var(--testo)" />
      <polyline points="710,180 710,948 965,948" stroke="var(--testo)" strokeWidth="8" />
      <text x="770" y="615" fill="var(--testo)" fontWeight="300" fontSize="190" letterSpacing="26">
        ΛRCHILΛB
      </text>
      <text x="775" y="800" fill="var(--testo)" fontWeight="300" fontSize="122" letterSpacing="4">
        Maria Pezzella
      </text>
      <text x="785" y="905" fill="var(--ottone)" fontWeight="400" fontSize="62" letterSpacing="6">
        Architetto
      </text>
    </svg>
  )
}
