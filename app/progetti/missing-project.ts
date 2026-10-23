/**
 * The one page that answers for every unknown project. It is built with the others, so it answers 404
 * from the first request, and the cache holds a single copy instead of one per made-up address.
 */
export const MISSING_PROJECT_SLUG = 'non-trovato'
