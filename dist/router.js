'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = configureRoutes;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Sort string based on slash occurence and length of
 * its last phrase.
 * 
 * @param  {string} previous previous sort object
 * @param  {string} current  current sort object
 * @returns new sort value
 */
function sortByNumberOfSlashes(previous, current) {
	previous = previous.match.split('/');
	current = current.match.split('/');

	var currentSlashCount = current.length,
	    previousSlashCount = previous.length,
	    currentLastPhrase = current[current.length - 1].length,
	    previousLastPhrase = previous[previous.length - 1].length;

	if (currentSlashCount === previousSlashCount) {
		return currentLastPhrase - previousLastPhrase;
	}

	return currentSlashCount - previousSlashCount;
}

/**
 * sorts the given routes
 * @param  {array} routes array of routes
 * @returns sorted routes
 */
function sortRoutes(routes) {
	if (!Array.isArray(routes)) {
		throw new Error('routes are expected to be an array of object, ' + (typeof routes === 'undefined' ? 'undefined' : _typeof(routes)) + ' given.');
	}

	return routes.sort(sortByNumberOfSlashes);
}

/**
 * normalize our endpoint, make sure it doesn't 
 * end with slash.
 * @param  {string} endpoint endpoint to be normalized
 * @returns normalized endpoint
 */
function normalizeEndpoint(endpoint) {
	return '/' + endpoint.replace(/^\/|\/$/, '');
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
	if (Array.isArray(route)) {
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
	prefix = prefix ? ('' + prefix + route.match).replace('//', '/') : route.match;

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
 * @returns routing function
 */
function configureRoutes(server) {

	return function (routes) {
		var _ref;

		routes = sortRoutes((_ref = []).concat.apply(_ref, _toConsumableArray(routeTranslator(routes))));

		// safely route flatten translated routes.
		return routes.map(function (route) {
			if (route.middleware.length) {
				return server[route.method].apply(server, [route.match].concat(_toConsumableArray(route.middleware), [route.action]));
			}

			return server[route.method](route.match, route.action);
		});
	};
}
//# sourceMappingURL=router.js.map
