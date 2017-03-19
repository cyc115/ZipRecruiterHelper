import fs from 'fs'

// @flow
export default class Tags {

  /**
   * Asynchronously load tags and return a promise containing array of tags 
   */
  getTags(location: string = './tags.json'): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(Location, 'utf8', (err, data: string) => {
        if (!err) {
          resolve(JSON.parse(data))
        }

        else {
          reject(err)
        }
      })
    })
  }

}

/**
 * From a list of keywords, find pairs that the first keyword is a substring of
 * the second keyword 
 * @param {*string [] } keywords 
 */
export function commonSubstringPairs(keywords: string[]): { first: string, second: string }[] {
  let kwd = keywords.slice(0, keywords.length)
  kwd.sort()
  let dup = []

  for (let i = 0; i < kwd.length - 1; i++) {
    if (
      //typeof kwd[i + 1] == typeof kwd[i] == 'string'
      kwd[i + 1].includes(kwd[i])
    ) {
      dup.push({ first: kwd[i], second: kwd[i + 1] })
    }

    else if (typeof kwd[i + 1] !== typeof kwd[i]) {
      console.log(typeof kwd[i] , typeof kwd[i+1]);
    }
  }

  return dup
}

console.log( commonSubstringPairs(['java', 'javascript']))