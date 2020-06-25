const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
module.exports = merge(common, {
  
  mode: 'development',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dev'),

  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  }
});