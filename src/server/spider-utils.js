var debug = require('debug')('ideator:server:spider-utils');
var got = require('got');
var blacklist = require('./data-blacklist');
var utils = require('./utils');

function DynamicSearch(){
}

DynamicSearch.prototype.ddg = function (submittedWord){
    var options = {
      protocol: 'http:',
      hostname: 'api.duckduckgo.com',
      path: '/?q='+submittedWord+'&format=json&t=ideator&pretty=1',
    };

    return got(options)
    .then(res => {
      var response = JSON.parse(res.body);
      var results = [];
      if(response.RelatedTopics.length > 0){
        response.RelatedTopics.forEach(i => {
          var str = i.Text.replace(/[^A-Za-z0-9]/g, ' ');
          var words = str.split(/\s+/);
          words.forEach(w => {
            results.push(w)
          })
        })
      }
      if(response.AbstractText !== ''){
        var str = response.AbstractText.replace(/[^A-Za-z]/g, ' ');
        var words = str.split(/\s+/);
        words.forEach(w=> {
          results.push(w)
        })
      }

      var lowerCase = results.map(word => {
        return word.toLowerCase()
      })

      var unique = lowerCase.filter((word, index, self) => {
        if(word === ''){
          return false
        } else if (word === submittedWord){
          return false
        } else if (utils.contains(blacklist, word)){
          return false
        }
        return self.indexOf(word) === index
      })

      var ready = unique.map(word => {
        var elem = {
          wordId: word,
          display: '_' + word.replace(/[^A-Za-z0-9]/g, '_'),
          deg: 0.5,
          link: 'web',
          freq: 3
        }
        return elem
      });

      return ready;
    })
    .catch(error => {debug(error)});
  }

DynamicSearch.prototype.wikiQuery = function (submittedWord){
    var options = {
      protocol: 'https:',
      hostname: 'en.wikipedia.org',
      path: '/w/api.php?action=parse&prop=categories|links&redirects=true&format=json&page='+submittedWord,
      headers: {
        'User-Agent': "IdeatorLoader/1.1"
      }
    };

    return got(options)
    .then(res => {
      var response = JSON.parse(res.body);
      var result = [];
      // debug(result);
      return result;
    }).catch(error => {debug(error)});
  }

module.exports = new DynamicSearch();
