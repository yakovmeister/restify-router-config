/**
 * sorts the given routes
 * @param  {array} routes array of routes
 * @returns sorted routes
 */
export declare function sortRoutes(routes: Array<any>): any;
export declare function groupSortWildcards(routes: Array<any>): any;
/**
 * function for sorting based on slash count
 * @param previous previous element
 * @param current current element
 */
export declare function slashCount(previous: any, current: any): number;
/**
 * Group routes based on its slash count
 * @param array routes
 */
export declare function groupBySlashes(array: Array<any>): any;
/**
 * function for sorting based on wildcards
 * @param previous previous element
 * @param current current element
 */
export declare function wildCard(previous: any, current: any): number;
