import { expect } from 'chai'
import router from '../src/router'
import { sortRoutes } from '../src/sorts'

describe('restify-router-config', () => {
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
})
