import { MiddlewareGroup } from "@module/types/middlewareGroup"

/**
 * Group middleware according to it's position
 * @param middlewares 
 * @return Array
 */
export function groupMiddleware (middlewares: Array<MiddlewareGroup>): Array<Array<MiddlewareGroup>> {
  const positions = {
    before: [],
    after: []
  }

  middlewares.forEach(middleware => {
    const isValidArray = Array.isArray(middleware) && middleware.length > 1;

    if (isValidArray) {
      if (isValidMiddlewarePosition(middleware[0])) {
        positions[middleware[0]].push(middleware[1])
      }
    } else {
      positions.before.push(middleware)
    }
  })

  const { before, after } = positions

  return [
    before,
    after
  ]
}

/**
 * Checks whethere the position supplied is valid
 * @param data 
 * @return boolean
 */
function isValidMiddlewarePosition(data: string) {
  return data === 'before' || data === 'after'
}