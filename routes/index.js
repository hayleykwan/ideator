var express = require('express');
var router = express.Router();
console.log('Get index page ready');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('GET request, going to render index (NOT pug) file');
  // res.render('index', { title: 'Ideator' });
  res.render('index');
});

module.exports = router;
