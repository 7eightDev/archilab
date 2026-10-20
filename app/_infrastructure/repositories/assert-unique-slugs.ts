export function assertUniqueSlugs(items: { slug: string }[]): void {
  const seen = new Set<string>()

  for (const { slug } of items) {
    if (seen.has(slug)) throw new Error(`Slug duplicato: ${slug}`)
    seen.add(slug)
  }
}
