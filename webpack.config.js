const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
      app: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  module: {
     rules: [
       {
         test: /\.css$/,
         use: ['style-loader', 'css-loader']
       }
     ]
   },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};


// // Load the http module to create an http server.
// // var http = require('http');
// const webpack = require('webpack')
// const copy = require('copy-webpack-plugin')
// const path = require('path')
//
// module.exports = {
//     entry: './src/index.js',
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, 'dist')
//     },
//
//     plugins: [
//         // https://www.npmjs.com/package/copy-webpack-plugin
//         new copy([
//             {
//                 from: 'src/index.html'
//             }
//         ])
//     ],
//
//
//
//     // module: {
//     //     resolve: {
//     //         modules: [
//     //             'node...'
//     //         ]
//     //     }
//     // }
//     module: {
//         rules: [{
//             test: /\.js$/,
//             include: path.resolve(__dirname, 'src'),
//             // use: [{
//             //     loader: 'babel-loader',
//             //     options: {
//             //         presets: [
//             //             ['es2015', { modules: false }]
//             //         ]
//             //     }
//             // }]
//         }]
//     }
//
// }
//
//
// // Configure our HTTP server to respond with Hello World to all requests.
// // var server = http.createServer(function (request, response) {
// //   response.writeHead(200, {"Content-Type": "text/plain"});
// //   response.end("Hello Lybe, feels good to be with you 3!\n");
// // });
//
// // Listen on port 8000, IP defaults to 127.0.0.1
// // server.listen(8001);
//
// // Put a friendly message on the terminal
// // console.log("Server running at http://127.0.0.1:8001/");
