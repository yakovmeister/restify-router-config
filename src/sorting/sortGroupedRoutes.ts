import { GroupedRoute } from "@module/types/groupedRoute";
import { sortByWildcards } from "@module/sorting/sortByWildcards";
import { Route } from "@module/types/route";

/**
 * Group sorted routes based on wildcards
 * @param routes GroupedRoutes
 * @return Route[]
 */
export function sortGroupedRoutes(routes: GroupedRoute): Route[] {
  const brokenRoutes = Object.entries(routes);
  const sortedBrokenRoutes = brokenRoutes.map(([, value]) => value.sort(sortByWildcards));

  return sortedBrokenRoutes.reduce((previous, current) => ([
    ...current,
    ...previous
  ]));
}
