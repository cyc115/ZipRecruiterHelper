import fs from 'fs';
import cheerio from 'cheerio';
import request from 'request';
import urljoin from 'url-join'

// @flow 

/*
scrapSFTags(10)
    .then(tags => {
        console.log(tags)
        fs.writeFile('tags.json', JSON.stringify(tags), () => { })
    })*/

/**
 * Scrape pages * 36 tags from the stackover flow tag list,
 * starting from the most popular to least popular.
 * returns a promise containing an array of tags
 * @param {* number} pages : from 1 to 1417
 */
export function scrapSFTags(pages = 1): Promise<string[]> {

  let index = 1
  let getUrl = () => {
    return `http://stackoverflow.com/tags?page=${index++}&tab=popular`
  }

  let promises = []
  let tags: string[] = []
  while (index <= pages) {
    let p = new Promise((res, rej) => {
      request(getUrl(), (err, response, html) => {
        if (err) {
          rej(err)
        }
        else {
          fs.writeFileSync('temp.html', html)
          res(html)
        }
      })
    }).then((html) => {
      let $ = cheerio.load(html)
      let results = []

      $('.post-tag').each((idx, ele) => {
        results.push($(ele).text())
      })

      return results

    }).catch(console.err)

    promises.push(p)
  }

  return Promise.all(promises)
    .then(arr => {
      console.log(arr.length);
      arr.forEach((v, i) => {
        tags.push(...v)
      })
      return Promise.resolve(tags)
    })
}