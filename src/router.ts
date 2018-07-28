import { sortRoutes } from './sorts'

/**
 * Assign empty action if action was not specified
 * @param req server request
 * @param res server respones
 * @param next ...
 */
function noop(req, res, next) { }

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
export function routeTranslator(route : any, middleware ?: any, prefix ?: any) {
  if (Array.isArray(route) && route.length) {
    return [].concat(...route.map(function (_route) {
      const groupAndResourcesCoExist = _route.group && _route.resources 
      const resourcesHasNoController = _route.resources && !_route.controller

      if (groupAndResourcesCoExist) {
        throw new Error(`Group and Resources cannot co-exist.`)
      }

      if (resourcesHasNoController) {
        throw new Error(`Cannot resolve resources without specifying a controller`)
      }

      if (_route.resources) {
        console.log(`This feature is under development`)

        const resolved = resolveResources(_route)

        return routeTranslator(
          resolved
          , mapMiddleware([middleware, _route.middleware])
          , prefix
        )
      }

      if (_route.group) {
        return routeTranslator(
          _route.routes
          , mapMiddleware([middleware, _route.middleware])
          , appendPrefix(_route.group, prefix)
        )
      }

      return routeTranslator(_route, middleware, prefix)
    }))
  }

  middleware = mapMiddleware([ middleware, route.middleware ])
  prefix = appendPrefix(route.match, prefix)

  return {
    method: assignWithDefault(route.method, 'get'),
    match: normalizeEndpoint(prefix),
    middleware,
    action: assignWithDefault(route.action, noop)
  }
}

/**
 * Safely assign default value if first argument is undefined
 * @param value value intended to be assigned
 * @param defaultValue fallback value
 * @return mixed
 */
function assignWithDefault(value, defaultValue) {
  return value ? value : defaultValue
}

/**
 * Resolve resources by mapping corresponding functions to its endpoint
 * @param route route
 * @reutrn Array
 */
function resolveResources(route) {
  const resources = [
    { method: 'get', match: '/', functionName: 'index' },
    { method: 'get', match: '/:id', functionName: 'view' },
    { method: 'post', match: '/', functionName: 'store' },
    { method: 'put', match: '/:id', functionName: 'update' },
    { method: 'patch', match: '/:id', functionName: 'patch' },
    { method: 'del', match: '/:id', functionName: 'delete' }
  ]

  return Object.entries(route.controller)
    .map(([key, value]) => {
      const resource = resources.find(each => each.functionName === key)

      if (resource) {
        return {
          method: resource.method,
          match: appendPrefix(resource.match, route.resources),
          action: value
        }
      }
    }).filter(item => item)
}

/**
 * Properly map middlewares regardless if it's array or not
 * @param middlewares 
 * @return Array
 */
function mapMiddleware(middlewares) {
  const returnMiddleware = []

  middlewares.forEach(middleware => {
    if (Array.isArray(middleware)) {
      returnMiddleware.push(...middleware)
    } else {
      returnMiddleware.push(middleware)
    }
  })

  return returnMiddleware.filter(item => item)
}

/**
 * append additional prefix
 * @param route original route
 * @param prefix route prefix
 * @return string
 */
function appendPrefix(route, prefix: any = false) {
  if (prefix) {
    route = route.replace(/^\/|\/$/g, '')
    prefix = prefix.replace(/^\/|\/$/g, '')
    route = `/${prefix}/${route}`.replace('//', '/')
  }

  return route.replace(/\/$/, '')
}

/**
 * Group middleware according to it's position
 * @param middlewares 
 * @return Array
 */
function groupMiddleware (middlewares: Array<any>) {
  const positions = {
    before: [],
    after: []
  }

  middlewares.forEach(middleware => {
    if (isValidArray(middleware)) {
      if (isValidMiddlewarePosition(middleware[0])) {
        positions[middleware[0]].push(middleware[1])
      }
    } else {
      positions.before.push(middleware)
    }
  })

  const { before, after } = positions

  return [
    before,
    after
  ]
}

/**
 * Checks whethere the position supplied is valid
 * @param data 
 * @return boolean
 */
function isValidMiddlewarePosition(data: string) {
  return data === 'before' || data === 'after'
}

/**
 * Checks whether the supplied argument is array with values
 * @param data 
 * @return boolean
 */
function isValidArray(data: string | Array<any>) {
  return Array.isArray(data) && data.length > 1
}

/**
 * Flatten your route, takes care of your middleware and everything.
 * @param routes 
 * @return Array
 */
export function transformRoutes(routes) {
  routes = routes.length ? sortRoutes(
    [].concat( ...routeTranslator(routes) )
  ) : []

  return routes.map(function (route) {
    let action = [ route.action ]

    if (route.middleware.length) {
      const [ before, after ] = groupMiddleware(route.middleware)

      action = [ ...before, ...action, ...after]
    }

    return {
      method: route.method,
      endpoint: route.match,
      action
    }
  })
}

/**
 * takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param {Server} server restify server
 * @param {boolean} verbose log routing
 * @returns routing function
 */
export default function configureRoutes(server : any, verbose = false, logger = console.log) {
  return function (routes) {
    routes = transformRoutes(routes)

    routes.map(route => {
      if (verbose) {
        logger(`Routing: [${route.method}] - ${route.endpoint}`)
      }

      return server[route.method](route.endpoint, ...route.action)
    })
  }
}
