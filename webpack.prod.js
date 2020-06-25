const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const extractCss = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  
  mode: 'production',
  output: {
    filename: "[name].[contentHash].bundle.js",
    path: path.resolve(__dirname, 'dist'),

  },
  optimization: {
    minimizer: [
      new optimizeCss()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [extractCss.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [extractCss.loader, 'css-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [
    new extractCss({
      filename: 'css/[name].[contentHash].css',
    }),
  ]
});