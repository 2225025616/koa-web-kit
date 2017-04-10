'use strict';

const del = require('del');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseWebpackConfig = require('./webpack.config.base');
const config = require('./env');
const utils = require('./utils');

const APP_PATH = utils.APP_PATH;

const libCSSExtract = new ExtractTextPlugin(utils.getName('common', 'css', 'contenthash', true));
const scssExtract = new ExtractTextPlugin(utils.getName('[name]', 'css', 'contenthash', true));
const scssExtracted = scssExtract.extract(utils.getStyleLoaders('css-loader', 'postcss-loader', 'sass-loader', true));

del.sync('./build/app');

module.exports = webpackMerge(baseWebpackConfig, {
  output: {
    publicPath: config.getAppPrefix() + config.getStaticPrefix(),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: APP_PATH,
        // exclude: /node_modules/,
        exclude: [/node_modules/, /content\/scss\/bootstrap\.scss$/],
        use: scssExtracted
      },
      {
        test: /content\/scss\/bootstrap\.scss$/,
        use: libCSSExtract.extract(utils.getStyleLoaders('css-loader', 'sass-loader', true))
      },
      {
        test: /\.css$/,
        use: libCSSExtract.extract(utils.getStyleLoaders('css-loader', true))
      },
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'DEV_MODE': true,
      'process.env': JSON.stringify(config.getNodeEnv()),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    libCSSExtract,
    scssExtract,
  ],
});