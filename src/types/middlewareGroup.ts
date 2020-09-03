import { NextFunction } from "express";
import { Next } from "restify";

export type BeforeMiddleware = {
  before?: OriginalMiddleware;
};
export type AfterMiddleware = {
  after?: OriginalMiddleware;
};
export type OriginalMiddleware = NextFunction | Next;
type CustomArrayMiddleware = Array<OriginalMiddleware|BeforeMiddleware|AfterMiddleware>;
export type MiddlewareGroup = OriginalMiddleware | CustomArrayMiddleware;
