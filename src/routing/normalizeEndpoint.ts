/**
 * Normalize our endpoint, make sure it doesn't 
 * end with slash.
 * @param endpoint endpoint to be normalized
 * @return string
 */
export function normalizeEndpoint(endpoint: string): string {
  return `/${endpoint.replace(/^\/|\/$/, '')}`;
}
