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

const getEnvValues = {
  ...readDotenv(context),
  ['process.env.NODE_ENV']: 'production',
};

export default createConfig({
  context,
  devtool: 'source-map',
  entry: {
    'app': [
      'whatwg-fetch',
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
    // This is a practical solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new FaviconsWebpackPlugin(path.resolve(context, 'assets/images/favicon.png')),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
    })],
  },
});
