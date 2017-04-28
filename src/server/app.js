/*
 *  Sets up app to be ready on server
 */

console.log('begin app.js file');
var express = require('express');
var cors = require('cors');
var path = require('path');

require('babel-register')({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: false
}); //transpiling .es6, .es, .jsx, .js on the fly

// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

const React = require('react');
const ReactDOMServer = require('react-dom/server');

// var index = require('./routes/index');
// var users = require('./routes/users');
// var board = require('./routes/board');

var app = express();
// app.use(cors());

var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// var whitelist = ['https://murmuring-gorge-69160.herokuapp.com'];
// var corsOptions = {
//   origin: function (origin, callback) {
//     console.log(origin);
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS: ' + origin + '.\n'))
//     }
//   }
// }
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

app.get('/', cors(corsOptions),(req, res) => {
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
  // res.render(error);
  res.send(err.status + '\n' + err.stack);
});

module.exports = app;
