/**
 * sorts the given routes
 * @param  {array} routes array of routes
 * @returns sorted routes
 */
export function sortRoutes(routes: Array<any>) {
  if (!Array.isArray(routes)) {
    throw new Error(`argument is expected to be an array of object, [${typeof routes}] type is given.`)
  }

  routes = groupBySlashes(routes)

  return groupSortWildcards(routes)
}

/**
 * Group sorted routes based on wildcards
 * @param routes 
 * @return grouped routes
 */
export function groupSortWildcards(routes: Array<any>) {
  return Object.entries(routes)
    .map(([key, value]) => {
      return value.sort(wildCard)
    }).reduce((previous, current) => ([
      ...current,
      ...previous
    ]))
}

/**
 * function for sorting based on slash count
 * @param previous previous element
 * @param current current element
 */
export function slashCount(previous: any, current: any) {
  previous = previous.match.split('/')
  current = current.match.split('/')

  const currentSlashes = current.length
  const previousSlashes = previous.length
  const currentLastPhrase = current[current.length - 1].length
  const previousLastPhrase = previous[previous.length -1].length

  if (currentSlashes === previousSlashes) {
    return currentLastPhrase - previousLastPhrase
  }

  return currentSlashes - previousSlashes
}

/**
 * Group routes based on its slash count
 * @param array routes
 */
export function groupBySlashes(array: Array<any>) {
  return array.reduce((previous, current) => {
    const key = current.match.split('/').length
    previous[key] = previous[key] || []
    previous[key].push(current)

    return previous
  }, {})
}

/**
 * function for sorting based on wildcards
 * @param previous previous element
 * @param current current element
 */
export function wildCard(previous: any, current: any) {
  const previousMatches = previous.match.match(/\/(\:[a-zA-Z0-9_-]{1,})/g)
  const currentMatches = current.match.match(/\/(\:[a-zA-Z0-9_-]{1,})/g)
  const previousUri = previous.match.split('/')
  const currentUri = current.match.split('/')
  const totalLength = currentUri ? currentUri.length : 0
  
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
