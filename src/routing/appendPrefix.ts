/**
 * append additional prefix
 * @param route original route
 * @param prefix route prefix
 * @return string
 */
export function appendPrefix(route: string, prefix?: string): string {
  if (prefix) {
    route = route.replace(/^\/|\/$/g, '')
    prefix = prefix.replace(/^\/|\/$/g, '')
    route = `/${prefix}/${route}`.replace('//', '/')
  }

  return route.replace(/\/$/, '')
}
