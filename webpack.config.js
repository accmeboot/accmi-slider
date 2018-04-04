'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const STYLE_LOADER = [
  'style-loader',
  'css-loader',
  'sass-loader'
];
const EXTRACT_STYLE_LOADER = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  'sass-loader'
];

const config = {
  context: path.join(__dirname, 'src'),

  entry: {
    index: ['babel-polyfill', './index']
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },

  resolve: {
    modules: [path.resolve('node_modules')],
    extensions: ['.web.js', '.js', '.jsx', '.json', '.scss', '.css']
  },

  devtool: NODE_ENV === 'development' ? 'eval' : false,
  mode: NODE_ENV === 'development' ? 'development' : 'production',
  target: 'web',
  node: {
    fs: 'empty'
  },

  module: {

    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.(scss|css)$/,
        use: NODE_ENV === 'development' ? STYLE_LOADER : EXTRACT_STYLE_LOADER,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(woff2|woff?|otf|ttf|eot|svg)$/,
        loader: 'file-loader?name=[path][name].[ext]?[hash:base64:5]',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name:'[path][name].[ext]?[hash:base64:5]'
            }
          }
        ]
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    hot: true,
    inline: true,
    historyApiFallback: true,
    host: 'localhost',
    port: 9093,
    stats: {
      assets: true,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunks: true,
      chunkModules: true,
      optimizationBailout: true
    },
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      title: 'Custom template using Handlebars',
      template: 'index.html',
      inject: 'body',
      hash: true
    })
  ]
};

if (NODE_ENV === 'production') {
  config.plugins.push(
    new UglifyJsPlugin({
      sourceMap: false
    })
  );
}

if (NODE_ENV === 'development') {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = config;
