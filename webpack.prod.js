const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './index.js',
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:6].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },{
      test: /\.css$/,
      use: ExtractTextPlugin.extract(['css-loader'])
    }]
  },
  devtool: 'source-map',
  performance: {
    maxAssetSize: 400000,
    maxEntrypointSize: 400000,
    hints: 'error'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: `./index.html`
    }),
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath('css/styles.[chunkhash:6].css').replace('css/js', 'css');
      },
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
  ]
}
