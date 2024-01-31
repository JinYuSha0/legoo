const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');

const babelConfig = require('../babel.config');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    // Presets and plugins imported from main babel.config.js in root dir
    presets: babelConfig.presets,

    plugins: ['react-native-web', ...(babelConfig.plugins || [])],
  },
};

// Babel loader configuration
const babelLoaderConfiguration = {
  test: /.[tj]sx?$/,
  exclude: [
    {
      and: [
        path.resolve(appDirectory, 'node_modules'),
        path.resolve(appDirectory, 'ios'),
        path.resolve(appDirectory, 'android'),
      ],
      not: [],
    },
  ],
  use: babelLoader,
};

const mjsLoaderConfiguration = {
  test: /\.mjs$/,
  include: [path.resolve(appDirectory, 'node_modules')],
  type: 'javascript/auto',
  use: babelLoader,
};

const styleLoaderConfiguration = {
  test: /\.css$/i,
  use: ['style-loader', 'css-loader', 'postcss-loader'],
};

// Image loader configuration
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

// File loader configuration
const fileLoaderConfiguration = {
  test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
};

module.exports = argv => {
  return {
    entry: path.resolve(appDirectory, 'index.web'),
    output: {
      clean: true,
      path: path.resolve(appDirectory, 'web/dist'),
      filename: '[name].[chunkhash].js',
      sourceMapFilename: '[name].[chunkhash].map',
      chunkFilename: '[id].[chunkhash].js',
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
      },
      extensions: [
        '.web.mjs',
        '.mjs',
        '.web.js',
        '.js',
        '.web.ts',
        '.ts',
        '.web.jsx',
        '.jsx',
        '.web.tsx',
        '.tsx',
      ],
    },
    module: {
      rules: [
        babelLoaderConfiguration,
        mjsLoaderConfiguration,
        imageLoaderConfiguration,
        fileLoaderConfiguration,
        styleLoaderConfiguration,
      ],
    },
    plugins: [
      // Fast refresh plugin
      new ReactRefreshWebpackPlugin(),

      // Plugin that takes public/index.html and injects script tags with the built bundles
      new HtmlWebpackPlugin({
        template: path.resolve(appDirectory, 'web/public/index.html'),
      }),

      // Defines __DEV__ and process.env as not being null
      new webpack.DefinePlugin({
        __DEV__: argv.mode !== 'production' || true,
        process: {env: {}},
      }),
    ],
    optimization: {
      // Split into vendor and main js files
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial',
          },
        },
      },
    },
    devServer: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
};
