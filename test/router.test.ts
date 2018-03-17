import { expect } from 'chai'
import router, { transformRoutes, routeTranslator } from '../src/router'
import { sortRoutes } from '../src/sorts'

describe('restify-router-config', () => {

  const server = {
    get: (endpoint, controller) => console.log({ endpoint, controller }),
    post: (endpoint, controller) => console.log({ endpoint, controller }),
    put: (endpoint, controller) => console.log({ endpoint, controller }),
    patch: (endpoint, controller) => console.log({ endpoint, controller }),
    del: (endpoint, controller) => console.log({ endpoint, controller })
  }

  const testSubject = [
    { match: '/:foo/:awe' },
    { match: '/:foo/:awe/:awe2' },
    { match: '/:foo/awe/awe2' },
    { match: '/foo' },
    { match: '/foo/:awe/awe2' },
    { match: '/foo/awe/awe2' },
    { match: '/:foo/awe/:awe2' },
    { match: '/foo/:awe/:awe2' },
    { match: '/foo/:awe' },
    { match: '/foo/awe/:awe2' },
    { match: '/:awe/:foo/:bar' },
    { match: '/awe/foo/bar' },
    { match: '/:foo/awe' },
    { match: '/:foo' }
  ]

  const testSubjectShouldMatch = [
    { match: '/foo/awe/awe2' },
    { match: '/awe/foo/bar' },
    { match: '/foo/awe/:awe2' },
    { match: '/foo/:awe/awe2' },
    { match: '/foo/:awe/:awe2' },
    { match: '/:foo/awe/awe2' },
    { match: '/:foo/awe/:awe2' },
    { match: '/:awe/:foo/:bar' },
    { match: '/:foo/:awe/:awe2' },
    { match: '/foo/:awe' },
    { match: '/:foo/awe' },
    { match: '/:foo/:awe' },
    { match: '/foo' },
    { match: '/:foo' }
  ]

  it('should sort array based on the number of slashes', () => {
    const sorted = sortRoutes(testSubject)

    expect(sorted.toString()).to.eq(testSubjectShouldMatch.toString())
  })

  it('should throw an error if group and resources co-exist', () => {
    const throwSomething = function () {
      return transformRoutes([
        {
          group: '/users',
          resources: '/users',
          routes: [
            {
              match: '/:id',
              action: () => {}
            }
          ]
        }
      ])
    }

    expect(throwSomething).to.throw()
  })

  it('should throw an error if no controller is speficified', () => {
    const throwSomething = () => transformRoutes([
      {
        group: '/rooms',
        middleware: [
          ['before', function holla() {} ]
        ],
        routes: [
          {
            resources: '/deluxe',
            middleware: [
              ['before', function middlewarez() {} ],
              ['after', function afterz() {} ]
            ]
          },
          {
            match: '/deluxe/sample/foo/:id',
            action: function foo() {},
            middleware: []
          }
        ]
      }
    ])

    expect(throwSomething).to.throw()
  })
})
