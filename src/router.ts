import { translateRoutes } from "@module/routing/translateRoutes";
import { Application } from "express";
import { Server } from "restify";
import { Routes } from "@module/types/routes";

/**
 * Takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param restify server
 * @param verbose log routing
 * @returns routing function
 */
export function router(server : Application|Server, verbose = false, logger = console.log): (routes: Routes) => void {
  return (routes: Routes): void => {
    const formatted = translateRoutes(routes)

    formatted.map(route => {
      if (verbose) {
        logger(`Routing: [${route.method}] - ${route.endpoint}`);
      }

      return server[route.method](route.endpoint, ...route.action);
    })
  }
}
