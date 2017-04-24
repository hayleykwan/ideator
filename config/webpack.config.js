// webpack.config.js for Babel 6
var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

const PATH_PUBLIC_JS = path.resolve(__dirname, '../public/javascripts');

module.exports = {
 entry: '../src/client/main.js',
 output: { path: PATH_PUBLIC_JS, filename: 'bundle.js' },
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
