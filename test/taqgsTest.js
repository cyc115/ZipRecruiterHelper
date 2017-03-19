'use strict'

import Tags from '../es6/tags'
import assert from 'assert'
/**
 * Test loading of tags 
 */
describe('Tags#getTags()', function () {
  it('should return a list of duplicated pairs', function () {
    let t = new Tags()
    t
      .getTags('../es6/testTags.json')
      .then(tags => {
        assert.equal(tags, ["java", "javascript","python"])
      })


  })
})
 
