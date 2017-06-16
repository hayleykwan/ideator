var debug = require('debug')('ideator:server:image-processor');
var got = require('got');
var config = require('./config');

function ImageProcessor(){

}

ImageProcessor.prototype.process = function(selectedData) {
  return new Promise((resolve, reject) => {

    var index = 0;
    var dataImg = [];
    var interval = setInterval(getImgData, 300);

    function getImgData() {
      if(index == selectedData.length){
        clearInterval(interval);
        debug('CLEAR AT INDEX: '+ index);
        debug('AFTER CLEAR: ' + selectedData.length);
        debug('AFTER CLEAR: ' + dataImg.length);
        resolve(selectedData);

      } else {
        getImageSrc(selectedData[index]).then(d => {
          debug(index);
          dataImg.push(d);
        });
        index++;
      }
    }

  });
}


var getImageSrc = function (d) {
  debug('AT getImageSrc');
  debug(d);
  var options = {
    protocol: 'https:',
    hostname: 'api.gettyimages.com',
    path: '/v3/search/images?orientations=square,horizontal,vertical&sort_order=best&phrase=' + d.wordId,
    headers: {
      'Api-Key': config.GETTY_IMAGES_API_KEY
    }
  };
  return got(options)
  .then(response => {
    var result = JSON.parse(response.body);
    var image = result.images[0];
    d['imageSrc'] = image.display_sizes[0].uri;
    debug('getting result');
    debug(d)
    return d;
  })
  .catch(error => {
    console.log(error);
    // console.log(error.response.body); //=> 'Internal server error ...
  });

}


module.exports = new ImageProcessor();
