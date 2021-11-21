const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: './src/main.js',
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
        test: /\.json$/,
        loader: 'file-loader',
        type: 'javascript/auto'
      },
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
      }
    ]
  }
}

module.exports = [
  Object.assign({
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      host: 'localhost',
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
      filename: 'main.min.js',
      path: path.resolve(__dirname, 'dist'),
    },
  }, config),
];
