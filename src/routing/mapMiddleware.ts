import { MiddlewareGroup } from "@module/types/middlewareGroup";


/**
 * Properly map middlewares regardless if it's array or not
 * @param middlewares 
 * @return Array
 */
export function mapMiddleware(middlewares: MiddlewareGroup[]): MiddlewareGroup {
  const returnMiddleware = []

  middlewares.forEach(middleware => {
    if (Array.isArray(middleware)) {
      returnMiddleware.push(...middleware)
    } else {
      returnMiddleware.push(middleware)
    }
  })

  return returnMiddleware.filter(item => item)
}
