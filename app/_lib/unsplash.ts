/**
 * Provisional photos are served from Unsplash until the studio provides its own. Every URL carries
 * the same query string, so next.config.ts can allow exactly that one in `images.remotePatterns`.
 */
export const UNSPLASH_SEARCH = '?auto=format&fit=crop&w=2400&q=80'

export function unsplash(photoId: string): string {
  return `https://images.unsplash.com/${photoId}${UNSPLASH_SEARCH}`
}
