'use strict'

import * as zipRecruiter from './scrapper'
import type keywordFrequencyPair from './scrapper'
import readline from 'readline'
import fs from 'fs'

/**
 * provide an command line interface to keyword extraction service
 */

//load list of keywords to look for 
const tags = JSON.parse(fs.readFileSync('./es6/tags.json', 'utf8'))
const mytags: string[] = JSON.parse(fs.readFileSync('./es6/mytags.json', 'utf8'))

let cmdStat = {
  currentJobTitles: [],
  jobs : null,
  isInJobSearch: false
}

let cmdConst = {
  AWKWARD_MSG: 'so this is awkward, I haven\'t got the chance to make this yet '
}

var rl = readline.createInterface(process.stdin, process.stdout);

console.log('welcome to jobDistiller-cli, to get started, enter help');

rl.setPrompt('=> ');
rl.prompt();

rl.on('line', function (line: string) {
  let l: string[] = line.split(' ')
  if (l[0] === "exit") {
    rl.close();
  }

  switch (l[0]) {
    case 'help':
      console.log(cmdConst.AWKWARD_MSG)
      break
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
              console.log("---------for url " , i, "-----------");
              console.log('unmatched keywords:')
              console.log(unmatchedTags)
              console.log('matched keywords:')
              console.log(matchedTags)
              console.log();
            }).catch(console.error)
        })
      }  //end "j"      
      break
/*
    case 'search':
      if (line.trim() === 'search') {
        console.log('please search in this format : search "job title" days page')
      }

      else {
        let beg = line.indexOf("\"")
        let endTitle = line.indexOf("\"", beg + 1)
        let title = line.substring(beg + 1, endTitle)
        if (title === null || typeof title !== 'string') {
          throw new Error('title parsing error')
        }
        let page = Number(l[l.length - 1])
        let days = Number(l[l.length - 2])

        console.log(`\nPage ${page} of ${title} jobs in the past ${days}`);
        console.log('---------------------------------------------------');

        zipRecruiter
          .getJobListFromUrl(zipRecruiter.genQueryUrl(title, days, page))
          .then(jobs => {
            //print job title and remember them
            cmdStat.currentJobTitles = []
            jobs.forEach((v, idx) => {
              let shortTitle = `${idx}\t\ts${v.title}`
              cmdStat.currentJobTitles.push(shortTitle)
              cmdStat.isInJobSearch = true
              console.log(shortTitle)
            })
            console.log('---------------------------------------------------')

            //get job descripts 
            let jobDescPromiseArr = []
            jobs.forEach(j,jobIdx => {
              let p = new Promise((resolve, reject) => {
                zipRecruiter
                  .getJobDescriptionHTML(j.link)
                  .then(zipRecruiter.textTransform.all)
                  .then(description => {
                    //get the relevent keywords from the description
                    let t : keywordFrequencyPair = zipRecruiter.matchTags(description, tags)
                    let ts = zipRecruiter.filterTags(tags, mytags)
                    j.keywords = ts
                    resolve()
                  }).catch(console.error)
              })

              jobDescPromiseArr.push(p)
            })
            Promise
              .all(jobDescPromiseArr)
              .then( () => {
                console.log('you can now access description of each job');
              })
            
            //add jobs to state 
            cmdStat.jobs = jobs 
          })
      }
      
      break
      */

  }
  rl.prompt();
}).on('close', function () {
  process.exit(0);
});

