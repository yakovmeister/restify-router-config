import { sortRoutes } from './sorts'

/**
 * normalize our endpoint, make sure it doesn't 
 * end with slash.
 * @param  {string} endpoint endpoint to be normalized
 * @returns normalized endpoint
 */
function normalizeEndpoint(endpoint: string) {
  return `/${endpoint.replace(/^\/|\/$/, '')}`
}

/**
 * A recursive function that takes a required route as an argument,
 * then calls itself if it's an array, otherwise returns the
 * translated route.
 * @param  {mixed} route array or object containing the route information
 * @param  {func} middleware middleware of the endpoint/group
 * @param  {string} prefix prepended to the beginning of endpoint
 * @returns object containing the translated route
 */
function routeTranslator(route : any, middleware ?: any, prefix ?: any) {
  if (Array.isArray(route) && route.length) {
    return route.map(function (_route) {
      if (_route.group) {
        return routeTranslator(
          _route.routes
          , _route.middleware
          , _route.group
        )
      }

      return routeTranslator(_route, middleware, prefix)
    })
  }

  middleware = [ middleware, route.middleware ].filter(elem => elem)
  prefix     = prefix ? `${prefix}${route.match}`.replace('//', '/') : route.match

  return {
    method: route.method,
    match: normalizeEndpoint(prefix),
    middleware,
    action: route.action
  }
}

/**
 * takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param {Server} server restify server
 * @param {boolean} verbose log routing
 * @returns routing function
 */
export default function configureRoutes(server : any, verbose = false) {
  return function (routes) {
    routes = routes.length ? sortRoutes(
      [].concat( ...routeTranslator(routes) )
    ) : []

    // safely route flatten translated routes.
    return routes.map(function (route) {
      if (verbose) {
        console.log(`Routing: [${route.method}] - ${route.match}`)
      }

      if (route.middleware.length) {
        return server[route.method](
          route.match
          , ...route.middleware
          , route.action
        )
      }

      return server[route.method](route.match, route.action)
    })
  }
}
