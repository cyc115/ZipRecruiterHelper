'use strict'
import fs from 'fs'
import * as zipRecruiter from './scrapper'
import read from 'node-readability'


let url = zipRecruiter.genQueryUrl('fullstack', 3, 1)
let tags = JSON.parse(fs.readFileSync('./tags.json', 'utf8'))

zipRecruiter
  .getJobListFromUrl(url)
  .then(jobs => {
    let pArray: Promise[] = [] //resolve when we have requested all jobs

    //iterate through the job list to get detailed job descriptions and keywords
    jobs.forEach((job, idx) => {
      let p = zipRecruiter
        .getJobDescriptionHTML(job.link)  //get the job description html
        .then(zipRecruiter.textTransform.removeHTMLTags)  //remove tags
        .then(zipRecruiter.textTransform.toLower)  //convert to lower case 
        .then(zipRecruiter.textTransform.removePeriods)  //remove periods
        .then(description => {
          //keywords and its appared frequency
          job.keywords = zipRecruiter.matchTags(description, tags)
          job.descriptions = description

          return Promise.resolve()
        }).catch(console.err)

      pArray.push(p)
    })

    Promise.all(pArray)
      .then(() => {

        console.log('----')
        jobs.forEach((j, idx) => {
          console.log(j.title);
          console.log(j.keywords.map(v => v.keyword));
        })
      })
      .catch(console.err)

  })
  .catch(console.err)