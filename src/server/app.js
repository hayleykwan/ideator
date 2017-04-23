/*
 *  Sets up app to be ready on server
 */

console.log('begin app.js file');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

const React = require('react');
const ReactDOMServer = require('react-dom/server');
// const ReactApp = require("./es5-lib/ReactApp").default;
// const Welcome = require("./es5-lib/Welcome").default;

// var index = require('./routes/index');
// var users = require('./routes/users');
// var board = require('./routes/board');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());


// use virtual path instead for web security
const PATH_PUBLIC = path.resolve(__dirname, '../../public');
app.use('/static', express.static(PATH_PUBLIC));

app.get('/', (req, res) => {
  console.log('HERE-------------');
  res.sendFile(PATH_PUBLIC + '/index.html');
});


// isomorphic javascript
// app.get('/', (req, res) => {
//   // instantiate the React component
//   const rApp = React.createFactory(Welcome)({});
//
//   // write out the component to HTML string
//   const reactHtml = ReactDOMServer.renderToString(rApp);
//
//   // create final HTML to ship using string templating
//   // by injecting the react HTML into this string
//   const html = `
//     <!DOCTYPE html>
//     <html>
//      <head>
//      <title>DUMMY</title>
//      </head>
//      <body>
//      <div id="app">${reactHtml}</div>
//      <!--<script src="/static/javascripts/react-app.js"></script>-->
//      <img src="/static/images/chocolate2.jpg" height="500" width="380"/>
//      </body>
//     </html>
//   `;
//
//   // send to the browser
//   res.send(html);
// });



// app.use('/', index);
// app.use('/users', users);
// app.use('/board', board);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
