'use strict'

var read = require('node-readability')
var fs = require('fs')
//var retext = require('retext')
//var keywords = requier('retext-keywords')
//var nlcstToString = require('nlcst-to-string')


var urls = [
  'http://stackoverflow.com/jobs/133420/lead-software-engineer-wazer',
  'https://www.ziprecruiter.com/jobs/ektello-986f3494/software-developer-no-c2c-1099-a4eb71f1?source=ziprecruiter-jobs-site',
  "https://www.dice.com/jobs/detail/Software-Engineer-4-NORTHROP-GRUMMAN-San-Diego-CA-92101/ngitbot/17005426?icid=sr1-1p&q=software%20engineer&l=San%20Diego,%20CA"
]


read(urls[2],
  (err, article, meta) => {
    fs.writeFile('article.html', article.content, 'utf8', () => console.log('completed'))

    console.log(article.title);
    console.log(article.document);
    //console.log('meta', meta);

  })