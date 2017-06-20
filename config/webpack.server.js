const webpack = require('webpack');
const path = require('path');

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const clone = require('js.clone');
/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
});

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  var serverConfig = commonConfig({env: ENV});

  serverConfig.module.rules = serverConfig.module.rules.concat([

    /*
     * css loader support for *.css files (styles directory only)
     * Loads external css styles into the DOM, supports HMR
     *
     */
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: [helpers.root('src', 'styles'), helpers.root('node_modules')]
    },

    /*
     * sass loader support for *.scss files (styles directory only)
     * Loads external sass styles into the DOM, supports HMR
     *
     */
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader'],
      include: [helpers.root('src', 'styles'), helpers.root('node_modules')]
    }
  ]);

  serverConfig.target = "node";
  serverConfig.node = {
    global: false,
    __dirname: false,
    __filename: false,
    process: false,
    Buffer: false
  };

  serverConfig.entry = [
    './src/polyfills.node',
    './src/main.node'
  ];

  serverConfig.output = {
    path: helpers.root('dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  };

// This filters out all node_module packages from the compile process, except the ones listed here.
  serverConfig.externals = includeClientPackages([
    // might want to add material files here.
  ]);
  serverConfig.plugins = [
    new webpack.IgnorePlugin(/vertx/),
    new CheckerPlugin(),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('src') // location of your src
    ),
    new LoaderOptionsPlugin({}),
  ];

  return serverConfig;
};

function includeClientPackages(packages) {
  return function (context, request, cb) {
    if (packages && packages.indexOf(request) !== -1) {
      return cb();
    }
    return checkNodeImport(context, request, cb);
  };
}

// Helpers
function checkNodeImport(context, request, cb) {
  // the css loader-requires must be resolved at compile time, as angular2-template-loader generates source-location specific paths back to node-modules/css-loader.
  if (!path.isAbsolute(request) && request.charAt(0) !== '.' && request.charAt(0) !== '!') {
    cb(null, 'commonjs ' + request);
    return;
  }
  cb();
}
