'use strict'

import * as zipRecruiter from './scrapper'
import readline from 'readline'
import fs from 'fs'

/**
 * provide an command line interface to keyword extraction service
 */

//load list of keywords to look for 
let tags = JSON.parse(fs.readFileSync('./tags.json', 'utf8'))
//load keywords that I am specifically looking for 
let mytags: string[] = JSON.parse(fs.readFileSync('./mytags.json', 'utf8'))

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('=> ');
rl.prompt();

rl.on('line', function (line: string) {
  let l: string[] = line.split(' ')
  if (l[0] === "exit") {
    rl.close();
  }

  switch (l[0]) {
    case "j": // single job search 
      if (l.length >= 2) {
        let urls = l.slice(1)
        urls.forEach((u, i) => {
          zipRecruiter
            .getJobDescriptionHTML(u)
            .then(zipRecruiter.textTransform.all)
            .then(description => {
              //get the relevent keywords from the description
              let t: string[] = zipRecruiter.matchTags(description, tags)
              let matchedTags: string[] = []
              let unmatchedTags: string[] = []

              //find how relevent a page is by filtering through tags important to me
              t.forEach(tag => {
                if (mytags.indexOf(tag.keyword) !== -1) { // the keyword matches my skills 
                  matchedTags.push(tag)
                }
                else {
                  unmatchedTags.push(tag)
                }
              })

              //display the results 
              console.log('unmatched keywords:')
              console.log(unmatchedTags)
              console.log('matched keywords:')
              console.log(matchedTags)

            }).catch(console.error)

        })
      }  //end "j"
      break
  }
  rl.prompt();
}).on('close', function () {
  process.exit(0);
});

