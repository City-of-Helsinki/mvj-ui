import path from 'path';
import mapValues from 'lodash/mapValues';
import createConfig from './createConfig';
import readDotenv from './readDotenv';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
// import OfflinePlugin from 'offline-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

const context = path.resolve(__dirname, '..');

// TODO: Make this better
const getEnvValues = {
  ['API_URL']: process.env.API_URL,
  ['OPENID_CONNECT_API_TOKEN_KEY']: process.env.OPENID_CONNECT_API_TOKEN_KEY || '',
  ['OPENID_CONNECT_API_TOKEN_URL']: process.env.OPENID_CONNECT_API_TOKEN_URL || '',
  ['OPENID_CONNECT_AUTHORITY_URL']: process.env.OPENID_CONNECT_AUTHORITY_URL || '',
  ['OPENID_CONNECT_CLIENT_ID']: process.env.OPENID_CONNECT_CLIENT_ID,
  ['OPENID_CONNECT_SCOPE']: process.env.OPENID_CONNECT_SCOPE || '',
  ['STORAGE_PREFIX']: process.env.STORAGE_PREFIX,
  ['process.env.NODE_ENV']: 'production',
  ...readDotenv({...context, silent: true}),
};

export default createConfig({
  context,
  devtool: 'source-map',
  entry: {
    'app': [
      'whatwg-fetch',
      'react-hot-loader/patch',
      '@babel/polyfill',
      './src/index.js',
      './src/main.scss',
    ],
    'assets/silent_renew': [
      './src/silent_renew',
    ],
  },
  output: {
    path: path.join(context, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].[hash].js',
  },
  module: {
    rules: [
      {
        test: [
          /\.scss$/,
          /\.css$/,
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanPlugin(['./dist/*'], {root: context}),
    new webpack.DefinePlugin(mapValues(getEnvValues, (v) => JSON.stringify(v))),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/silent_renew.html',
      filename: 'silent_renew.html',
      chunks: ['assets/silent_renew'],
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    // }),
    new MiniCssExtractPlugin({
      filename: '[name][hash].css',
    }),
    // new OfflinePlugin({
    //   AppCache: false,
    //   publicPath: '/',
    //   relativePaths: false,
    //   ServiceWorker: {
    //     events: true,
    //   },
    // }),
    new FaviconsWebpackPlugin(path.resolve(context, 'assets/images/favicon.png')),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
    })],
  },
});
