'use strict'

var assert = require('assert')
import { textTransform, occurrences, getDuplicateKwdList } from '../es6/scrapper'

describe('text transform methods', function () {
  describe('textTransform#all()', function () {
    it('should match string', function () {
      let old = '<p>hello World</p><p>hello World</p><p>hello World<p> </> </p>'
      let transformed = textTransform.all(old).trim()
      let actual = 'hello world  hello world  hello world'
      assert.equal(transformed, actual)
    })
  })

  describe('textTransform#removePeriods()', function () {
    it('should match string', function () {
      let old = '<p>hello ...World</p><p>,,,hello World.</p><p>hello World<p> </> ,</p>'

      let transformed = textTransform.removePeriods(old)
      let actual = '<p>hello World</p><p>   hello World</p><p>hello World<p> </>  </p>'
      assert.equal(transformed, actual)
    })
  })

  describe("textTransform#removeHTMLTags()", function () {
    it('should match string', function () {
      let old = '<p>hello ...World</p><p>,,,hello World.</p><p>hello World<p> </> ,</p>'

      let t = textTransform.removeHTMLTags(old)
      let actual = ' hello ...World  ,,,hello World.  hello World    , '
      assert.equal(t, actual)

    })
  })
})

describe('occurances()', function () {
  it('should match', function () {
    let str = `Talking about published code, let’s say you’re writing a library which you’d like to publish to NPM. Because you’ve done your research, you know that your published source should be ES5. And to make this happen, you’ve set up your project to compile your src directory’s files to a lib directory before publishing.

Naturally, your tests import the lib code which you’re actually publishing, not the original src files. And while this may go without saying, make sure you compile your code before testing!

Assuming you’ve followed part 1 and configured npm run compile to compile your source, that means running your tests after the compilation step:`

    let k = occurrences(str, 'to')
    assert.equal(k, 6)

  })
})


describe('getDuplicatedKwdList()', function () {
  it('should return a list of duplicated pairs', function () {
    
    getDuplicateKwdList()
  })
})



