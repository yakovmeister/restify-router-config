/**
 * takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param {Server} server restify server
 * @param {boolean} verbose log routing
 * @returns routing function
 */
export default function configureRoutes(server: any, verbose?: boolean, logger?: (message?: any, ...optionalParams: any[]) => void): (routes: any) => any;
