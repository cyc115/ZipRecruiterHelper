import express from 'express';
import fs from 'fs';
import cheerio from 'cheerio';
import request from 'request';
import urljoin from 'url-join'
var read = require('node-readability');

'use-strict'

// @flow

const baseUrl = 'https://www.ziprecruiter.com/candidate/'

//genQueryUrl => getJobListFromUrl while does not return 0

/*
getJobListFromUrl(
    genQueryUrl("fullstack", 1, 1))
    .then((jobs) => {
        console.log(jobs.length);
    })


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
*/

function toLower(str: string): string {
    return str.toLowerCase()
}

function removeHTMLTags(str: string): string {
    return str.replace(/<[^>]*>/ig, ' ')
}
function removePeriods(str: string): string {
    return str.replace(/,/g, ' ').replace(/\./g, '')
}


/**
 * Find a list of keyords in text
 * @param {*string} text
 * @param {*string[]} keywords
 * @return return an array of keywordFrequencyPair {keyword: string , frequency : number } of keywords that exists in text
 */
export function matchTags(text: string = '', keywords: string[] = []): keywordFrequencyPair[] {
    let kwds: keywordFrequencyPair[] = []


    keywords.forEach((v, i) => {
        let n = occurrences(text, v, false)
        if (n > 0) {
            kwds.push({ keyword: v, frequency: n })
        }
    })
    kwds = kwds.sort((a:keywordFrequencyPair, b:keywordFrequencyPair) => {
        return b.frequency - a.frequency
    })
    return kwds
}

/**
 * Return the number of word occurences within a string, 
 * @param {string} str 
 * @param {string} subStr 
 * @param {boolean} allowOverlapping 
 */
export function occurrences(str: string = '', subStr: string = '', allowOverlapping: boolean = false): number {

    if (subStr.length <= 0) {
        return (str.length + 1)
    }

    subStr = subStr.trim()

    //if subStr is too short, then make sure it is a word, else do nothing
    // this is to prevent excessive matching of short keywords such as 'c' or 'ui'
    //append 1 space before and after the kwd to make sure each kwd is matched as a word
    if (subStr.length < 3) {
        subStr = ' ' + subStr + ' '
    }

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

            // sometimes the link provided extends to an external site
            // if so then use redability to parse the page
            if (description != null) {
                resolve(description)
            }
            else {
                read(url, (err, article, meta) => {
                    if (err) {
                        reject(err)
                    }
                    article.html == null ? resolve('') : resolve(article.html)
                })
            }
        })
    })

    return descriptionPromise
}

/**
 * Generate zipRecruiter search url given query terms 
 * @param {*string} search 
 * @param {*number} days 
 * @param {*number} page 
 */
export function genQueryUrl(
    search: string = "Software Engineer",
    days: number = 7,
    page: number = 1
): string {
    let url: string = urljoin(baseUrl,
        `search?&search=${encodeURIComponent(search.trim())}`,
        `&page=${page}`,
        `&days=${days}`
    )

    return url
}

/**
 * Returns an array of JobItems for the search url
 * @param {*string} url url generated from ${genQueryUrl} 
 */
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


export const textTransform = {
    toLower,
    removeHTMLTags,
    removePeriods,
    all: function (str: string): string {
        str = removeHTMLTags(str)
        str = toLower(str)
        str = removePeriods(str)
        return str
    }
}

type JobItem = {
    title: string,
    company: string,
    state: string,
    city: string,
    keywords: keywordFrequencyPair[],
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
    frequency: number,
}

