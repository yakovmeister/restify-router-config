import { Request, Response, Next } from "restify";
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function noop(...args: [
  Request|ExpressRequest,
  Response|ExpressResponse,
  Next|NextFunction
]): void {
  /** A function, dead inside... Just like me */
}
