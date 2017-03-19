'use strict'

import Tags, {commonSubstringPairs} from '../es6/tags'
import assert from 'assert'
/**
 * TODO Test loading of tags 
 */
describe('Tags#getTags()', function () {
  it('should load Tags from file correctly ', function () {
    let t = new Tags()
    t
      .getTags('../es6/testTags.json')
      .then(tags => {
        assert.equal(tags, ["java", "javascript","python"])
      })
  })
})
 
describe('commonSubstringPairs()', function () {
  it('should return a list of keyword pairs that the ' +
    'second item in the pair has the first item as substring.', function () {
      let t = ["java", "javascript", "python"]
      
      let pairs = commonSubstringPairs(t)
      assert.notEqual(pairs, null, 'result is null')
      assert.equal(pairs.length, 1, 'length does not match ')
      assert.equal(pairs[0].first, 'java', 'first keyword does not match')
      assert.equal(pairs[0].second,'javascript', 'second keyword does not match')
    })
  
 })