import { Route } from "@module/types/route"

/**
 * function for sorting based on wildcards
 * @param previous previous element
 * @param current current element
 */
export function sortByWildcards(previous: Route, current: Route): number {
  const previousMatches = previous.match.match(/\/(\:[a-zA-Z0-9_-]{1,})/g)
  const currentMatches  = current.match.match(/\/(\:[a-zA-Z0-9_-]{1,})/g)
  const previousUri     = previous.match.split('/')
  const currentUri      = current.match.split('/')
  const totalLength     = currentUri ? currentUri.length : 0
  
  /**
   * ensures that those that doesn't have wildcard are pushed to
   * top, and full length wildcards are pushed to bottom
   */
  if (!previousMatches) {
    return -1
  }

  if (!currentMatches) {
    return 1
  }

  if (previousMatches.length === (totalLength - 1)) {
    return 1
  }

  if(currentMatches.length === (totalLength - 1)) {
    return -1
  }

  const previousSum = previousMatches.map(e => {
    return previousUri.indexOf(e.replace('/', ''))
  }).reduce((p,c) => ((p + c) / previousUri.length))

  const currentSum = currentMatches.map(e => {
    return currentUri.indexOf(e.replace('/', ''))
  }).reduce((p,c) => ((p + c) / currentUri.length))

  return currentSum - previousSum
}
