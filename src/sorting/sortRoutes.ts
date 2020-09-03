import { groupByNumberOfSlashes } from "@module/sorting/groupByNumberOfSlashes";
import { sortGroupedRoutes } from "@module/sorting/sortGroupedRoutes";
import { Route } from "@module/types/route";

/**
 * sorts the given routes
 * @param Route[] List of routes
 * @returns Route[]
 */
export function sortRoutes(routes: Array<Route>): Route[] {
  if (!Array.isArray(routes)) {
    throw new Error(`Argument is expected to be an array of object, [${typeof routes}] type is given.`);
  }

  const groupedRoutes = groupByNumberOfSlashes(routes);

  return sortGroupedRoutes(groupedRoutes);
}
