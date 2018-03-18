# restify-router-config  

react-router-config inspired Restify routing tool. 
  
## Installation
  
```
npm install -S restify-router-config
```  
  
## Usage
  
```javascript
const restify = require('restify')
const router = require('restify-router-config')
const { getUserById, getUser, login } = require('./controllers/users')
const { restrictedRoute } = require('./middlewares')

/** create restify server */
const server = restify.createServer()
/** configure your routes */
router(server)([
	{
		group: 'users',
		routes: [
			{
				match: '/:id',
				middleware: restrictedRoute,
				method: 'get',
				action: getUserById
			},
			{
				match: '/',
				method: 'get',
				action: getUser
			}
		]
	},
	{
		match: '/login',
		method: 'post',
		action: login
	}
])

server.listen(8080)
```  
  
## Why use restify-router-config?  
  
You don't have to, but if you're used to `react-router-config`, then this would make it easier for you to configure your routes as 
it is almost similar structure to `react-router-config`, another advantage of using this route tool is you can easily chain your middleware. For instance if you want to protect all of your routes, and at same time a single route would require additional middleware, you'd do it like this:  

```javascript
const { anotherMiddleware } = require('./middlewares')

router(server)([
	{
		// assuming that you want to protect all routes under /users
		group: 'users',
		middleware: restrictedRoute,
		routes: [
			{
				match: '/:id',
				middleware: anotherMiddleware,
				method: 'get',
				action: getUserById
			},
			{
				match: '/',
				method: 'get',
				action: getUser
			}
		]
	}
])
// the code from above would use `restrictedRoute` middleware first, and if you're going to access /users/:id, it would also 
use `anotherMiddleware` middleware.
```

## Disclaimer
  
* Didn't have time to write tests, don't expect that things should work the way it should.
* Current releases may not be stable until further notice. I didn't have much time to tinker around. Any kind of help is appreciated.