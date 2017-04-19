var express = require('express');
var router = express.Router();
console.log('Get board page ready');

/* GET board page. */
router.get('/', function(req, res, next) {
  console.log('GET request, going to render board pug file');
  res.render('board', { title: 'ideas' });
});

module.exports = router;
