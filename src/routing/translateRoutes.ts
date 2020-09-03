import { Routes } from "@module/types/routes";
import { sortRoutes } from "@module/sorting/sortRoutes";
import { routeResolver } from "@module/routing/routeResolver";
import { groupMiddleware } from "@module/routing/groupMiddleware";
import { Route } from "@module/types/route";
import { FormattedRoute } from "@module/types/formattedRoute";

/**
 * Flatten your route, takes care of your middleware and everything.
 * @param routes 
 * @return Array
 */
export function translateRoutes(routes: Routes): FormattedRoute[] {
  let flattened = [];
  
  if (routes.length) {
    const resolvedRoutes = routeResolver(routes);

    flattened = sortRoutes(
      [].concat( ...resolvedRoutes as Route[] )
    );
  }

  return flattened.map(function (route) {
    let action = [ route.action ];

    if (route.middleware.length) {
      const [ before, after ] = groupMiddleware(route.middleware);

      action = [ ...before, ...action, ...after];
    }

    return {
      method: route.method,
      endpoint: route.match,
      action
    };
  });
}
