var debug = require('debug')('ideator:server:spider-utils');
var got = require('got');
var blacklist = require('./data-blacklist');
var utils = require('./utils');


function WebCrawlSearch(){

}

WebCrawlSearch.prototype.wikiQuery = function (submittedWord){
    var options = {
      protocol: 'https:',
      hostname: 'en.wikipedia.org',
      path: '/w/api.php?action=parse&prop=links|wikitext&redirects=true&format=json&page='+submittedWord,
      headers: {
        'User-Agent': "IdeatorLoader/1.1"
      }
    };

    return got(options)
    .then(response => {
      debug(JSON.parse(response.body))
      // var result = JSON.parse(response);
      return response.body;
    }).catch(error => {debug(error)});
  }

module.exports = new WebCrawlSearch();
