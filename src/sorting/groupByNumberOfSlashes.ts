import { Route } from "@module/types/route"
import { GroupedRoute } from "@module/types/groupedRoute";

/**
 * Group routes based on its slash count
 * @param array Routes[]
 * @return GroupedRoute
 */
export function groupByNumberOfSlashes(array: Array<Route>): GroupedRoute {
   return array.reduce((previous, current) => {
    const key = current.match.split("/").length;

    previous[key] = previous[key] ?? [];
    previous[key].push(current);

    return previous;
  }, {});
}
