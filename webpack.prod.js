const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const ExtractCss = require('mini-css-extract-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const TerserMini = require('terser-webpack-plugin');
module.exports = merge(common, {

  mode: 'production',
  output: {
    filename: '[name].[contentHash].bundle.js',
    path: path.resolve(__dirname, 'dist'),

  },
  optimization: {
    minimizer: [
      new OptimizeCss(), new TerserMini(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCss.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [ExtractCss.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new ExtractCss({
      filename: 'css/[name].[contentHash].css',
    }),
  ],
});
