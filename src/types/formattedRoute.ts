import { OriginalMiddleware } from "@module/types/middlewareGroup";
import { RequestHandler } from "restify";
import { Handler } from "express";


export type FormattedRoute = {
  method?: string;
  endpoint?: string;
  action?: Array<OriginalMiddleware|RequestHandler|Handler>
};
