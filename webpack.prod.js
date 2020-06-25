const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const miniCSS = require('mini-css-extract-plugin');

module.exports = merge(common, {
  
  mode: 'production',
  output: {
    filename: "[name].[contentHash].bundle.js",
    path: path.resolve(__dirname, 'dist'),

  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [miniCSS.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [miniCSS.loader, 'css-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [
    new miniCSS({
      filename: 'css/[name].[contentHash].css',
    }),
  ]
});