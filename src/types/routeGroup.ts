import { Route } from "@module/types/route";
import { MiddlewareGroup } from "./middlewareGroup";

export type RouteGroup = {
  group?: string;
  middleware?: MiddlewareGroup;
  routes?: Array<Route>;
};
