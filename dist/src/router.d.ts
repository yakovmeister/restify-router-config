/**
 * A recursive function that takes a required route as an argument,
 * then calls itself if it's an array, otherwise returns the
 * translated route.
 * @param  {mixed} route array or object containing the route information
 * @param  {func} middleware middleware of the endpoint/group
 * @param  {string} prefix prepended to the beginning of endpoint
 * @returns object containing the translated route
 */
export declare function routeTranslator(route: any, middleware?: any, prefix?: any): any;
/**
 * Flatten your route, takes care of your middleware and everything.
 * @param routes
 * @return Array
 */
export declare function transformRoutes(routes: any): any;
/**
 * takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param {Server} server restify server
 * @param {boolean} verbose log routing
 * @returns routing function
 */
export default function configureRoutes(server: any, verbose?: boolean, logger?: (message?: any, ...optionalParams: any[]) => void): (routes: any) => void;
