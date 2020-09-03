import { MiddlewareGroup } from "@module/types/middlewareGroup";
import { RequestHandler as ExpressRequestHandler } from "express";
import { RequestHandler } from "restify";

export type Route = {
  match?: string;
  middleware?: MiddlewareGroup;
  method?: string;
  action?: RequestHandler | ExpressRequestHandler;
};
