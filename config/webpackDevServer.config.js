'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const webpackConfig = require('./webpack.config.dev');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

module.exports = function() {
  return {
    allowedHosts: ['localhost', '0.0.0.0', '127.0.0.1'],
    // Enable gzip compression of generated files.
    compress: true,
    // By default files from `contentBase` will not trigger a page reload.
    static: {
      directory: webpackConfig.output.path,
      watch: true,
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host: host,
    client: { 
      logging: 'none',
      overlay: false,
    },
    open: true,
    devMiddleware: {
      publicPath: webpackConfig.output.publicPath,
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    host: host,
    port: port,
    //proxy,
    setupMiddlewares: function(middlewares) {
      // This lets us open files from the runtime error overlay.
      middlewares.unshift(errorOverlayMiddleware());
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
      middlewares.unshift(noopServiceWorkerMiddleware(webpackConfig.output.publicPath));
      return middlewares;
    },
  };
};
