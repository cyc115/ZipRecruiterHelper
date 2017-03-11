import express from 'express';
import fs from 'fs';
import cheerio from 'cheerio';
import request from 'request';
import urljoin from 'url-join'

'use-strict'

// @flow
type JobItem = {
    title: string,
    company: string,
    state: string,
    city: string,
    keywords: string[],
    link: ?string,
    applyLink: ?string,
    experience: string,
    positionType: string,
    descriptions: string,
    pay: string,
    dateCreated: number,
}

type JobPage = {
    jobs: JobItem[],
    prev: string,
    next: string
}

const baseUrl = 'https://www.ziprecruiter.com/candidate/search?'

let url = "https://www.ziprecruiter.com/candidate/search?days=9&refine_by_title=Software%20Engineer&search=Software%20Development"
let url2 = "https://www.ziprecruiter.com/candidate/search?days=9&refine_by_title=Software%20Engineer&page=50&search=Software%20Development"

//genQueryUrl => getJobListFromUrl while does not return 0

getJobListFromUrl(genQueryUrl("fullstack", 1, 1))
    .then((jobs) => {
        console.log(jobs.length);
    })

export function genQueryUrl(
    search: string = "Software Engineer",
    days: number = 7,
    page: number = 1
): string {
    let url = urljoin(baseUrl,
        `days=>${days}`,
        `&search=${encodeURIComponent(search.trim())}`,
        `&page=${page}`
    )

    return url
}

export function getJobListFromUrl(url: string): Promise<JobItem[]> {
    let getListOfJob = new Promise((resolve, reject) => {
        request(url, (err, res, html) => {
            if (err) {
                reject(err)
            }
            else {
                let $ = cheerio.load(html)
                let lst: [] = $('div .job_results').find('article')
                fs.writeFile('./temp.html', $.html(), () => { }) //write to fs for logging 
                resolve({ lst, $ })
            }
        })
    }).catch(err => {
        console.error(err)
    }).then(({ lst, $ }) => {
        let res: JobItem[] = []
        console.log('job list length :', lst.length)
        lst.each((idx, ele) => {

            // create the job item 
            let item: JobItem = {
                title: $(ele).find('span.just_job_title').text(),
                company: $(ele).find('.t_org_link').text(),
                state: $(ele).find('span[itemprop="addressRegion"]').text(),
                city: $(ele).find('span[itemprop="addressLocality"]').text(),
                link: $(ele).find('.job_link.t_job_link').attr('href'),
                keywords: [],
                experience: '',
                descriptions: '',
                positionType: '',
                dateCreated: Date.now()
            }
            res.push(item)
            console.log("---- " + item.title)
        })

        return Promise.resolve(res)
    })

    return getListOfJob
}
