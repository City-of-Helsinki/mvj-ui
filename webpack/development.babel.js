// @flow

import path from 'path';
import mapValues from 'lodash/mapValues';
import createConfig from './createConfig';
import readDotenv from './readDotenv';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

const context = path.resolve(__dirname, '..');

export default createConfig({
  context,
  devtool: 'inline-source-map',
  entry: [
    'whatwg-fetch',
    'react-hot-loader/patch',
    'babel-polyfill',
    './src/index.js',
    './src/main.scss',
  ],
  output: {
    path: path.join(context, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(mapValues({
      ...readDotenv(context),
      ['process.env.NODE_ENV']: 'development',
    }, (v) => JSON.stringify(v))),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new DashboardPlugin(),
    new FaviconsWebpackPlugin(path.resolve(context, 'assets/images/favicon.png')),
  ],
  devServer: {
    hot: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    quiet: true,
    inline: true,
    stats: false,
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/,
    },
  },
});
