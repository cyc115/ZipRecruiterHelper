import express from 'express';
import fs from 'fs';
import cheerio from 'cheerio';
import request from 'request';

// @flow

let app = express()

/*
app.get('/', (req, res) => {
    let url = 'http://www.imdb.com/title/tt1229340/'

    request(url, (err, res, html) => {
        if(!err) {
            let $ = cheerio.load(html)
            console.log($('h1').text());
            let json = {
                title : "",
                release : "",
                rating : ""
            }
            
        }
    })

})

app.listen('8081')
console.log("listening on port 8081")

export default app

*/
let url = 'https://www.ziprecruiter.com/candidate/search?days=9&refine_by_title=Software%20Engineer&search=Software%20Development'

request(url, (err, res, html) => {
    if (!err) {
        let $ = cheerio.load(html)
        let lst = $('div .job_results').find('article')
        console.log(lst.length)
        lst.each((idx, ele) => {
            console.log(idx, $(ele).find('span.just_job_title').text())
        })

        debugger
    }
})
/*

let url = 'http://www.imdb.com/title/tt1229340/'
 
request(url, (err, res, html) => {
    if (!err) {
        let $ = cheerio.load(html)
        
        let rating = $('div .metacriticScore.score_favorable.titleReviewBarSubItem span').get(0).text

        let json = {
            title: $('h1').text().trim(),
            release: $('meta[itemprop = "datePublished"]').get(0).attribs.content,
            rating: rating
        }

        console.log(json);

    }
})

*/

