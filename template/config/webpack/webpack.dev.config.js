/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('webpack-merge');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'js/[name].[hash:8].bundle.js',
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../../dist'),
    open: 'http://127.0.0.1:9000',
    port: 9000,
    compress: true,
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      hash: false
    }),
    new webpack.HotModuleReplacementPlugin(),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css',
    }),

    new ProgressBarWebpackPlugin(),

    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://localhost:9000 \n\n Derrick是帅哥`],
      },
      quiet: true,
    }),
  ]
});
