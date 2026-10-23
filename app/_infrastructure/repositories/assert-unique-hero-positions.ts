export function assertUniqueHeroPositions(items: { heroPosition?: number }[]): void {
  const seen = new Set<number>()

  for (const { heroPosition } of items) {
    if (heroPosition === undefined) continue
    if (seen.has(heroPosition)) throw new Error(`Posizione nell'Hero duplicata: ${heroPosition}`)
    seen.add(heroPosition)
  }
}
