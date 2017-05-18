const datamuse = require('datamuse');

function Datamuse() {

}

Datamuse.queryMeansLike = function(){
  datamuse.words({
    ml: 'hello'
  }).then((json) => {
    return json
  });
}

Datamuse.queryTrigger = function(){
  datamuse.words({
    rel_trig: 'explosion'
  }).then((json) => {
    return json
  });
}

module.exports = new Datamuse();
