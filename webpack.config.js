// webpack.config.js for Babel 6
var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = {
 entry: './main.js',
 output: { path: __dirname + '/public/javascripts', filename: 'react-app.js' },
 module: {
   loaders: [
   {
     test: /.jsx?$/,
     loader: 'babel-loader',
     exclude: /node_modules/,
     query: {presets: ['react', 'es2015']}
   }]
 },
};
