const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    clean: true,
    path: resolve(__dirname, './dist'),
    // 只针对分包的文件命名
    chunkFilename: '[name]_chunk.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  devServer: {
    port: 9527,
    open: true,
    client: {
      logging: 'none'
    },
    historyApiFallback: true,
    static: ['public', 'content']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(jpg | png | jpeg)$/,
        type: 'asset/resource',
        include: resolve(__dirname, '/src/assets')
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
        include: resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
