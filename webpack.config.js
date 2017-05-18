// webpack.config.js for Babel 6

// module.exports = function(env) {
//   return require(`./webpack.${env}.js`)
// }
//

var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

const PATH_PUBLIC_JS = path.resolve(__dirname, 'public/javascripts');

module.exports = {
  entry: [
    './src/client/main.js',
      //entry point of the app

    'react-hot-loader/patch',
      // activate HMR for React
    //
    // 'webpack-dev-server/client?http://localhost:8080',
    //   // bundle the client for webpack-dev-server
    //   // and connect to the provided endpoint
    //
    // 'webpack/hot/only-dev-server',
    //   // bundle the client for hot reloading
    //   // only- means to only hot reload for successful updates
  ],

  output: {
    path: PATH_PUBLIC_JS,
    filename: 'bundle.js',
    // publicPath: '/'    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',
  
  // devServer: {
  //   hot: true,
  //   // enable HMR on the server
  //
  //   contentBase: PATH_PUBLIC_JS,
  //   // match the output path
  //
  //   publicPath: '/'
  //   // match the output `publicPath`
  // },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {presets: ['react', 'es2015']}
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?modules', ],
      },
    ]
  },

  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //    // enable HMR globally
  //   new webpack.NamedModulesPlugin(),
  //    // prints more readable module names in the browser console on HMR updates
  // ],

};
