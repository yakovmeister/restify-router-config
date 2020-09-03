import { Routes } from "@module/types/routes";
import { Route } from "@module/types/route";
import { MiddlewareGroup } from "@module/types/middlewareGroup";
import { RouteGroup } from "@module/types/routeGroup";
import { mapMiddleware } from "@module/routing/mapMiddleware";
import { appendPrefix } from "@module/routing/appendPrefix";
import { normalizeEndpoint } from "@module/routing/normalizeEndpoint";
import { noop } from "@module/noop";

/**
 * A recursive function that takes a required route as an argument,
 * then calls itself if it's an array, otherwise returns the
 * translated route.
 * 
 * @param  {mixed} route array or object containing the route information
 * @param  {func} middleware middleware of the endpoint/group
 * @param  {string} prefix prepended to the beginning of endpoint
 * @returns object containing the translated route
 */
export function routeResolver(routes: Route|Routes, middleware ?: MiddlewareGroup , prefix ?: string): Route|Route[] {
  if (Array.isArray(routes) && routes.length) {
    return [].concat(...(routes as Routes).map((route: Route|RouteGroup) => {

      if (!!(route as RouteGroup).group) {
        return routeResolver(
          (route as RouteGroup).routes
          , mapMiddleware([middleware, (route as RouteGroup).middleware])
          , prefix
        );
      }

      return routeResolver(route, middleware, prefix);
    }));
  }

  middleware  = mapMiddleware([ middleware, (routes as Route).middleware ]);
  prefix      = appendPrefix((routes as Route).match, prefix);

  return {
    method: (routes as Route).method ?? "get",
    match: normalizeEndpoint(prefix),
    middleware,
    action: (routes as Route).action ?? noop
  }
}
