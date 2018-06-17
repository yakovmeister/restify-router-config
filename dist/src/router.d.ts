/**
 * takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param {Server} server restify server
 * @returns routing function
 */
export default function configureRoutes(server: any): (routes: any) => any;
