import { expect } from 'chai'
import { groupByNumberOfSlashes } from "@module/sorting/groupByNumberOfSlashes";

describe("restify-router-config", () => {
  it("test", () => {
    const test =groupByNumberOfSlashes([
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
    ]);

    console.log(test);
  });
});
