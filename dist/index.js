"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * sorts the given routes
 * @param  {array} routes array of routes
 * @returns sorted routes
 */
function sortRoutes(routes) {
  if (!Array.isArray(routes)) {
    throw new Error("argument is expected to be an array of object, [" + _typeof(routes) + "] type is given.");
  }

  routes = groupBySlashes(routes);
  return groupSortWildcards(routes);
}

function groupSortWildcards(routes) {
  return Object.entries(routes).map(function (_a) {
    var key = _a[0],
        value = _a[1];
    return value.sort(wildCard);
  }).reduce(function (previous, current) {
    return current.concat(previous);
  });
}

function groupBySlashes(array) {
  return array.reduce(function (previous, current) {
    var key = current.match.split('/').length;
    previous[key] = previous[key] || [];
    previous[key].push(current);
    return previous;
  }, {});
}

function wildCard(previous, current) {
  var previousMatches = previous.match.match(/\/(\:[a-zA-Z0-9_-]{1,})/g);
  var currentMatches = current.match.match(/\/(\:[a-zA-Z0-9_-]{1,})/g);
  var previousUri = previous.match.split('/');
  var currentUri = current.match.split('/');
  var totalLength = currentUri ? currentUri.length : 0;
  /**
   * ensures that those that doesn't have wildcard are pushed to
   * top, and full length wildcards are pushed to bottom
   */

  if (!previousMatches) {
    return -1;
  }

  if (!currentMatches) {
    return 1;
  }

  if (previousMatches.length === totalLength - 1) {
    return 1;
  }

  if (currentMatches.length === totalLength - 1) {
    return -1;
  }

  var previousSum = previousMatches.map(function (e) {
    return previousUri.indexOf(e.replace('/', ''));
  }).reduce(function (p, c) {
    return (p + c) / previousUri.length;
  });
  var currentSum = currentMatches.map(function (e) {
    return currentUri.indexOf(e.replace('/', ''));
  }).reduce(function (p, c) {
    return (p + c) / currentUri.length;
  });
  return currentSum - previousSum;
}
/**
 * normalize our endpoint, make sure it doesn't
 * end with slash.
 * @param  {string} endpoint endpoint to be normalized
 * @returns normalized endpoint
 */


function normalizeEndpoint(endpoint) {
  return "/" + endpoint.replace(/^\/|\/$/, '');
}
/**
 * A recursive function that takes a required route as an argument,
 * then calls itself if it's an array, otherwise returns the
 * translated route.
 * @param  {mixed} route array or object containing the route information
 * @param  {func} middleware middleware of the endpoint/group
 * @param  {string} prefix prepended to the beginning of endpoint
 * @returns object containing the translated route
 */


function routeTranslator(route, middleware, prefix) {
  if (Array.isArray(route) && route.length) {
    return route.map(function (_route) {
      if (_route.group) {
        return routeTranslator(_route.routes, _route.middleware, _route.group);
      }

      return routeTranslator(_route, middleware, prefix);
    });
  }

  middleware = [middleware, route.middleware].filter(function (elem) {
    return elem;
  });
  prefix = prefix ? ("" + prefix + route.match).replace('//', '/') : route.match;
  return {
    method: route.method,
    match: normalizeEndpoint(prefix),
    middleware: middleware,
    action: route.action
  };
}
/**
 * takes a restify server as an argument, returns a function
 * that takes an array of object.
 * @param {Server} server restify server
 * @param {boolean} verbose log routing
 * @returns routing function
 */


function configureRoutes(server, verbose) {
  if (verbose === void 0) {
    verbose = false;
  }

  return function (routes) {
    routes = routes.length ? sortRoutes([].concat.apply([], routeTranslator(routes))) : []; // safely route flatten translated routes.

    return routes.map(function (route) {
      if (verbose) {
        console.log("Routing: [" + route.method + "] - " + route.match);
      }

      if (route.middleware.length) {
        return server[route.method].apply(server, [route.match].concat(route.middleware, [route.action]));
      }

      return server[route.method](route.match, route.action);
    });
  };
}

var _default = configureRoutes;
exports.default = _default;
