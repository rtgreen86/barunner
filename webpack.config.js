const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: 'BaRunner',
      filename: 'index.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|wav)$/,
        use: [
          'file-loader',
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

module.exports = [
  Object.assign({
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      // for debug local
      host: 'localhost',

      // for debug on phone
      // allowedHosts: 'all',
      // host: '192.168.217.141',

      port: 'auto',
      static: {
        directory: path.resolve(__dirname, 'dist'),
      }
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  }, config),
  Object.assign({
    name: 'prod',
    mode: 'production',
    output: {
      filename: '[name].[contenthash].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  }, config),
];
