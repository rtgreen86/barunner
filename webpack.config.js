const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'inline-source-map',
  devServer: {
    host: 'localhost',
    port: 'auto',
    static: {
      directory: path.resolve(__dirname, 'dist'),
    }
  },
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
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
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
      }
    ]
  }
}
