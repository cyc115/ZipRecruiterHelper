import express from 'express';
import fs from 'fs';
import cheerio from 'cheerio';
import request from 'request';
import urljoin from 'url-join'
import { scrapSFTags } from './StackOverFlow'
'use-strict'

// @flow

const baseUrl = 'https://www.ziprecruiter.com/candidate/search?'

//genQueryUrl => getJobListFromUrl while does not return 0

/*
getJobListFromUrl(
    genQueryUrl("fullstack", 1, 1))
    .then((jobs) => {
        console.log(jobs.length);
    })
*/

let url = [
    "https://www.ziprecruiter.com/jobs/callfire-inc-3b8907f3/software-engineer-a43919d5?source=ziprecruiter_suggestedjobs_us",
    "https://www.ziprecruiter.com/jobs/sdhrc-2324525c/devops-engineer-cicd-focus-bcd545c7?source=ziprecruiter_suggestedjobs_us"
]



getJobDescriptionHTML(url[0])
    .then(removeHTMLTags)    
    .then(toLower)
    .then(txt => {
        let tags = JSON.parse(fs.readFileSync('./tags.json', 'utf8'))
        console.log(txt)
        console.time('matchTags')
        let kwds = matchTags(txt, tags)
        console.timeEnd('matchTags')

        console.log(kwds);
    })

function toLower(str: string): string {
    return str.toLowerCase()
}

function removeHTMLTags(str: string): string {
    return str.replace(/<\/?[a-z]+>/ig, ' ')
}

/**
 * Find a list of keyords in text
 * @param {*string} text
 * @param {*string[]} keywords
 * @return return an array of keywordFrequencyPair {keyword: string , frequency : number } of keywords that exists in text
 */
export function matchTags(text: string, keywords: string[]): keywordFrequencyPair[] {
    let kwds: keywordFrequencyPair[] = []

    keywords.forEach((v, i) => {
        let n = occurrences(text, v, false)
        if (n > 0) {
            kwds.push({ keyword: v, frequency: n })
        }
    })

    return kwds
}

/**
 * Return the number of occurences within a string
 * @param {string} str 
 * @param {string} subStr 
 * @param {boolean} allowOverlapping 
 */
function occurrences(str: string = '', subStr: string = '', allowOverlapping: boolean = false): number {

    if (subStr.length <= 0) {
        return (str.length + 1)
    }

    //append 1 space before and after the kwd to make sure each kwd is matched as a word
    subStr = ' ' + subStr.trim() + ' '

    let n = 0
    let pos = 0
    let step = allowOverlapping ? 1 : subStr.length

    while (true) {
        pos = str.indexOf(subStr, pos)
        if (pos >= 0) {
            ++n
            pos += step
        }
        else {
            break
        }
    }
    return n
}

/**
 * Returns the job description represented in stringified html document.
 * @param {*string} url 
 */
export function getJobDescriptionHTML(url: string): Promise<string> {
    let descriptionPromise = new Promise((resolve, reject) => {
        request(url, (err, response, html) => {
            if (err) {
                reject(err)
            }

            let $ = cheerio.load(html)
            let description = $('div.job_description div[itemprop="description"]').html()

            resolve(description)
        })
    })

    return descriptionPromise
}


export function genQueryUrl(
    search: string = "Software Engineer",
    days: number = 7,
    page: number = 1
): string {
    let url: string = urljoin(baseUrl,
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

type keywordFrequencyPair = {
    keyword: string,
    frequency: number
}