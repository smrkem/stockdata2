const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

const srcDir = path.resolve(__dirname, 'src')


module.exports = {
  entry: `${srcDir}/index.js`,
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: 'standard-loader',
      exclude: /node_modules/
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${srcDir}/index.html`
    }),
    new DashboardPlugin()
  ]
}
