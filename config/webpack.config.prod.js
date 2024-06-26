'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  mode: 'production',
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: shouldUseSourceMap ? 'source-map' : false,
  // In production, we only want to load the polyfills and the app code.
  entry: {
    'app': [
      require.resolve('./polyfills'),
      paths.appIndexJs,
      paths.appScss,
    ],
    'assets/silent_renew': [
      require.resolve('./polyfills'),
      paths.silentRenewJs,
    ],
  },
  output: {
    path: paths.appBuild,
    publicPath: publicPath,
    filename: '[name].[chunkhash:8].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].[chunkhash:8].js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules',
    ],
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.ts', '.tsx'],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    fallback: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    }
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: paths.appSrc,
        exclude: paths.appNodeModules,
        options: {

          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 5000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.[ot]tf?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 5000,
          mimetype: 'application/octet-stream',
        },
      },
      {
        test: /\.(eot|svg|png|jpe?g)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: 'asset/resource',
        generator: {
            filename: '[hash][ext]'
        },
      },
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
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      chunks: ['app'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.silentRenewHtml,
      filename: 'silent_renew.html',
      chunks: ['assets/silent_renew'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name][contenthash:8].css',
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin.WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      navigateFallback: publicUrl + '/index.html',
      navigateFallbackDenylist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp('/[^/]+\\.[^/]+$'),
      ],
    }),
    // This is a practical solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        warnings: false,
        output: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  }
};
